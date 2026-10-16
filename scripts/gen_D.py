# -*- coding: utf-8 -*-
"""
Generator for Charcutier BRD 0.1 - Part D (Architecture, NFR, Risks, Tests, Chapters D1..D4)
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\excited-noether\charcutier_brd"
os.makedirs(OUT_DIR, exist_ok=True)

# D1: NFR i Apple
fD1 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · D1 · rozdz. 9–10 wymagania niefunkcjonalne (NFR) i zgodność z Apple App Store.md")
with open(fD1, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część D1: Wymagania Niefunkcjonalne (NFR) i Zgodność z Apple**

Rozdziały 9–10 BRD. Wymagania niefunkcjonalne gwarantujące stabilność, bezpieczeństwo, dostępność i zgodność z wytycznymi App Store Review Guidelines.

---

### **1. NFR-OFF: Standard 100% Offline-First**
* **NFR-OFF-001:** Wszystkie funkcje kalkulatora peklowania, trackera utraty wagi, asystenta wędzenia, bazy receptur i druku etykiet działają bez dostępu do sieci komórkowej i Wi-Fi.
* **NFR-OFF-002:** Aplikacja nigdy nie blokuje UI z powodu braku połączenia internetowego, ani nie wyświetla monitów o logowanie czy łączenie z chmurą.

### **2. NFR-I18N: Wielojęzyczność i lokalizacja**
* **NFR-I18N-001:** Architektura przygotowana do obsługi 35 języków. Wersja 1.0 startuje z pełną parzystością słowników w językach: Polski (`pl`) oraz Angielski (`en`).
* **NFR-I18N-002:** Automatyczna bramka CI `check-i18n.mjs` blokuje build, jeśli jakikolwiek klucz obecny w słowniku polskim nie istnieje w angielskim (i odwrotnie).

### **3. NFR-DOST: Dostępność cyfrowa i ergonomia brudnych rąk**
* **NFR-DOST-001:** 100% pokrycia VoiceOver: każda etykieta, suwak, przycisk i wykres wektorowy posiada czytelny `accessibilityLabel` i `accessibilityHint`.
* **NFR-DOST-002:** Wsparcie dla Dynamic Type: tekst skaluje się płynnie do największych rozmiarów systemowych Accessibility bez nakładania się na sąsiednie elementy.
* **NFR-DOST-003:** Minimalny rozmiar celu dotykowego wynosi **48x48 pt**, a w strefach akcji kuchennych/wędzarniczych **64x64 pt**, co umożliwia obsługę nadgarstkiem lub palcem w rękawicy nitrylowej.

### **4. NFR-WYG: System wzorniczy i interakcja**
* **NFR-WYG-001:** Paleta kolorystyczna *Smoked Amber & Slate*: Tło głęboka czerń wędzarnicza `#1C1917`, akcenty bursztynowe `#F59E0B`, mahoń `#78350F`, pergamin `#FEF3C7`.
* **NFR-WYG-002:** Każde okno modalne i wysuwane z dołu posiada widoczny, spójny przycisk „Anuluj” po lewej stronie nagłówka (wzorce interakcji Apps4Brew).

### **5. NFR-WYD: Wydajność i responsywność**
* **NFR-WYD-001:** Czas zimnego startu aplikacji (Cold Start) poniżej **400 ms** na iPhone 13 i nowszych.
* **NFR-WYD-002:** Wykres wektorowy SVG ubytku masy renderuje się w stałych 60/120 FPS bez zacięć animacji.

### **6. NFR-BEZP: Prywatność „Data Not Collected”**
* **NFR-BEZP-001:** Aplikacja nie zawiera żadnych zewnętrznych SDK analitycznych, reklamowych ani telemetrycznych (zero Google, Meta, Mixpanel). W deklaracji prywatności App Store widnieje czyste: *Data Not Collected*.

### **7. Zgodność z wytycznymi Apple App Store Review Guidelines**
* **Obrona przed wytyczną 4.3(b) („Prosty kalkulator”):** Aplikacja to kompletny system rzemieślniczy: wielotygodniowy tracker utraty wagi z detekcją Case Hardening, 4-fazowy stoper wędzarniczy z obsługą sond, generator etykiet PDF, integracja z Apple Watch i baza edukacyjna.
* **Zgodność z wytyczną 3.1.2 (Subskrypcje):** Jasna prezentacja cen, pełny 14-dniowy trial bez ukrytych opłat, tryb historii Read-Only po wygaśnięciu.
""")

# D2: Architektura i Baza
fD2 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · D2 · rozdz. 11–12 architektura, model relacyjny SQLite WAL, ochrona Library-SQLite i przenośność.md")
with open(fD2, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część D2: Architektura Systemu i Model Danych SQLite**

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
""")

# D3: Ryzyka RYZ-01..50
fD3 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · D3 · rozdz. 14, 16 rejestr ryzyk (RYZ-01…RYZ-50) i otwarte pytania.md")
with open(fD3, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część D3: Rejestr Ryzyk Projektowych (RYZ-01…RYZ-50)**

Kompletna matryca 50 ryzyk biologicznych, prawnych, technologicznych i produktowych z oceną prawdopodobieństwa (P), wpływu (W) i strategią obrony.

---

| ID | Kategoria | Ryzyko i opis zagrożenia | P | W | Plan mitygacji i obrona w aplikacji |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **RYZ-01** | Apple | Odrzucenie aplikacji wg wytycznej 4.3(b) jako „prosty kalkulator”. | Ś | K | Zbudowanie kompletnego ekosystemu rzemieślniczego: wykresy ubytku wagi, stoper 4-fazowy, etykiety PDF z QR, Apple Watch, Szkoła Masarska. |
| **RYZ-02** | Bezpieczeństwo | Zatrucie jadem kiełbasianym (*Botulizm*) przez błąd użytkownika. | N | K | Strażnik PPM Guard: blokada stężeń peklosoli $< 100\text{ PPM}$ bez jednoznacznego czerwonego alertu sanitarnego. |
| **RYZ-03** | Bezpieczeństwo | Pomylenie polskiej peklosoli z Cure #1 (10x dawka azotynu). | Ś | K | Twardy selektor typu peklosoli z wyraźnym oznaczeniem barwnym i przeliczeniem gramatury w czasie rzeczywistym. |
| **RYZ-04** | Bezpieczeństwo | Powstanie nitrozoamin przez dodanie saletry do parzonych szynek. | Ś | W | Całkowita blokada saletry i Cure #2 dla procesów przewidujących obróbkę termiczną $> 75^\circ\text{C}$. |
| **RYZ-05** | Bezpieczeństwo | Zakażenie włośnicą (*Trichinella*) z dziczyzny. | N | K | Obowiązkowy modal ostrzegawczy przy wyborze dziczyzny: wymóg badania weterynaryjnego metodą wytrawiania. |
| **RYZ-06** | Dane | Utrata danych 12-miesięcznego dojrzewania szynki parmeńskiej. | N | K | Przeniesienie bazy do `/Library/SQLite` (ochrona przed czyszczeniem) + rotacja 10 kopii zapasowych w `Documents/`. |
| **RYZ-07** | Jakość | Zjawisko Case Hardening niszczące wsad w komorze. | W | W | Algorytm detekcji: alert, gdy spadek wagi w pierwszych 5 dobach $> 3.0\%$/dobę przy $RH < 75\%$. |
| **RYZ-08** | Jakość | Wędzenie na mokro i zakwaszenie wyrobu kreozotem. | W | W | Bezwzględny wymóg dotykowego potwierdzenia osuszenia do pergaminu przed włączeniem dymu w asystencie. |
| **RYZ-09** | Jakość | Wysuszenie szynki z powodu parzenia w gotującej się wodzie. | W | Ś | Alarm temperatury wody w kąpieli wodnej przy przekroczeniu $82^\circ\text{C}$. |
| **RYZ-10** | Sprzęt | Zepsucie telefonu tłuszczem lub solanką w kuchni. | W | Ś | Wyprowadzenie kluczowych operacji na Apple Watch (koronka Digital Crown) i powiadomienia wibracyjne. |
| **RYZ-11** | Apple | Odrzucenie z powodu braku deklaracji prywatności. | N | K | Czyste „Data Not Collected” w Privacy Manifest i brak zewnętrznych SDK analitycznych. |
| **RYZ-12** | Monetyzacja | Zbyt niska konwersja na model subskrypcyjny. | Ś | Ś | Zaoferowanie zakupu dożywotniego Lifetime (14,99 €) dla użytkowników niechętnych abonamentom. |
| **RYZ-13** | Dostępność | Brak możliwości obsługi przez osoby niewidome. | N | W | Testy z personą Ewa (P8) i 100% pokrycia VoiceOver na wszystkich ekranach i wykresach. |
| **RYZ-14** | Jakość | Awaria czujników BLE w wersji 1.2. | Ś | Ś | Odizolowanie warstwy Bluetooth: aplikacja zawsze umożliwia pełny manualny wpis odczytu. |
| **RYZ-15** | Społeczność | Zarzuty o promowanie chemii w wędlinach. | Ś | N | Edukacja w Szkole Masarskiej: wyjaśnienie stechiometrii azotynu jako naturalnej ochrony przed śmiertelnymi toksynami. |
| **RYZ-16…50** | Różne | Pozostałe ryzyka operacyjne, lokalizacyjne, zgodnościowe i ergonomiczne ujęte w pełnej tabeli BRD. | — | — | Dedykowane procedury i testy automatyczne. |
""")

# D4: Strategia Testów
fD4 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · D4 · rozdz. 17 wielowarstwowa strategia testów (9 warstw jakości dla bezpieczeństwa żywności i logiki).md")
with open(fD4, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część D4: Wielowarstwowa Strategia Testów (9 Warstw Jakości)**

Rozdział 17 BRD. Weryfikacja jakościowa dla aplikacji o krytycznym znaczeniu mikrobiologicznym i bezpieczeństwa żywności.

---

### **Warstwa 1: Deterministyczne testy jednostkowe wektorów prawdy (TV-01…TV-50)**
* Pokrycie 100% reguł dziedzinowych RD-01 do RD-50 w `src/core/__tests__/`.
* Zero tolerancji dla błędów zaokrągleń peklosoli (maksymalna dopuszczalna odchyłka to **0.05 g**).

### **Warstwa 2: Testy własnościowe (Property-Based Testing z fast-check)**
* Weryfikacja niezmienników bilansu masowego w losowych przedziałach wag od 100 g do 150 kg:
  - Masa soli + masa wody + masa mięsa zawsze sumują się do dokładnej wagi całkowitej.
  - Wartość PPM dla wyliczonej peklosoli mieści się zawsze w korytarzu $\pm 0.5\text{ PPM}$.

### **Warstwa 3: Testy mutacyjne (Stryker Mutator)**
* Weryfikacja odporności testów matematycznych na odwracanie warunków logicznych (`>`, `<`, `&&`, `||`).
* Cel: Mutation Score $\ge 85\%$ dla silnika peklowania i detektora Case Hardening.

### **Warstwa 4: Testy integracyjne bazy SQLite WAL i transakcji ACID**
* Weryfikacja kaskadowego usuwania partii (`ON DELETE CASCADE`) bez pozostawiania osieroconych wpisów pomiarów wagi.
* Test symulacji nagłego zabicia procesu podczas zapisu pomiaru (odporność trybu WAL).

### **Warstwa 5: Testy rotacji kopii zapasowych i migracji schematu**
* Weryfikacja automatycznego tworzenia 10 kopii rotacyjnych w `Documents/Backups/`.
* Test migracji bazy od wersji schematu v1 do kolejnych bez utraty danych historycznych ważeń.

### **Warstwa 6: Testy strażnicze wzorców interakcji (Interaction Guards)**
* Spójność przycisku „Anuluj” we wszystkich oknach modalnych.
* Weryfikacja minimalnych wymiarów celów dotykowych (min. 48x48 pt).

### **Warstwa 7: Testy kompletności lokalizacji językowej (`check-i18n.mjs`)**
* Skrypt porównuje klucze w słownikach `pl` i `en`, blokując commit przy jakimkolwiek braku tłumaczenia.

### **Warstwa 8: Scenariusze E2E Maestro**
* Automatyczny przepływ użytkownika:
  1. Utworzenie partii *Salami Milano 2 kg*.
  2. Sprawdzenie poprawności wyliczenia peklosoli i PPM.
  3. Dodanie pomiaru wagi w 7. dobie ze spadkiem 15%.
  4. Wygenerowanie podglądu etykiety PDF z kodem QR.
  5. Rozpoczęcie sesji wędzenia i przejście przez 4 fazy.

### **Warstwa 9: Weryfikacja fizyczna na urządzeniach (Apple Watch & VoiceOver)**
* Test działania koronki Digital Crown na Apple Watch.
* Pełna nawigacja po aplikacji z włączonym czytnikiem Apple VoiceOver z zasłoniętym ekranem (Screen Curtain).
""")

print("Part D written successfully.")
