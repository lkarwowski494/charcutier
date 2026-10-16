/**
 * CHARCUTIER — Database Driver & Repository
 * Apps4Brew Studio (Expo 57 / SQLite WAL / Strict Foreign Keys)
 */

import * as SQLite from 'expo-sqlite';
import { SCHEMA_SQL } from './schema';
import { DB_FILENAME, ensureDatabaseDirectories } from './db-path';
import {
  Batch,
  CuringLog,
  WeightLog,
  SmokeSession,
  PantryItem,
  Recipe,
  AppSettings,
  LicenseTier,
} from '../types';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Returns active database instance or opens a new one
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }
  await ensureDatabaseDirectories();
  dbInstance = await SQLite.openDatabaseAsync(DB_FILENAME);
  return dbInstance;
}

/**
 * Synchronous getter when database is already initialized
 */
export function getDatabaseSync(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync(DB_FILENAME);
  }
  return dbInstance;
}

/**
 * Set an external DB instance (useful for in-memory test mocks)
 */
export function setDatabaseInstance(db: SQLite.SQLiteDatabase | null): void {
  dbInstance = db;
}

/**
 * Initializes database: sets WAL mode, enables foreign keys, applies DDL schema,
 * and sets default app settings if not initialized.
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await getDatabase();

  // Enforce WAL mode and foreign keys
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Apply schema
  await db.execAsync(SCHEMA_SQL);

  // Initialize default app_settings if empty
  const trialStart = await getSetting('trial_start_timestamp');
  if (!trialStart) {
    const now = Date.now().toString();
    await setSetting('trial_start_timestamp', now);
    await setSetting('app_lang', 'pl');
    await setSetting('unit_system', 'metric');
  }

  return db;
}

/* ====================================================================
   APP SETTINGS REPOSITORY
   ==================================================================== */

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_settings WHERE key = ?',
    [key]
  );
  return row ? row.value : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key, value]
  );
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM app_settings'
  );
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

/* ====================================================================
   BATCHES REPOSITORY
   ==================================================================== */

export async function createBatch(batch: Batch): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO batches (id, name, meat_type, cut_type, initial_weight_g, target_loss_pct, cure_type, status, created_at, updated_at, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      batch.id,
      batch.name,
      batch.meat_type,
      batch.cut_type,
      batch.initial_weight_g,
      batch.target_loss_pct,
      batch.cure_type,
      batch.status,
      batch.created_at,
      batch.updated_at,
      batch.notes,
    ]
  );
}

export async function getBatchById(id: string): Promise<Batch | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Batch>('SELECT * FROM batches WHERE id = ?', [id]);
  return row || null;
}

export async function getAllBatches(): Promise<Batch[]> {
  const db = await getDatabase();
  return await db.getAllAsync<Batch>('SELECT * FROM batches ORDER BY created_at DESC');
}

export async function updateBatch(id: string, updates: Partial<Batch>): Promise<void> {
  const db = await getDatabase();
  const fields = Object.keys(updates).filter((k) => k !== 'id');
  if (fields.length === 0) return;

  const setClause = fields.map((k) => `${k} = ?`).join(', ');
  const values = fields.map((k) => (updates as any)[k]);
  values.push(Date.now()); // updated_at
  values.push(id);

  await db.runAsync(
    `UPDATE batches SET ${setClause}, updated_at = ? WHERE id = ?`,
    values
  );
}

export async function deleteBatch(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM batches WHERE id = ?', [id]);
}

/* ====================================================================
   CURING LOGS REPOSITORY
   ==================================================================== */

export async function createCuringLog(log: CuringLog): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO curing_logs (id, batch_id, salt_g, cure_salt_g, cure_salt_type, calculated_ppm, water_ml, spices_json, target_days, started_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      log.id,
      log.batch_id,
      log.salt_g,
      log.cure_salt_g,
      log.cure_salt_type,
      log.calculated_ppm,
      log.water_ml,
      log.spices_json,
      log.target_days,
      log.started_at,
      log.completed_at,
    ]
  );
}

export async function getCuringLogByBatchId(batchId: string): Promise<CuringLog | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<CuringLog>(
    'SELECT * FROM curing_logs WHERE batch_id = ?',
    [batchId]
  );
  return row || null;
}

/* ====================================================================
   WEIGHT LOGS REPOSITORY
   ==================================================================== */

export async function createWeightLog(log: WeightLog): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO weight_logs (id, batch_id, weight_g, loss_pct, daily_loss_rate, case_hardening_flag, temp_c, rh_pct, recorded_at, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      log.id,
      log.batch_id,
      log.weight_g,
      log.loss_pct,
      log.daily_loss_rate,
      log.case_hardening_flag,
      log.temp_c,
      log.rh_pct,
      log.recorded_at,
      log.notes,
    ]
  );
}

export async function getWeightLogsByBatchId(batchId: string): Promise<WeightLog[]> {
  const db = await getDatabase();
  return await db.getAllAsync<WeightLog>(
    'SELECT * FROM weight_logs WHERE batch_id = ? ORDER BY recorded_at ASC',
    [batchId]
  );
}

/* ====================================================================
   SMOKE SESSIONS REPOSITORY
   ==================================================================== */

export async function createSmokeSession(session: SmokeSession): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO smoke_sessions (id, batch_id, phase, target_temp_c, target_core_temp_c, wood_type, status, started_at, completed_at, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      session.id,
      session.batch_id,
      session.phase,
      session.target_temp_c,
      session.target_core_temp_c,
      session.wood_type,
      session.status,
      session.started_at,
      session.completed_at,
      session.notes,
    ]
  );
}

export async function getSmokeSessionsByBatchId(batchId: string): Promise<SmokeSession[]> {
  const db = await getDatabase();
  return await db.getAllAsync<SmokeSession>(
    'SELECT * FROM smoke_sessions WHERE batch_id = ? ORDER BY started_at ASC',
    [batchId]
  );
}

/* ====================================================================
   PANTRY REPOSITORY
   ==================================================================== */

export async function getAllPantryItems(): Promise<PantryItem[]> {
  const db = await getDatabase();
  return await db.getAllAsync<PantryItem>(
    'SELECT * FROM pantry_items ORDER BY category ASC, name ASC'
  );
}

export async function upsertPantryItem(item: PantryItem): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO pantry_items (id, category, name, quantity, unit, min_threshold, notes, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       category = excluded.category,
       name = excluded.name,
       quantity = excluded.quantity,
       unit = excluded.unit,
       min_threshold = excluded.min_threshold,
       notes = excluded.notes,
       updated_at = excluded.updated_at`,
    [
      item.id,
      item.category,
      item.name,
      item.quantity,
      item.unit,
      item.min_threshold,
      item.notes,
      item.updated_at,
    ]
  );
}

export async function deletePantryItem(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM pantry_items WHERE id = ?', [id]);
}

/* ====================================================================
   RECIPES REPOSITORY
   ==================================================================== */

export async function getAllRecipes(): Promise<Recipe[]> {
  const db = await getDatabase();
  return await db.getAllAsync<Recipe>('SELECT * FROM recipes ORDER BY title ASC');
}

export async function createRecipe(recipe: Recipe): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO recipes (id, title, meat_category, cure_method, salt_ratio, cure_ratio, target_loss_pct, spices_json, thermal_profile_json, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      recipe.id,
      recipe.title,
      recipe.meat_category,
      recipe.cure_method,
      recipe.salt_ratio,
      recipe.cure_ratio,
      recipe.target_loss_pct,
      recipe.spices_json,
      recipe.thermal_profile_json,
      recipe.description,
    ]
  );
}
