# Charcutier (Spiżarnia Mięsna / Masarz) — Instrukcje dla zespołu i agentów AI

Aplikacja mobilna (Expo / React Native, TypeScript, Apple Watch, Garmin, Live Activity) dla domowych masarzy, wędliniarzy rzemieślniczych i pasjonatów wędlin długodojrzewających, wędzonek oraz mięs peklowanych.  
Studio: **Apps4Brew** („tańsze niż dobre espresso”, rzemiosło, offline-first, zero serwerów, zero analityki szpiegującej).  
Właściciel produktu: Łukasz (`lkarwowski494`).

---

## 1. Dokumentacja referencyjna projektu (Google Drive & Repo)

* 📁 Folder główny projektu na Google Drive: [Charcutier](https://drive.google.com/drive/folders/1kH-du6Bh2WXfKAWx0OnwqooAzNpN7vPd)
* 📁 Dokumenty wymagań biznesowych: [Charcutier / 02 BRD](https://drive.google.com/drive/folders/1MVMA6mfHzFLNdgwvfClZSsAikMg0HLz1)
  * `charcutier_brd/Charcutier BRD 0.1 · 00 START — streszczenie, warianty MVP, spis treści.md`
  * `charcutier_brd/Charcutier BRD 0.1 · 00b Jedna lista decyzji (DEC-01…DEC-45).md`
  * `charcutier_brd/Charcutier BRD 0.1 · 00c Sprzeczności i errata.md`
  * `charcutier_brd/Charcutier BRD 0.1 · A1…A4 (Wizja, Persony, Rynek, Tabela zakresu Z-001…220, KPI, Marketing)`
  * `charcutier_brd/Charcutier BRD 0.1 · B1…B6 (Narzędzia: Peklowanie, Utrata Wagi, Wędzenie, Spiżarnia, Zegarki, Receptury)`
  * `charcutier_brd/Charcutier BRD 0.1 · C1…C5 (Nauka masarska, Reguły dziedzinowe RD-01…RD-50 z wektorami testowymi, Decyzje badacza)`
  * `charcutier_brd/Charcutier BRD 0.1 · D1…D4 (NFR, Model relacyjny SQLite WAL, 50 Ryzyk RYZ-01…50, Strategia testów 9 warstw)`
  * Kompletne jednotomowe wydanie: `docs/brd/CHARCUTIER_BRD_Kompletne_Wydanie.md`

---

## 2. Nienegocjowalne zasady produktu (Duch Apps4Brew & Rygor Masarski)

1. **ZP-01 Bezpieczeństwo biologiczne ponad wszystko (Safety-First):** Błąd w dawkowaniu soli lub azotynu grozi zatruciem jadem kiełbasianym (*Clostridium botulinum*) bądź toksycznością azotanową. Każda kalkulacja stężenia jest deterministyczna i walidowana w miligramach i PPM (Parts Per Million) wg norm USDA FSIS i UE.
2. **ZP-02 Tłuste i mokre ręce w masarni (Hands-Free):** Użytkownik operuje surowym mięsem, solankami i tłuszczem. Telefon leży w bezpiecznej odległości; kluczowe interakcje odbywają się na Apple Watch / Garmin (duże cele dotykowe, Digital Crown, wibracje Taptic Engine przy osiągnięciu temperatury rdzenia).
3. **ZP-03 Bez konta i bez logowania:** Zero ekranów rejestracji, brak zbędnego profilowania. Pierwszy widok po otwarciu to działający kalkulator lub aktywna partia.
4. **ZP-04 Bez serwerów i bez chmurowego AI:** Cała matematyka, kinetyka suszenia i profile wędzenia działają w 100% lokalnie na urządzeniu w trybie offline. Koszt krańcowy = 0 zł.
5. **ZP-05 Prywatność „Data Not Collected”:** Zero zewnętrznych SDK analitycznych i reklamowych. Żadne dane o partiach, datach i sprzęcie nie opuszczają urządzenia użytkownika.
6. **ZP-06 Dane nigdy nie giną:** Procesy dojrzewania trwają tygodniami i miesiącami (szynki nawet rok). Baza SQLite w trybie WAL chroniona w katalogu `/Library/SQLite` z rotacją 10 kopii zapasowych po każdej sesji.
7. **ZP-07 Kopia i eksport zawsze bezpłatne:** Pełny eksport do CSV i JSON dostępny bezpłatnie i bez ograniczeń.
8. **ZP-08 Uczciwy model monetyzacji:** $0.99/msc · $4.99/rok · $14.99 Lifetime (w Polsce: 3,99 zł · 19,99 zł · 59,99 zł). 14-dniowy bezpłatny okres próbny. Po wygaśnięciu: historia jest w pełni dostępna (read-only), blokowane jest jedynie tworzenie nowych nastawów.
9. **ZP-12 Rygor naukowy i hierarchia źródeł:** Każda liczba i reguła ma potwierdzone, przeczytane źródło (USDA FSIS, EFSA, PN-A-82007, IBPRS, literatura mistrzowska: Marianski, Kutas, Ruhlman). Żadnych halucynacji AI w recepturach!

---

## 3. Podstawy merytoryczne i hierarchia źródeł

1. **Szczebel 1 (Najwyższy):** Rachunek stechiometryczny i bilans masowy (stężenia %, PPM azotynu, równanie dyfuzji Ficka, ubytek masy wodnej).
2. **Szczebel 2:** Normy sanitarne i bezpieczeństwa żywności: USDA FSIS (9 CFR § 318.7), EFSA, Rozporządzenie (WE) nr 1333/2008, Polska Norma PN-A-82007.
3. **Szczebel 3:** Recenzowane publikacje naukowe i podręczniki akademickie (np. Adam i Stanley Marianski „The Art of Making Fermented Sausages”, Rytek i in. „Przetwórstwo mięsa”, Feiner „Meat Products Handbook”).
4. **Szczebel 4:** Uznane portale rzemieślnicze z wieloletnim dorobkiem (wedlinydomowe.pl, Meats and Sausages) oraz dokumentacja producentów kultur (Chr. Hansen / Bactoferm).
5. **Szczebel 5:** Tradycyjna praktyka domowych masarzy (jako wskazówka, zawsze wyraźnie oznaczona).

---

## 4. Architektura techniczna i standardy jakości

* **Baza danych:** SQLite z trybem WAL, schemat relacyjny: `batches`, `curing_logs`, `weight_logs`, `smoke_sessions`, `pantry_items`, `recipes`.
* **Standard weryfikacji:** Przed każdym commitem i wydaniem:
  * `npm run verify` (`npm run typecheck && npm run check:i18n && npm test`) musi przejść w 100% na zielono.
  * Pokrycie testami logiki dziedzinowej (`src/core/curing`, `src/core/weight-loss`, `src/core/smoking`) $\ge 95\%$.
  * Zero tolerancji dla błędów zaokrągleń peklosoli (błąd $> 0.1\text{ g}$ na wsadzie to błąd krytyczny blokujący wydanie).
* **Zasada interakcji:** Każde modalne okno ma spójny przycisk „Anuluj” w lewym górnym rogu. Formanty dotykowe min. 48x48 pt (zalecane 64x64 pt w strefie brudnych rąk).

---

## 5. Zintegrowane moduły dziedzinowe (Adaptacja z Napar, Piekarz, Słoik i Oczko)

1. **Reverse Process Scheduler (`src/core/reverse-scheduler.ts`):** Planowanie wstecz od docelowej daty biesiady (godziny i dni dla peklowania, ociekania, osuszania, dymienia, parzenia i studzenia) dla 5 procesów wędliniarskich.
2. **Batch Cost & Moisture-Loss Yield (`src/core/cost-calculator.ts`):** Bilans finansowy partii (mięso + jelita + przyprawy + energia) z uwzględnieniem ubytku wilgoci (kurcz 15–40%), koszt 100g plastra oraz oszczędności domowe vs sklep rzemieślniczy.
3. **6-Axis Sensory Radar (`src/core/sensory-radar.ts`, `src/components/SensoryRadarChart.tsx`):** Organoleptyczna ocena wędlin na 6 osiach (Słoność, Dymność, Kwasowość, Pikantność, Kruchość, Soczystość) z poligonem SVG.
4. **Butchery Doctor SOS & Kąpiel Odsalająca (`src/core/doctor-engine.ts`):** Diagnostyka 7 wad masarskich, próżniowa redystrybucja wilgoci dla Case Hardening oraz interaktywny kalkulator zimnej kąpieli odsalającej (3L wody/kg mięsa).
5. **Curated Masterclass Presets (`src/core/presets-data.ts`):** 8 autentycznych receptur mistrzowskich z 1-Tap wczytywaniem i skalowaniem proporcji soli oraz przypraw do wagi wsadu.
6. **Recipe Share Protocol (`src/core/recipe-share.ts`):** Wymiana receptur offline przez deep linki `charcutier://recipe?data=...` i kody QR z automatyczną blokadą toksycznych dawek peklosoli (>200 PPM).
7. **Watch Companion Sync (`src/services/watch-sync.ts`):** Kontrakty dla Apple Watch WCSession oraz Garmin ConnectIQ JSON API (kontrola temperatur rdzenia, czasu faz obróbki cieplnej i alarmów Case Hardening).

