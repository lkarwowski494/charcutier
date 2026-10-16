/**
 * CHARCUTIER — SQLite Database Schema & Migrations
 * Apps4Brew Studio (WAL Mode + Foreign Keys + Strict Types)
 */

export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- Global app configuration, licensing and trial state
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Active and historical charcuterie batches
CREATE TABLE IF NOT EXISTS batches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  meat_type TEXT NOT NULL,
  cut_type TEXT NOT NULL,
  initial_weight_g REAL NOT NULL,
  target_loss_pct REAL NOT NULL,
  cure_type TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  notes TEXT
);

-- Curing recipes and brine balances
CREATE TABLE IF NOT EXISTS curing_logs (
  id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL,
  salt_g REAL NOT NULL,
  cure_salt_g REAL NOT NULL,
  cure_salt_type TEXT NOT NULL,
  calculated_ppm REAL NOT NULL,
  water_ml REAL NOT NULL,
  spices_json TEXT NOT NULL,
  target_days INTEGER NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- Sequential weight measurements & case hardening tracking
CREATE TABLE IF NOT EXISTS weight_logs (
  id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL,
  weight_g REAL NOT NULL,
  loss_pct REAL NOT NULL,
  daily_loss_rate REAL NOT NULL,
  case_hardening_flag INTEGER NOT NULL DEFAULT 0,
  temp_c REAL,
  rh_pct REAL,
  recorded_at INTEGER NOT NULL,
  notes TEXT,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- Multi-phase smoking & thermal processing sessions
CREATE TABLE IF NOT EXISTS smoke_sessions (
  id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL,
  phase TEXT NOT NULL,
  target_temp_c REAL NOT NULL,
  target_core_temp_c REAL,
  wood_type TEXT,
  status TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  notes TEXT,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);

-- Butchery pantry: salt, nitrites, casings, woods
CREATE TABLE IF NOT EXISTS pantry_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  min_threshold REAL NOT NULL DEFAULT 0,
  notes TEXT,
  updated_at INTEGER NOT NULL
);

-- Curated and user recipes
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  meat_category TEXT NOT NULL,
  cure_method TEXT NOT NULL,
  salt_ratio REAL NOT NULL,
  cure_ratio REAL NOT NULL,
  target_loss_pct REAL NOT NULL,
  spices_json TEXT NOT NULL,
  thermal_profile_json TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Performance indices
CREATE INDEX IF NOT EXISTS idx_curing_batch ON curing_logs(batch_id);
CREATE INDEX IF NOT EXISTS idx_weight_batch ON weight_logs(batch_id);
CREATE INDEX IF NOT EXISTS idx_smoke_batch ON smoke_sessions(batch_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
`;
