# **Charcutier BRD 0.1 — 00b Jedna lista decyzji (DEC-01…DEC-45)**

Niniejszy rejestr grupuje wszystkie 45 otwartych decyzji produktowych, technologicznych i wdrożeniowych. Decyzje oznaczone symbolem ⚙ posiadają jednoznaczną rekomendację architektoniczno-analityczną.

---

### **Blok I — Decyzje przedstartowe (Tydzień 0, blokujące budowę)**

**DEC-01 Jaki zakres ma pierwsza wersja (MVP)?**
* *Kontekst:* Pełne MVP obejmuje 132 wymagania funkcjonalne. Rekomendacja zbalansowanego wariantu (b+) pozwala wypuścić aplikację w 3–4 tygodnie pracy agentów.
* *Opcje:* (a) Pełne MVP (132 BR, 30–38 dni); (b+) MUST + 6 akceleratorów (108 BR, 22–28 dni); (b) Tylko MUST (88 BR); (c) (b+) z sondami Bluetooth BLE; (d) Bez wędlin dojrzewających.
* *Rekomendacja:* **(b+)**.
* *Gdzie:* 00 START rozdz. 3, A rozdz. 6.

**DEC-02 Integracja z Apple Watch w MVP czy w 1.1?**
* *Kontekst:* Masarstwo to praca w tłuszczu i solance. Zegarek jest krytycznym wyróżnikiem wygody.
* *Opcje:* A) Wersja pełna na Apple Watch w MVP (odczyt temperatur, wibracja, wprowadzanie wagi koronką Digital Crown); B) Tylko Live Activity w Smart Stack w MVP, dedykowany Watch app w 1.1; C) Brak wsparcia zegarków w MVP.
* *Rekomendacja:* **A**.
* *Gdzie:* B5, D1, D3.

**DEC-03 Wsparcie dla zegarków Garmin w MVP?**
* *Kontekst:* Wielu wędliniarzy i myśliwych korzysta na co dzień z zegarków Garmin (seria Fēnix/Forerunner).
* *Opcje:* A) W MVP wraz z Apple Watch; B) Prototyp w MVP, pełna aplikacja Connect IQ w wersji 1.1; C) Całkowita rezygnacja z Garmina.
* *Rekomendacja:* **B** (Zmniejsza ryzyko opóźnienia MVP o 2–3 tygodnie certyfikacji Garmin).
* *Gdzie:* B5, A6.

**DEC-04 Identyfikator pakietu (Bundle ID)**
* *Opcje:* A) `com.apps4brew.charcutier` (neutralny, zgodny z portfolio marek Apps4Brew); B) `com.apps4brew.masarz`.
* *Rekomendacja:* **A** (`com.apps4brew.charcutier`).
* *Gdzie:* D1, app.json.

**DEC-05 Oficjalna nazwa w polskim i międzynarodowym App Store**
* *Kontekst:* Nazwa robocza: "Charcutier". Podtytuł musi jednoznacznie definiować profil i pozycjonowanie w ASO.
* *Opcje:* 
  * A) PL: „Charcutier — Spiżarnia i Masarz”, EN: „Charcutier — Curing & Smoking”;
  * B) PL: „Masarz — Peklowanie i Wędzenie”, EN: „MeatCraft”;
  * C) PL: „Spiżarnia Mięsna”, EN: „Charcuterie Master”.
* *Rekomendacja:* **A**.
* *Gdzie:* A1, A4.

**DEC-06 ⚙ Domyślna konwencja peklosoli (PL vs US)**
* *Kontekst:* Polska peklosól zawiera 0.5%–0.6% $NaNO_2$, podczas gdy w USA standardem jest Prague Powder #1 (InstaCure #1) zawierający 6.25% $NaNO_2$. Pomylenie tych produktów grozi śmiercią!
* *Opcje:* 
  * A) Wymuszony wybór typu peklosoli przy pierwszym uruchomieniu kalkulatora z wyraźnym oznaczeniem barwnym (zielony/żółty) i blokadą błędnych proporcji;
  * B) Automatyczny dobór na podstawie lokalizacji urządzenia (PL -> peklosól 0.5%, US -> Cure #1 6.25%) z możliwością zmiany w ustawieniach.
* *Rekomendacja:* **B z wymuszonym potwierdzeniem w UI**.
* *Gdzie:* 00c, B1, C2.

**DEC-07 ⚙ Hierarchia źródeł bezpieczeństwa żywności**
* *Opcje:* A) 5 szczebli: Rachunek stechiometryczny -> USDA FSIS / EFSA -> Podręczniki akademickie -> Portale rzemieślnicze (wedlinydomowe.pl) -> Praktyka domowa; B) Równorzędne traktowanie forów i literatury.
* *Rekomendacja:* **A**.
* *Gdzie:* C4, CLAUDE.md.

**DEC-08 ⚙ Minimalna wersja iOS i watchOS**
* *Opcje:* A) iOS 17 / watchOS 10; B) iOS 18 / watchOS 11 (pełny dostęp do Live Activity, nowych API wibracji i kontrolek Control Center).
* *Rekomendacja:* **B**.
* *Gdzie:* D1.

**DEC-09 ⚙ Silnik drukowania etykiet partii**
* *Opcje:* A) Wbudowany moduł generowania arkuszy HTML/PDF i natywny wydruk przez `expo-print`; B) Eksport obrazu PNG do galerii.
* *Rekomendacja:* **A** (Umożliwia profesjonalny druk etykiet A4 z siatką kodów QR).
* *Gdzie:* B4.

**DEC-10 ⚙ Model rotacji kopii zapasowych SQLite**
* *Opcje:* A) Automatyczna rotacja 10 kopii zapasowych w `Documents/Backups/` po każdej zmianie statusu partii wyrobu (standard Piekarza); B) Tylko ręczny eksport bazy.
* *Rekomendacja:* **A**.
* *Gdzie:* D2.

---

### **Blok II — Decyzje pierwszych dwóch tygodni (Architektura i Narzędzia)**

**DEC-11 Algorytm estymacji daty dojrzałości wędliny**
* *Opcje:* A) Prosta ekstrapolacja liniowa średniego ubytku dziennego; B) Model wykładniczo-logarytmiczny Ficka uwzględniający spadek tempa dyfuzji wody w miarę wysychania rdzenia.
* *Rekomendacja:* **B**.
* *Gdzie:* B2, C3 (RD-22).

**DEC-12 Czułość detektora Case Hardening**
* *Opcje:* A) Ostrzeżenie, gdy ubytek w pierwszych 5 dobach przekracza 3.5% na dobę przy wilgotności RH < 72%; B) Ostrzeżenie oparte wyłącznie na wilgotności bez wagi.
* *Rekomendacja:* **A**.
* *Gdzie:* B2, C3 (RD-25).

**DEC-13 Sposób wprowadzania wagi na Apple Watch**
* *Opcje:* A) Płynna zmiana cyfrową koronką Digital Crown (skok co 1 g lub 5 g) z haptycznym klikiem; B) Klawiatura numeryczna na ekranie zegarka.
* *Rekomendacja:* **A** (Idealne rozwiązanie przy obsłudze jednym palcem lub nadgarstkiem).
* *Gdzie:* B5.

**DEC-14 Profile drewna wędzarniczego w asystencie dymu**
* *Opcje:* A) 8 gatunków drewna (olcha, buk, dąb, jabłoń, wiśnia, grusza, śliwa, jałowiec) z charakterystyką aromatu, barwy i zalecanego wsadu; B) Prosty wybór „drzewo liściaste / owocowe”.
* *Rekomendacja:* **A**.
* *Gdzie:* B3, C1.

**DEC-15 Wykres profilu sensorycznego wyrobu (Sensory Radar)**
* *Opcje:* A) 5-osiowy wykres wektorowy SVG (Słoność, Dymność, Kwasowość, Twardość/Zwięzłość, Soczystość); B) Standardowe suwaki numeryczne 1–10.
* *Rekomendacja:* **A** (Spójność z radarem SCA z Napara i radarem bochenka z Piekarza).
* *Gdzie:* B6.

**DEC-16 Kalkulator kosztu wsadu mięsnego**
* *Opcje:* A) Obliczanie rzeczywistego kosztu 1 kg gotowego wyrobu uwzględniające ubytek masy (np. kupiono 1.5 kg schabu po 25 zł/kg, ubytek 35% -> 0.975 kg gotowej polędwicy = 38.46 zł/kg); B) Prosta suma cen składników bez uwzględnienia odparowania wody.
* *Rekomendacja:* **A**.
* *Gdzie:* B6.

**DEC-17 Granice bezpieczeństwa temperatury wewnętrznej w asystencie wędzenia**
* *Opcje:* A) Wymuszenie minimalnych temperatur bezpiecznych (drób: 74°C, wieprzowina szynka: 68°C, polędwica: 62°C) z niemożnością ustawienia niższego progu bez ostrzeżenia o ryzyku biologicznym; B) Pełna swoboda użytkownika bez ostrzeżeń.
* *Rekomendacja:* **A**.
* *Gdzie:* B3, D3.

**DEC-18 Obsługa szynkowarów i pras masarskich**
* *Opcje:* A) Dedykowany podmoduł kalkulatora dla szynkowarów (natarcia, rozprężanie termiczne, dobór woreczków, docisk sprężyny); B) Traktowanie szynkowaru jako zwykłego wędzenia bez dymu.
* *Rekomendacja:* **A**.
* *Gdzie:* B1, B3.

**DEC-19 Ostrzeżenie przed użyciem Cure #2 / Saletry w wyrobach parzonych**
* *Opcje:* A) Kategoryczna czerwona blokada UI: zakaz wyboru saletry lub Cure #2, jeśli użytkownik wybrał proces z obróbką termiczną powyżej 75°C (ryzyko powstawania nitrozoamin); B) Niezobowiązujący żółty komunikat.
* *Rekomendacja:* **A**.
* *Gdzie:* 00c, B1, C2.

**DEC-20 Wsparcie dla jelit naturalnych i sztucznych w magazynie**
* *Opcje:* A) Baza kalibrów jelit (np. baranie 18/20, 20/22 do kabanosów; wieprzowe 26/28, 28/30 do kiełbas; wołowe wiankowe do pasztetowej; osłonki białkowe i celulozowe) z przelicznikiem wydajności farszu na metr bieżący osłonki; B) Zwykłe pole tekstowe.
* *Rekomendacja:* **A**.
* *Gdzie:* B4.

---

### **Blok III — Decyzje przed publikacją w App Store (Monetyzacja i Zgodność)**

**DEC-21 Czas trwania okresu próbnego (Trial)**
* *Opcje:* A) 14 dni bezpłatnego trialu (standard Apps4Brew); B) 7 dni; C) Brak trialu.
* *Rekomendacja:* **A**.
* *Gdzie:* A2, D1.

**DEC-22 Zachowanie aplikacji po wygaśnięciu subskrypcji/trialu**
* *Opcje:* A) Historia partii, zapisane receptury i dotychczasowe wykresy pozostają w 100% dostępne w trybie read-only, blokowane jest jedynie tworzenie nowych nastawów; B) Całkowita blokada aplikacji.
* *Rekomendacja:* **A** (Etyka Apps4Brew, szacunek do pracy użytkownika).
* *Gdzie:* A2, D1.

**DEC-23 Obsługa Family Sharing (Chmura rodzinna Apple)**
* *Opcje:* A) Włączone dla subskrypcji i zakupu Lifetime (zwiększa atrakcyjność zakupu dla gospodarstw domowych); B) Wyłączone.
* *Rekomendacja:* **A**.
* *Gdzie:* A2.

**DEC-24 Lokalizacja językowa przy premierze**
* *Opcje:* A) Pełna dwujęzyczność na start: Polski (rynek bazowy) i Angielski (globalny rynek charcuterie) z architekturą przygotowaną pod 35 języków; B) Tylko język polski.
* *Rekomendacja:* **A**.
* *Gdzie:* D1.

**DEC-25 Deklaracja prywatności Apple Privacy Label**
* *Opcje:* A) Czyste „Data Not Collected” (brak zbierania jakichkolwiek danych, brak SDK Google/Meta); B) Dodanie anonimowej analityki awarii.
* *Rekomendacja:* **A**.
* *Gdzie:* D1, CLAUDE.md.

---

### **Blok IV — Decyzje dla wersji 1.1 i 2.x (Rozwój)**

**DEC-26 Integracja z bezprzewodowymi sondami termicznymi Bluetooth BLE (np. Meater, ThermoPro)**
* *Rekomendacja:* Zaplanowane na wersję **1.2** po ustabilizowaniu rdzenia aplikacji i zdobyciu fizycznych urządzeń do testów.
**DEC-27 Integracja z sensorami wilgotności komory dojrzewalniczej BLE (np. RuuviTag, Inkbird)**
* *Rekomendacja:* Wersja **1.2**.
**DEC-28 Społecznościowa wymiana receptur w 100% offline (kod QR SVG / Deep Link `charcutier://recipe`)**
* *Rekomendacja:* Wdrożyć w wersji **1.1** (wzorem Napara i Piekarza).
**DEC-29 Tryb ciemny o wysokim kontraście do pracy w zadymionej wędzarni**
* *Rekomendacja:* Wdrożyć w wersji **1.1**.
**DEC-30 Wsparcie dla Apple Watch Complications i Smart Stack**
* *Rekomendacja:* Wdrożyć w wersji **1.1**.
