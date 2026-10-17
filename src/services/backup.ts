/**
 * CHARCUTIER — 10 Rolling JSON Backup Engine (Two-Pool Architecture)
 * Apps4Brew Studio (SEC-09, BR-TEST-022, BR-TEST-023, RD-ENG-12, NFR-SEC-015)
 *
 * Implements:
 * - Pool 1: 10 rolling auto-backups (`charcutier-kopia-*`)
 * - Pool 2: 10 rolling pre-destructive backups (`charcutier-przed-importem-*` / `charcutier-przed-czyszczeniem-*`)
 * - Collision resolution with `-2`, `-3` suffix in the same second
 * - Emergency corrupt state protection `state_corrupt_<timestamp>.json` with recovery payload
 * - CSV formula injection escape (NFR-SEC-015, RD-ENG-10)
 */

import * as FileSystem from 'expo-file-system/legacy';
import { getBackupDirectory, ensureDatabaseDirectories, APP_ID } from '../db/db-path';
import {
  getDatabase,
  getAllSettings,
  getAllBatches,
  getAllPantryItems,
  getAllRecipes,
  createBatch,
  createCuringLog,
  createWeightLog,
  createSmokeSession,
  upsertPantryItem,
  createRecipe,
  setSetting,
} from '../db/database';
import { BackupData, Batch, CuringLog, WeightLog, SmokeSession, PantryItem, Recipe } from '../types';

export const MAX_POOL_COUNT = 10;
export const AUTO_RE = /^charcutier-kopia-(\d{4}-\d{2}-\d{2}_\d{6})(?:-(\d+))?\.json$/;
export const SAFETY_RE = /^charcutier-przed-(?:importem|czyszczeniem)-(\d{4}-\d{2}-\d{2}_\d{6})(?:-(\d+))?\.json$/;

/**
 * Generates formatted ISO timestamp for filenames: YYYY-MM-DD_HHmmss
 */
export function getTimestampString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}${minutes}${seconds}`;
}

const poolKey = (m: RegExpExecArray) => `${m[1]}-${(m[2] ?? '1').padStart(3, '0')}`;

/**
 * Builds complete backup data snapshot from SQLite tables
 */
export async function buildBackupSnapshot(): Promise<BackupData> {
  const db = await getDatabase();

  const settings = await getAllSettings();
  const batches = await getAllBatches();
  const curing_logs = await db.getAllAsync<CuringLog>('SELECT * FROM curing_logs ORDER BY started_at ASC');
  const weight_logs = await db.getAllAsync<WeightLog>('SELECT * FROM weight_logs ORDER BY recorded_at ASC');
  const smoke_sessions = await db.getAllAsync<SmokeSession>('SELECT * FROM smoke_sessions ORDER BY started_at ASC');
  const pantry_items = await getAllPantryItems();
  const recipes = await getAllRecipes();

  return {
    version: 1,
    app: APP_ID as 'charcutier',
    created_at: new Date().toISOString(),
    timestamp: Date.now(),
    settings,
    batches,
    curing_logs,
    weight_logs,
    smoke_sessions,
    pantry_items,
    recipes,
  };
}

/**
 * Internal worker to write backup file with suffix collision resolution (-2, -3) and rotate pool
 */
async function writeBackupFile(
  prefix: string,
  re: RegExp,
  snapshot: BackupData
): Promise<string> {
  await ensureDatabaseDirectories();
  const backupDir = getBackupDirectory();

  const stamp = getTimestampString(new Date());
  let name = `${prefix}${stamp}.json`;

  for (let n = 2; n < 1000 && (await FileSystem.getInfoAsync(`${backupDir}${name}`)).exists; n++) {
    name = `${prefix}${stamp}-${n}.json`;
  }

  const filePath = `${backupDir}${name}`;
  const jsonContent = JSON.stringify(snapshot, null, 2);

  try {
    await FileSystem.writeAsStringAsync(filePath, jsonContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  } catch (e) {
    await FileSystem.deleteAsync(filePath, { idempotent: true }).catch(() => {});
    throw e;
  }

  // Rotacja danej puli do MAX_POOL_COUNT
  try {
    const files = await FileSystem.readDirectoryAsync(backupDir);
    const pool = files
      .map((f) => [f, re.exec(f)] as const)
      .filter((x): x is readonly [string, RegExpExecArray] => !!x[1]);

    const oldFiles = pool
      .map(([f, m]) => [f, poolKey(m)] as const)
      .sort((a, b) => (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0))
      .slice(MAX_POOL_COUNT);

    for (const [f] of oldFiles) {
      await FileSystem.deleteAsync(`${backupDir}${f}`, { idempotent: true });
    }
  } catch {
    // ignore pruning failure
  }

  return filePath;
}

/**
 * Creates auto-backup in Pool 1 (charcutier-kopia-*)
 */
export async function createBackup(prefix: string = `${APP_ID}-kopia-`): Promise<string> {
  const snapshot = await buildBackupSnapshot();
  const effectivePrefix = prefix.endsWith('-') ? prefix : `${prefix}-`;
  return await writeBackupFile(effectivePrefix, AUTO_RE, snapshot);
}

/**
 * Safety backup before critical operations in Pool 2 (charcutier-przed-importem- / charcutier-przed-czyszczeniem-)
 */
export async function safetyBackup(kind: 'import' | 'czyszczenie' | 'restore' = 'import'): Promise<string> {
  const snapshot = await buildBackupSnapshot();
  const prefix = kind === 'import' ? `${APP_ID}-przed-importem-` : `${APP_ID}-przed-czyszczeniem-`;
  return await writeBackupFile(prefix, SAFETY_RE, snapshot);
}

export interface CorruptStateRecovery {
  corruptFile: string;
  timestamp: string;
  rawSnippet: string;
}

/**
 * BR-TEST-023: Zapis uszkodzonego stanu do pliku ratunkowego state_corrupt_<timestamp>.json z polem recovery
 */
export async function saveCorruptState(rawPayload: string, reason: string): Promise<string> {
  await ensureDatabaseDirectories();
  const backupDir = getBackupDirectory();

  const stamp = getTimestampString(new Date());
  let name = `state_corrupt_${stamp}.json`;

  for (let n = 2; n < 1000 && (await FileSystem.getInfoAsync(`${backupDir}${name}`)).exists; n++) {
    name = `state_corrupt_${stamp}-${n}.json`;
  }

  const filePath = `${backupDir}${name}`;
  const envelope = {
    format: 'charcutier-corrupt-state',
    timestamp: new Date().toISOString(),
    reason,
    recovery: {
      rawPayload,
    },
  };

  await FileSystem.writeAsStringAsync(filePath, JSON.stringify(envelope, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return filePath;
}

/**
 * BR-TEST-023: Sprawdzenie czy istnieje zapisany uszkodzony stan po awarii
 */
export async function checkCorruptState(): Promise<CorruptStateRecovery | null> {
  try {
    await ensureDatabaseDirectories();
    const backupDir = getBackupDirectory();
    const dirInfo = await FileSystem.getInfoAsync(backupDir);
    if (!dirInfo.exists) return null;

    const files = await FileSystem.readDirectoryAsync(backupDir);
    const corruptFiles = files.filter((f) => f.startsWith('state_corrupt_')).sort().reverse();
    if (corruptFiles.length === 0) return null;

    const latest = corruptFiles[0];
    const content = await FileSystem.readAsStringAsync(`${backupDir}${latest}`);
    const parsed = JSON.parse(content);
    return {
      corruptFile: latest,
      timestamp: parsed.timestamp || '',
      rawSnippet: (parsed.recovery?.rawPayload || '').slice(0, 100),
    };
  } catch {
    return null;
  }
}

/**
 * Lists all existing backup files sorted by creation time (newest first)
 */
export async function listBackups(): Promise<
  Array<{ filename: string; path: string; timestamp: number; size: number }>
> {
  await ensureDatabaseDirectories();
  const backupDir = getBackupDirectory();

  try {
    const dirInfo = await FileSystem.getInfoAsync(backupDir);
    if (!dirInfo.exists) return [];

    const files = await FileSystem.readDirectoryAsync(backupDir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    const list = await Promise.all(
      jsonFiles.map(async (filename) => {
        const fullPath = `${backupDir}${filename}`;
        const info = await FileSystem.getInfoAsync(fullPath);
        const timestamp = info.exists && info.modificationTime ? info.modificationTime * 1000 : 0;
        const size = info.exists && info.size ? info.size : 0;

        return {
          filename,
          path: fullPath,
          timestamp,
          size,
        };
      })
    );

    list.sort((a, b) => b.filename.localeCompare(a.filename));
    return list;
  } catch (error) {
    console.warn('Could not list backups:', error);
    return [];
  }
}

/**
 * Deletes older backups keeping only MAX_POOL_COUNT in each pool
 */
export async function pruneOldBackups(): Promise<number> {
  await ensureDatabaseDirectories();
  const backupDir = getBackupDirectory();
  try {
    const files = await FileSystem.readDirectoryAsync(backupDir);
    let deleted = 0;

    for (const re of [AUTO_RE, SAFETY_RE]) {
      const pool = files
        .map((f) => [f, re.exec(f)] as const)
        .filter((x): x is readonly [string, RegExpExecArray] => !!x[1]);

      const oldFiles = pool
        .map(([f, m]) => [f, poolKey(m)] as const)
        .sort((a, b) => (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0))
        .slice(MAX_POOL_COUNT);

      for (const [f] of oldFiles) {
        await FileSystem.deleteAsync(`${backupDir}${f}`, { idempotent: true });
        deleted++;
      }
    }
    return deleted;
  } catch {
    return 0;
  }
}

/**
 * Restores the entire database from a BackupData object or JSON string.
 * Automatically triggers a safetyBackup before wiping/restoring.
 */
export async function restoreBackup(jsonStringOrData: string | BackupData): Promise<void> {
  const data: BackupData =
    typeof jsonStringOrData === 'string'
      ? JSON.parse(jsonStringOrData)
      : jsonStringOrData;

  if (!data || typeof data !== 'object' || data.app !== APP_ID) {
    throw new Error(`Invalid backup file: expected app "${APP_ID}", received "${data?.app}"`);
  }

  // Pre-restore safety backup
  await safetyBackup('restore');

  const db = await getDatabase();

  // Execute restore inside transaction
  await db.withTransactionAsync(async () => {
    // Clear all tables in dependency order
    await db.execAsync('DELETE FROM smoke_sessions;');
    await db.execAsync('DELETE FROM weight_logs;');
    await db.execAsync('DELETE FROM curing_logs;');
    await db.execAsync('DELETE FROM batches;');
    await db.execAsync('DELETE FROM pantry_items;');
    await db.execAsync('DELETE FROM recipes;');

    // Restore settings
    if (data.settings) {
      for (const [key, value] of Object.entries(data.settings)) {
        if (value !== undefined && value !== null) {
          await setSetting(key, String(value));
        }
      }
    }

    // Restore batches
    if (data.batches) {
      for (const batch of data.batches) {
        await createBatch(batch);
      }
    }

    // Restore curing logs
    if (data.curing_logs) {
      for (const log of data.curing_logs) {
        await createCuringLog(log);
      }
    }

    // Restore weight logs
    if (data.weight_logs) {
      for (const wLog of data.weight_logs) {
        await createWeightLog(wLog);
      }
    }

    // Restore smoke sessions
    if (data.smoke_sessions) {
      for (const session of data.smoke_sessions) {
        await createSmokeSession(session);
      }
    }

    // Restore pantry
    if (data.pantry_items) {
      for (const item of data.pantry_items) {
        await upsertPantryItem(item);
      }
    }

    // Restore recipes
    if (data.recipes) {
      for (const recipe of data.recipes) {
        await createRecipe(recipe);
      }
    }
  });
}

/**
 * Exports entire database as standalone JSON string
 */
export async function exportDatabaseToJson(): Promise<string> {
  const snapshot = await buildBackupSnapshot();
  return JSON.stringify(snapshot, null, 2);
}

/**
 * Escapes CSV field value to prevent Formula Injection (NFR-SEC-015, RD-ENG-10)
 * Prefix with apostrophe if string starts with '=', '+', '-', '@', '\t', '\r'
 */
export function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Exports batches and their weight metrics to CSV format with formula injection protection
 */
export async function exportBatchesToCsv(): Promise<string> {
  const batches = await getAllBatches();
  const db = await getDatabase();

  const headers = [
    'ID',
    'Nazwa',
    'Gatunek',
    'Element',
    'Waga_Poczatkowa_g',
    'Cel_Ubytku_pct',
    'Metoda_Peklowania',
    'Status',
    'Ostatnia_Waga_g',
    'Aktualny_Ubytek_pct',
    'Data_Utworzenia',
  ];

  const rows: string[] = [headers.join(',')];

  for (const b of batches) {
    const latestWeight = await db.getFirstAsync<WeightLog>(
      'SELECT * FROM weight_logs WHERE batch_id = ? ORDER BY recorded_at DESC LIMIT 1',
      [b.id]
    );

    const currentWeight = latestWeight ? latestWeight.weight_g : b.initial_weight_g;
    const currentLoss = latestWeight ? latestWeight.loss_pct : 0;
    const dateStr = new Date(b.created_at).toISOString().split('T')[0];

    rows.push(
      [
        escapeCsvValue(b.id),
        escapeCsvValue(b.name || ''),
        escapeCsvValue(b.meat_type || ''),
        escapeCsvValue(b.cut_type || ''),
        b.initial_weight_g.toFixed(1),
        b.target_loss_pct.toFixed(1),
        escapeCsvValue(b.cure_type || ''),
        escapeCsvValue(b.status || ''),
        currentWeight.toFixed(1),
        currentLoss.toFixed(1),
        escapeCsvValue(dateStr),
      ].join(',')
    );
  }

  return rows.join('\n');
}
