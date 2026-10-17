# Rejestr Decyzji Projektu — CHARCUTIER

**Stan:** 17.10.2026  
**Właściciel:** Łukasz  
**Odpowiedzialny za edycję:** Sekretarz dokumentacji  

Krótki dokument roboczy stanu bieżącego (zgodnie z Zasadą 6). Historia i archiwalne wersje trafiają do archiwum.

---

## Obowiązujące Zasady i Role (17.10.2026)

- **Zasady Uniwersalne:** 10 zasad uniwersalnych (decyzje u właściciela, dowód zamiast deklaracji, brak zgadywania, sprawdzanie rejestru decyzji, ocena realności problemu, zapis decyzji od razu, wyjątki nazwane, ograniczenia środowiska, szacowanie czasu agenta, biblioteka zasad i ról na Dysku).
- **Włączone Moduły z Biblioteki:**
  1. *Moduł: aplikacje (oprogramowanie)* — testy przed kodem, zielone lokalnie ≠ CI, darmowe limity, małe moduły ≤ 20 KB, audyt historii git, polityki Apple 5.1.3/2.3.7.
  2. *Moduł: research i treści merytoryczne* — brak zgadywania w dawkach azotynu, normy USDA FSIS / UE / PN-A-82007 sprawdzone u źródeł, pary zdań, odróżnienie kalkulacji użytkownika od twierdzeń.
  3. *Trzy zasady ogólne modułu gier* — jedno źródło prawdy z generatorami, udokumentowane ≠ zweryfikowane, kopie wariantów obok kanonu.
- **Obowiązujące Role:** Programista, Badacz merytoryczny, Analityk produktu, Projektant UX, Tester E2E, Tłumacz, Wydawca, Sekretarz dokumentacji.

---

## Dziennik Decyzji

### [D-001] 17.10.2026 — Przyjęcie Zasad Uniwersalnych i Modułów z Biblioteki
- **Kontekst:** Wdrożenie nadrzędnego reżimu pracy we wszystkich projektach studia.
- **Opcje:**
  - *Opcja A (Wybrana):* Wdrożenie 10 Zasad Uniwersalnych, modułów *aplikacje*, *research* oraz ról katalogowych.
- **Kompromis:** Większy rygor dowodowy przed każdym commitem, konieczność przedstawiania min. 2 opcji do decyzji.
- **Powód:** Eliminacja halucynacji, zgadywania i pętli błędów.

### [D-002] 17.10.2026 — Lokalizacja Rejestru Decyzji
- **Kontekst:** Wybór miejsca zapisu decyzji (Zasada 6).
- **Opcje:**
  - *Opcja A (Wybrana przez Właściciela):* Plik `docs/decyzje.md` w repozytorium gita.
  - *Opcja B:* Zewnętrzny dokument na Google Drive.
- **Kompromis:** Wersjonowanie w repozytorium obok kodu, edytowane ściśle przez Sekretarza dokumentacji.
- **Powód:** Spójność z gałęziami kodu i natychmiastowy dostęp offline.

### [D-003] 16.10.2026 — Standaryzacja Front-Endu: Apps4Craft Studio (`@apps4craft/ui`)
- **Kontekst:** Standaryzacja ekosystemu rzemieślniczego Apps4Craft Studio (Napar, Piekarz, Słoik, Masaż, Ferment).
- **Opcje:**
  - *Opcja A (Wybrana):* Podpięcie biblioteki `@apps4craft/ui` (`github:lkarwowski494/apps4craft-ui`), motyw `masaz` (akcent `#A43E38` wędzona wiśnia peklosoli, tło ceramiczny bazalt `#121214`), oficjalny wektorowy herb `MasazAppIcon`, przyciski fizyczne 52 pt z haptyką.
  - *Opcja B:* Samodzielna replikacja stylów lokalnie w projekcie bez zewnętrznej biblioteki.
- **Kompromis:** Zależność od wspólnego pakietu na GitHubie, w zamian za 100% spójność wizualną w całej rodzinie 5 aplikacji.
- **Powód:** Profesjonalizacja, spójność brandu i eliminacja redundancji kodu.

### [D-004] 16.10.2026 — The Craft Purge: Kasacja kalkulatora kosztów i redukcja zakładek
- **Kontekst:** Likwidacja rozpraszaczy i skupienie na esencji rzemiosła masarskiego.
- **Opcje:**
  - *Opcja A (Wybrana):* Usunięcie zbędnego modułu `cost-calculator` (przeliczniki PLN/kg), redukcja dolnej nawigacji z 5+ do 4 kluczowych zakładek (Warsztat, Dojrzewalnia, Dym & Zegar, Atelier/Ustawienia), zastąpienie kalkulatora kosztów silnikiem niestandardowych naczyń i szynkowarów (`custom-equipment`).
  - *Opcja B:* Pozostawienie kalkulatora finansowego w zakładce narzędziowej.
- **Kompromis:** Brak wyliczeń zysków w PLN, w zamian za czysty interfejs pasjonata rzemiosła.
- **Powód:** Pasjonaci rzemiosła tworzą wędliny dla jakości i tradycji, a nie oszczędności finansowych.

### [D-005] 16.10.2026 — Ergonomia kuchenna: Tryb Focus 72 pt i Sacred Numbers
- **Kontekst:** Praca przy blacie roboczym i wędzarni z tłustymi/mokrymi dłońmi.
- **Opcje:**
  - *Opcja A (Wybrana):* Wyniesienie kluczowych parametrów (Peklosól, Sól, Woda, Czas) na samą górę ekranu bez scrollowania; pełnoekranowy tryb Active Focus z gigantycznym zegarem 72 pt czytelnym z 3 metrów oraz `expo-keep-awake`.
  - *Opcja B:* Tradycyjny timer w małym komponencie na dole ekranu.
- **Kompromis:** Dedykowany modal pełnoekranowy zamiast widoku kompaktowego.
- **Powód:** Bezpieczeństwo i higiena pracy w kuchni/masarni.

### [D-006] 17.10.2026 — Zabezpieczenie .gitignore przed generowanymi folderami natywnymi
- **Kontekst:** Ryzyko przypadkowego commita tysięcy plików natywnych po lokalnym `expo prebuild`.
- **Opcje:**
  - *Opcja A (Wybrana przez Właściciela):* Wpisanie `/ios/` i `/android/` do `.gitignore`.
  - *Opcja B:* Brak wpisu, kontrola ręczna.
- **Kompromis:** Zerowy koszt, 100% ochrony przed zanieczyszczeniem repozytorium.
- **Powód:** Prewencja czystości repozytorium gita.

### [D-007] 17.10.2026 — Automatyczna bramka sprawdzania cykli zależności (check:cycles)
- **Kontekst:** Zapewnienie stałej zgodności z regułą braku cykli zależności modułów (Moduł: Aplikacje).
- **Opcje:**
  - *Opcja A (Wybrana przez Właściciela):* Włączenie `scripts/check-cycles.mjs` do bramki `verify` w `package.json`.
  - *Opcja B:* Skrypt uruchamiany wyłącznie doraźnie.
- **Kompromis:** Narzut ~0.1s na `npm run verify` w zamian za automatyczną blokadę regresji w CI.
- **Powód:** Twarda automatyzacja reguły architektonicznej.
