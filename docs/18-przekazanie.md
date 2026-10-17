# CHARCUTIER — Dokument Przekazania i Dziennik Inżynieryjny (BR-REL-018)

> **Aplikacja:** CHARCUTIER (Spiżarnia Mięsna / Masarz) — Apps4Craft Studio  
> **Repozytorium:** `lkarwowski494/charcutier`  
> **Wersja bieżąca:** 1.0.0 (Build 1)  
> **Data aktualizacji:** 2026-10-17  
> **Status:** Standard Role-Model BRD-QA-REL 1.0 Wdrożony

---

## 1. Stan Jakościowy Projektu

| Obszar / Metryka | Stan Bieżący | Wymóg BRD-QA-REL 1.0 | Status |
| :--- | :--- | :--- | :--- |
| **Kompilacja TypeScript** | 0 błędów (`tsc --noEmit`) | 0 błędów | ✅ ZDANE |
| **Higiena i18n** | 0 brakujących, 0 martwych kluczy | 0 brakujących / 0 martwych | ✅ ZDANE |
| **Pokrycie Macierzy AST** | **100% (79/79 elementów)** | 100% w 5 kategoriach | ✅ ZDANE |
| **Cykle w Zależnościach** | 0 cykli (`check:cycles`) | 0 cykli | ✅ ZDANE |
| **Zgodność Licencyjna** | 23/23 zależności permisywne | 100% permisywne (brak GPL) | ✅ ZDANE |
| **Niezmienniki Natywne iOS** | 20/20 spełnionych | 20 niezmienników | ✅ ZDANE |
| **Wyrocznie Referencyjne** | 2 generatory Python (solanka + kontrast) | 100% zgodności binarnej | ✅ ZDANE |
| **Pokrycie Logiki Domenowej** | 100% linii/funkcji, >95% gałęzi | 100% L/S/F, $\ge 90\%$ B | ✅ ZDANE |
| **Audyt 10 Ról (BR-REL-016)** | **0 Krytycznych, 0 Wysokich** | 0 Krytycznych, 0 Wysokich | ✅ ZDANE |

---

## 2. Rejestr Kluczowych Decyzji Architektonicznych (D1–D15)

- **D1 (2026-10-16): Architektura 100% Offline.**  
  Brak zewnętrznych serwerów i telemetrii. Baza SQLite (`expo-sqlite`) z FTS5 jako jedyne źródło prawdy dla partii i receptur.
- **D2 (2026-10-16): Model Obliczeniowy Solanki (Peckham/Curie).**  
  Peklowanie mokre uwzględnia łączną masę (mięso + woda) oraz precyzyjne limity azotynu sodu (150 mg/kg zgodnie z rozporządzeniem UE 2023/2108 i wytycznymi USDA).
- **D3 (2026-10-17): Odporność Timerów na Tło (RD-ENG-06 / NFR-PERF-004).**  
  Stan aktywnych etapów wędzenia oparty jest o bezwzględny znacznik czasu `endAtMs - Date.now()`, co eliminuje dryf po uśpieniu telefonu lub przejściu do innej aplikacji.
- **D4 (2026-10-17): Dwupulowy System Kopii Bezpieczeństwa (BR-TEST-022).**  
  Rozdzielono pule kopii ręcznych (`charcutier-kopia-*`) od automatycznych kopii asekuracyjnych (`charcutier-przed-importem-*` i `przed-czyszczeniem-*`). Kolizje sekundowe rozwiązywane przez sufiks `-2`.
- **D5 (2026-10-17): Ochrona Przed Uszkodzonym Stanem (BR-TEST-023).**  
  Błędny lub nieparsowalny plik bazy jest bezpiecznie izolowany w `state_corrupt_<timestamp>.json` z metadanymi `recovery` (oryginalna zawartość), a ekran główny wyświetla natychmiastowy baner odzyskiwania.
- **D6 (2026-10-17): Obsługa Kropki i Przecinka oraz wInKeep (BR-TEST-005 / NFR-INT-003).**  
  Wprowadzono komponent `NumInput` tolerujący zarówno `,` jak i `.` na klawiaturze numerycznej iOS/Android oraz mechanizm `wInKeep` zapobiegający kumulacji błędów konwersji gramy $\leftrightarrow$ funty/uncje.
- **D7 (2026-10-17): Zabezpieczenie Eksportu CSV (NFR-SEC-015 / RD-ENG-10).**  
  Wartości rozpoczynające się od `=`, `+`, `-`, `@`, `\t` lub `\r` są poprzedzane apostrofem `'`, zapobiegając atakom CSV Injection w Microsoft Excel i Apple Numbers.
- **D8 (2026-10-17): Czystość Mareka Handlowych (NFR-SEC-011).**  
  Kod i szablony wolne od zastrzeżonych marek komercyjnych (np. Bradley Smoker, Borniak, Thermomix).
- **D9 (2026-10-17): Izolacja Klucza Prywatnego Apple (NFR-SEC-003).**  
  Workflow `testflight.yml` generuje plik `AuthKey_*.p8` z prawami `umask 077` dopiero po zakończeniu instalacji zależności npm/pods i niszczy go w bloku `always()`.
- **D10 (2026-10-17): Skaner AST z Usuwaniem Szumów (BR-TEST-028..031).**  
  `scripts/test-matrix.mjs` wykorzystuje oficjalny kompilator TypeScript (`ts.createSourceFile`) i wycina komentarze, importy oraz tytuły bloków `test()` przed zliczaniem pokrycia.
- **D11 (2026-10-17): Usunięcie UIBackgroundModes audio (Apple Guideline 2.5.4 / BR-REL-013).**  
  Usunięto deklarację nieuprawnionego odtwarzania audio w tle z `app.json`, chroniąc aplikację przed odrzuceniem w App Store Review.
- **D12 (2026-10-17): Format Ikony App Store ColorType 2 (RD-ENG-11 / BR-REL-012).**  
  Skonwertowano `assets/icon.png` (1024x1024) do formatu 24-bit Truecolor RGB bez kanału alfa (ColorType 2), zgodnie z wymogami Apple Transportera.
- **D13 (2026-10-17): Poprawka Środowiska CI/CD: macos-14, Xcode 16 i origin/master (BR-REL-001 / BR-REL-005).**  
  Zastąpiono nieistniejący runner `macos-26` oficjalnym `macos-14`, zaktualizowano wersję Xcode do 16 oraz skorygowano weryfikację przodka gałęzi do `origin/master`.
- **D14 (2026-10-17): Testy Mutacyjne Stryker, Odmiana Liczebników i Nocny Potok nightly.yml (BR-TEST-032 / RD-ENG-08 / RD-ENG-09).**  
  Wdrożono Stryker Mutator z runnerem `jest.mutation.config.js`, funkcję `pluralPl` (RD-ENG-09) oraz potok nocny `.github/workflows/nightly.yml` z losowym ziarnem `PROP_SEED=random`.

---

## 3. Zestaw Komend Weryfikacyjnych

Główna komenda potoku weryfikacyjnego:
```bash
npm run verify
```

Pojedyncze bramki:
- `npm run typecheck` — weryfikacja typów TypeScript
- `npm run check:i18n` — weryfikacja kompletności słowników i18n
- `npm run check:matrix` — weryfikacja macierzy pokrycia AST (wymaga 100%)
- `npm run matrix:write` — wygenerowanie zaktualizowanego `docs/22-macierz-testow.md`
- `npm run check:cycles` — weryfikacja braku cykli w modułach
- `npm run check:maestro` — weryfikacja scenariuszy `.maestro/*.yaml`
- `npm run check:licenses` — audyt licencji zależności produkcyjnych
- `npm run verify:native` — audyt 20 niezmienników natywnych iOS
- `npm test` — pełny zestaw testów Jest (pokrycie domenowe 100%, testy własnościowe, testy dostępności)
