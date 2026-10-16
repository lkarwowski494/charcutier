/**
 * CHARCUTIER — Domain & Database Type Definitions
 * Apps4Brew Studio (Expo 57 / React Native 0.86.3 / SQLite WAL)
 */

export type MeatType =
  | 'pork'
  | 'beef'
  | 'wild_boar'
  | 'venison'
  | 'poultry'
  | 'lamb'
  | 'other';

export type CureType =
  | 'eq_dry'
  | 'wet_brine'
  | 'wet_injection'
  | 'traditional_dry';

export type CureSaltType =
  | 'peklosol_pl'   // 0.5% - 0.6% NaNO2
  | 'cure_1'        // Prague Powder #1 / InstaCure #1 (6.25% NaNO2, 93.75% NaCl)
  | 'cure_2'        // Prague Powder #2 (6.25% NaNO2, 4.0% KNO3)
  | 'saltpeter';    // KNO3 pure

export type BatchStatus =
  | 'curing'
  | 'drying'
  | 'smoking'
  | 'maturing'
  | 'ready'
  | 'archived';

export type SmokePhase =
  | 'drying'       // Warm air drying (no smoke) until parchment surface
  | 'smoking'      // Smoke application (cold/warm/hot)
  | 'poaching'     // Water bath or steam poaching (75-80°C to core temp)
  | 'cooling';     // Shock cooling in cold water

export type SmokeStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export type UnitSystem = 'metric' | 'imperial';
export type AppLanguage = 'pl' | 'en';
export type LicenseTier = 'monthly' | 'yearly' | 'lifetime' | null;

export interface AppSettings {
  app_lang: AppLanguage;
  unit_system: UnitSystem;
  trial_start_timestamp: number;
  purchased_receipt_tier: LicenseTier;
  seeded_v1?: string;
  [key: string]: string | number | null | undefined;
}

export interface Batch {
  id: string;
  name: string;
  meat_type: MeatType;
  cut_type: string;
  initial_weight_g: number;
  target_loss_pct: number;
  cure_type: CureType;
  status: BatchStatus;
  created_at: number;
  updated_at: number;
  notes: string | null;
}

export interface CuringLog {
  id: string;
  batch_id: string;
  salt_g: number;
  cure_salt_g: number;
  cure_salt_type: CureSaltType;
  calculated_ppm: number;
  water_ml: number;
  spices_json: string; // serialized JSON array of { name: string, g_per_kg: number, total_g: number }
  target_days: number;
  started_at: number;
  completed_at: number | null;
}

export interface WeightLog {
  id: string;
  batch_id: string;
  weight_g: number;
  loss_pct: number;
  daily_loss_rate: number;
  case_hardening_flag: number; // 0 or 1
  temp_c: number | null;
  rh_pct: number | null;
  recorded_at: number;
  notes: string | null;
}

export interface SmokeSession {
  id: string;
  batch_id: string;
  phase: SmokePhase;
  target_temp_c: number;
  target_core_temp_c: number | null;
  wood_type: string | null;
  status: SmokeStatus;
  started_at: number;
  completed_at: number | null;
  notes: string | null;
}

export interface PantryItem {
  id: string;
  category: 'cure' | 'spice' | 'casing' | 'wood' | 'other';
  name: string;
  quantity: number;
  unit: string;
  min_threshold: number;
  notes: string | null;
  updated_at: number;
}

export interface Recipe {
  id: string;
  title: string;
  meat_category: MeatType | string;
  cure_method: CureType;
  salt_ratio: number;
  cure_ratio: number;
  target_loss_pct: number;
  spices_json: string;
  thermal_profile_json: string;
  description: string;
}

export interface BackupData {
  version: number;
  app: 'charcutier';
  created_at: string;
  timestamp: number;
  settings: Record<string, string>;
  batches: Batch[];
  curing_logs: CuringLog[];
  weight_logs: WeightLog[];
  smoke_sessions: SmokeSession[];
  pantry_items: PantryItem[];
  recipes: Recipe[];
}

export interface AccessState {
  isUnlocked: boolean;
  isTrial: boolean;
  isExpired: boolean;
  trialDaysLeft: number;
  tier: LicenseTier;
  canMutate: boolean;
}
