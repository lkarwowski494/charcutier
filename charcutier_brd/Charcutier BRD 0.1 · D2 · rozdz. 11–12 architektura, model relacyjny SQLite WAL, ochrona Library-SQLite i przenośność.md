# **Charcutier BRD 0.1 — Część D2: Architektura Systemu i Model Danych SQLite**

Rozdziały 11–12 BRD. Relacyjny model bazy danych, ochrona plików przed usunięciem przez iOS i strategia kopii zapasowych.

---

## **1. Architektura ochrony bazy danych: Standard `/Library/SQLite` i Rotacja**

Zgodnie ze standardem studia Apps4Brew:
1. **Ochrona przed kasowaniem przez system (`db-path.ts`):** Baza danych `charcutier.db` umieszczona jest w katalogu `Library/SQLite/` zamiast w domyślnym `Documents/`. Zapobiega to przypadkowemu skasowaniu bazy przez mechanizmy czyszczenia pamięci podręcznej iOS.
2. **Tryb WAL (Write-Ahead Logging):** Baza działa z włączonym `PRAGMA journal_mode = WAL` oraz `PRAGMA synchronous = NORMAL`, co gwarantuje odporność na nagłe wyłączenie aplikacji w trakcie zapisu pomiaru wagi.
3. **Automatyczny backup rotacyjny (`backup.ts`):** Po każdej zakończonej sesji wędzenia lub dodaniu pomiaru wagi tworzona jest kopia zapasowa w katalogu `Documents/Backups/charcutier_backup_YYYYMMDD_HHMMSS.db`. System utrzymuje dokładnie 10 najnowszych kopii, rotacyjnie usuwając najstarsze.

---

## **2. Relacyjny schemat tabel (SQLite DDL)**

```sql
-- 1. Tabela Partii Wyrobów (Batches)
CREATE TABLE batches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    meat_type TEXT NOT NULL,          -- pork, beef, game, poultry
    cut_name TEXT NOT NULL,           -- szynka, schab, boczek, salami
    green_weight_g REAL NOT NULL,     -- waga poczatkowa (surowa)
    cure_method TEXT NOT NULL,        -- eq_dry, wet_immersion, injection
    target_salt_pct REAL NOT NULL,    -- np. 2.2
    target_ppm REAL NOT NULL,         -- np. 150
    peklosol_type TEXT NOT NULL,      -- polish_05, cure_1, pure_salt
    casing_type TEXT,                 -- hog_28_30, beef_middle, collagen
    casing_caliber_mm REAL,
    start_date TEXT NOT NULL,
    target_weight_loss_pct REAL NOT NULL DEFAULT 35.0,
    target_weight_g REAL NOT NULL,
    status TEXT NOT NULL,             -- curing, drying, smoking, finished, archived
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- 2. Tabela Dziennika Peklowania (Curing Logs)
CREATE TABLE curing_logs (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    brine_water_ml REAL,
    salt_g REAL NOT NULL,
    peklosol_g REAL NOT NULL,
    pure_salt_g REAL NOT NULL,
    injection_pct REAL,
    spices_json TEXT,                 -- json array ze skladnikami
    cure_start_date TEXT NOT NULL,
    cure_end_date TEXT NOT NULL,
    chamber_temp_c REAL,
    notes TEXT
);

-- 3. Tabela Pomiarów Utraty Wagi (Weight Logs)
CREATE TABLE weight_logs (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    timestamp TEXT NOT NULL,
    weight_g REAL NOT NULL,
    weight_loss_g REAL NOT NULL,
    weight_loss_pct REAL NOT NULL,
    chamber_temp_c REAL,
    chamber_rh_pct REAL,
    case_hardening_risk INTEGER NOT NULL DEFAULT 0, -- 0: brak, 1: ostrzezenie
    notes TEXT
);

-- 4. Tabela Sesji Wędzarniczych (Smoke Sessions)
CREATE TABLE smoke_sessions (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    start_time TEXT NOT NULL,
    end_time TEXT,
    wood_species TEXT NOT NULL,
    drying_duration_min INTEGER NOT NULL,
    drying_temp_c REAL NOT NULL,
    smoking_duration_min INTEGER NOT NULL,
    smoking_temp_c REAL NOT NULL,
    thermal_method TEXT NOT NULL,      -- water_poach, smoker_roast
    water_temp_c REAL,
    target_core_temp_c REAL NOT NULL,
    reached_core_temp_c REAL,
    cooling_duration_min INTEGER,
    notes TEXT
);

-- 5. Tabela Spiżarni i Inwentarza (Pantry Items)
CREATE TABLE pantry_items (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,           -- meat, casing, spice, wood
    name TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT NOT NULL,               -- g, kg, m, pcs
    purchase_date TEXT NOT NULL,
    expiry_date TEXT,
    cost_total REAL,
    location TEXT,                    -- freezer, pantry, cure_cave
    created_at TEXT NOT NULL
);

-- 6. Tabela Receptur Wzorcowych i Autorskich (Recipes)
CREATE TABLE recipes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    meat_type TEXT NOT NULL,
    recommended_cut TEXT,
    salt_pct REAL NOT NULL,
    ppm_target REAL NOT NULL,
    cure_method TEXT NOT NULL,
    ingredients_json TEXT NOT NULL,
    thermal_profile_json TEXT NOT NULL,
    is_system_preset INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);
```
