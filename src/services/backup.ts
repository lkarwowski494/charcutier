/**
 * CHARCUTIER — 10 Rolling JSON Backup Engine
 * Apps4Brew Studio (SEC-09: /Library/Application Support/Backups/)
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

const MAX_BACKUP_COUNT = 10;

/**
 * Generates formatted ISO timestamp for filenames: YYYY-MM-DD_HHmmss
 */
function getTimestampString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}_${hours}${minutes}${seconds}`;
}

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
 * Creates a JSON snapshot and enforces 10 rolling backups rotation
 */
export async function createBackup(prefix: string = APP_ID): Promise<string> {
  await ensureDatabaseDirectories();
  const backupDir = getBackupDirectory();
  const filename = `${prefix}_backup_${getTimestampString()}.json`;
  const filePath = `${backupDir}${filename}`;

  const snapshot = await buildBackupSnapshot();
  const jsonContent = JSON.stringify(snapshot, null, 2);

  await FileSystem.writeAsStringAsync(filePath, jsonContent, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  // Enforce rotation of 10 backups
  await pruneOldBackups();

  return filePath;
}

/**
 * Safety backup before critical operations (restore, import)
 */
export async function safetyBackup(trigger: string = 'safety'): Promise<string> {
  return await createBackup(`safety_${trigger}_${APP_ID}`);
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

    // Sort descending by filename / timestamp
    list.sort((a, b) => b.filename.localeCompare(a.filename));
    return list;
  } catch (error) {
    console.warn('Could not list backups:', error);
    return [];
  }
}

/**
 * Deletes older backups keeping only the MAX_BACKUP_COUNT most recent files
 */
export async function pruneOldBackups(): Promise<number> {
  const backups = await listBackups();
  // Filter only regular rolling backups (preserve explicit safety ones if desired, or include all)
  const regularBackups = backups.filter((b) => b.filename.startsWith(`${APP_ID}_backup_`));

  if (regularBackups.length <= MAX_BACKUP_COUNT) {
    return 0;
  }

  const toDelete = regularBackups.slice(MAX_BACKUP_COUNT);
  let deletedCount = 0;

  for (const item of toDelete) {
    try {
      await FileSystem.deleteAsync(item.path, { idempotent: true });
      deletedCount++;
    } catch (err) {
      console.warn(`Failed to delete old backup ${item.path}:`, err);
    }
  }

  return deletedCount;
}

/**
 * Restores the entire database from a BackupData object or JSON string.
 * Automatically triggers a safetyBackup before wiping/restoring.
 */
export async function restoreBackup(jsonStringOrData: string | BackupData): Promise<void> {
  // 1. Pre-restore safety backup
  await safetyBackup('pre_restore');

  const data: BackupData =
    typeof jsonStringOrData === 'string'
      ? JSON.parse(jsonStringOrData)
      : jsonStringOrData;

  if (data.app !== APP_ID) {
    throw new Error(`Invalid backup file: expected app "${APP_ID}", received "${data.app}"`);
  }

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

    // Restore settings (preserve license and language if provided)
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
 * Exports batches and their weight metrics to CSV format
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
        `"${b.id}"`,
        `"${b.name.replace(/"/g, '""')}"`,
        `"${b.meat_type}"`,
        `"${b.cut_type}"`,
        b.initial_weight_g.toFixed(1),
        b.target_loss_pct.toFixed(1),
        `"${b.cure_type}"`,
        `"${b.status}"`,
        currentWeight.toFixed(1),
        currentLoss.toFixed(1),
        `"${dateStr}"`,
      ].join(',')
    );
  }

  return rows.join('\n');
}
