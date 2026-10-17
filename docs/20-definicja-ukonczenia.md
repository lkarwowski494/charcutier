# CHARCUTIER — Definicja Ukończenia (Definition of Done, BR-REL-017)

> **Standard:** BRD-QA-REL 1.0 (Apps4Craft Studio)  
> **Status kontraktu:** Obowiązujący dla programistów, testerów i agentów AI  
> **Zasada naczelna:** Żadna funkcja ani wydanie nie zostaje uznane za zakończone, dopóki wszystkie poniższe bramki nie zostaną spełnione w 100%.

---

## 1. Bramki Jakościowe dla Pojedynczej Funkcji / Ekranu

Każda zmiana w kodzie aplikacji (`app/`, `src/`) musi przed scaleniem spełniać poniższe kryteria:

1. **Typowanie TypeScript:**  
   Brak jakichkolwiek błędów kompilatora (`npm run typecheck` bez flagi pomijania błędów, zakaz `any` i ignorowania ostrzeżeń).
2. **Higiena Wielojęzyczności (i18n):**  
   - Wszystkie teksty interfejsu pochodzą ze słowników `pl.ts` oraz `en.ts`.
   - Zakaz hardkodowania polskich napisów w komponentach `.tsx`.
   - Brak martwych ani brakujących kluczy (`npm run check:i18n` kończy się kodem 0).
3. **Strażnicy Interakcji (Guards S1–S16):**  
   - Każdy modal i arkusz posiada jawny przycisk zamknięcia `CloseButton` lub `DoneButton` (`S1`).
   - Przyciski destrukcyjne (usunięcie partii, wyczyszczenie bazy) wymagają systemowego dialogu potwierdzenia `confirmDestructiveAction` (`S5`).
   - Brak niekontrolowanych podwójnych tapnięć w formularzach i kalkulatorach.
4. **Dostępność i Ergonomia (A11y):**  
   - Minimalny efektywny rozmiar pola dotykowego $\ge 44 \times 44\text{ pt}$ (`hitSlop` lub styl).
   - Wszystkie ikony i przyciski bez tekstu posiadają `accessibilityLabel` i `accessibilityRole="button"`.
   - Obsługa powiększonego tekstu systemu iOS (`accessibilityMaxFontMultiplier={1.5}` lub `AX5`).
   - Brak ucinania tekstu w najwęższym wspieranym widoku ($320\text{ pt}$).
5. **Niezmienniki Danych i Konwersje (`wInKeep`):**  
   - Wszystkie pola numeryczne obsługują kropkę i przecinek (`NumInput`).
   - Zmiana jednostek miary (metryczne $\leftrightarrow$ imperialne) nie powoduje kumulacji błędów zaokrągleń (`wInKeep`).
6. **Pokrycie Testami Jednostkowymi:**  
   - 100% linii, instrukcji, funkcji i $\ge 90\%$ gałęzi w silnikach domenowych `src/core/`.
   - Zero ostrzeżeń `act()` lub nieprzechwyconych błędów w konsoli podczas testów.

---

## 2. Bramki Jakościowe dla Wydania Wersji (Release DoD)

Przed zatwierdzeniem wydania do TestFlight / App Store Connect muszą zostać spełnione:

1. **Macierz Testów AST (100% we wszystkich 5 kategoriach):**  
   Skrypt `npm run check:matrix` potwierdza 100% pokrycia dla:
   - `EKRAN` (wszystkie 8 tras Expo Router)
   - `UI` (wszystkie kluczowe kontrolki, przyciski, modale)
   - `TEKST` (kompletność słowników i18n)
   - `LOGIKA` (11 silników domenowych `src/core/`)
   - `WYMIAR` (strefy czasowe, formaty dat, rozmiary ekranu, dark mode)
2. **Czystość Architektury i Importów:**  
   Brak cyklicznych zależności (`npm run check:cycles` zwraca 0 cykli).
3. **Czystość Licencyjna Zależności:**  
   Brak licencji copyleft (GPL, AGPL, LGPL) w paczkach produkcyjnych (`npm run check:licenses`).
4. **Niezmienniki Natywne iOS:**  
   `npm run verify:native` potwierdza brak zabronionych uprawnień, poprawność deklaracji prywatności i flagi szyfrowania.
5. **Weryfikacja Przepływów E2E / Maestro:**  
   Kompletność scenariuszy `.maestro/*.yaml` (`npm run check:maestro`) i ich poprawne wykonanie w środowisku symulowanym.
6. **Audyt 10 Niezależnych Ról Audytorskich (BR-REL-015 / BR-REL-016):**  
   - Raport w `docs/25-audyt-*.md`.
   - Dokładnie **0 otwartych znalezisk `KRYTYCZNE` i `WYSOKIE`**.
   - Każde naprawione znalezisko posiada dedykowany test regresyjny w `tests/audit-fixes.test.tsx`.
7. **Aktualizacja Dokumentacji Przekazania:**  
   `docs/18-przekazanie.md` zawiera aktualny stan projektu, liczbę testów i historię decyzji.
