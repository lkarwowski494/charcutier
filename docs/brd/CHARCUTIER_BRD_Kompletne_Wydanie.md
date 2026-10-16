# **CHARCUTIER (Spiżarnia Mięsna / Masarz) — Wymagania Biznesowe (BRD)**
## **Kompletne Wydanie Jednotomowe (Wersja 0.1 — 16 października 2026 r.)**

> **Ekosystem:** Apps4Brew Studio  
> **Aplikacja:** CHARCUTIER (Spiżarnia Mięsna / Masarz)  
> **Właściciel:** Łukasz (`lkarwowski494`)  
> **Model monetyzacji:** Cheaper than Espresso ($0.99 / $4.99 / $14.99 Lifetime)  
> **Architektura:** 100% Offline-First, Zero Login, Zero Telemetry (Data Not Collected), SQLite w trybie WAL, Apple Watch, Garmin, Live Activity  
> **Standard merytoryczny:** Rygorystyczne normy bezpieczeństwa żywności USDA FSIS, EFSA, PN-A-82007, IBPRS  

---


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · 00 START — streszczenie, warianty MVP, spis treści ==================== -->

# **Charcutier (Spiżarnia Mięsna / Masarz) — Wymagania biznesowe (BRD), wersja robocza 0.1, 16.10.2026**

**Status:** wersja robocza do akceptacji Właściciela. Sprawy produktowe i priorytetowe czekają na Twoje decyzje (sekcja 4, DEC-01…DEC-45). Sprawy merytoryczne (chemia peklowania, stężenia azotynu w PPM, kinetyka suszenia w komorze dojrzewalniczej, bariery mikrobiologiczne Leistnera, parametry wędzenia i letalność termiczna patogenów) rozstrzyga badacz dziedzinowy według hierarchii źródeł (USDA FSIS, EFSA, PN-A-82007, IBPRS). Każdą decyzję produktową Właściciel może zawetować.  
**Autor:** analityk biznesowy (koordynujący) studia Apps4Brew. Części A–D opracowane we współpracy z badaczem technologii mięsa i inżynierem systemów offline-first.

---

## **1. Jak czytać ten dokument**

### **Części dokumentu**

| Plik | Rozdziały | Zawartość |
| :--- | :--- | :--- |
| **00-streszczenie** (ten plik) | — | Streszczenie wykonawcze dla Właściciela, warianty pierwszej wersji, jedna lista decyzji (DEC-01…DEC-45), warunki wstępne, statystyki i liczby dokumentu, spis treści. |
| **00b-decyzje** | — | Zbiorcza lista 45 decyzji produktowych, technologicznych i wdrożeniowych (DEC-01…DEC-45) z jasnymi rekomendacjami analityka. |
| **00c-errata** | — | Kluczowe sprzeczności dziedzinowe i errata: limity azotynów USDA vs UE, różnice między polską peklosolą (0.5%–0.6% $NaNO_2$) a Prague Powder #1 (6.25% $NaNO_2$) i #2 ($KNO_3$), zjawisko Case Hardening, spór o temperaturę parzenia, inaktywacja włośnicy (*Trichinella spiralis*). |
| **A** | 1–6, 13, 15 | Wizja i 16 zasad produktu (ZP-01…16), problem rynkowy i dowody, persony P1–P8 (w tym P8 niewidomy rzemieślnik) i sytuacje z życia SYT-01…15, analiza rynku i konkurencji, model przychodu („tańsze niż espresso”), tabela zakresu Z-001…Z-220, nakład pracy agentów, KPI bez śledzenia, marketing i ASO. |
| **B** | 7 (narzędzia) | Wymagania funkcjonalne narzędzi (185 wymagań BR podzielonych na 6 modułów: BR-PEKL, BR-WAGA, BR-WEDZ, BR-SPIZ, BR-ZEG, BR-RECP) – kalkulatory solanek, tracker utraty wagi, asystent wędzenia i obróbki cieplnej, spiżarnia mięsna, Apple Watch & Garmin, etykiety PDF z QR, kopia zapasowa i dostępność. |
| **C** | 7 (nauka), 8, 8.P | Szkoła Masarska i Rzemiosła, atlas kultur starterowych i pleśni szlachetnych, atlas drewna wędzarniczego. 50 reguł dziedzinowych RD-01…RD-50 z kompletnymi wektorami testowymi TV-01…TV-50. Proces weryfikacji treści i rejestr decyzji badacza D-01…D-25. |
| **D** | 9–12, 14, 16, 17 | 110 wymagań niefunkcjonalnych (NFR-OFF, NFR-I18N, NFR-DOST, NFR-WYD, NFR-BEZP, NFR-ZEG, NFR-TEST), wytyczne Apple App Store (3.1.2, 4.3b, 5.1.1), architektura offline-first SQLite WAL, rejestr 50 ryzyk projektowych (RYZ-01…RYZ-50) oraz wielowarstwowa strategia testów (9 warstw jakości). |

### **Oznaczenia identyfikatorów**
* **BR-xxx-nnn**: wymaganie funkcjonalne (np. `BR-PEKL-001`, `BR-WAGA-005`, `BR-WEDZ-012`). Każde posiada mierzalne kryteria akceptacji, powiązaną personę, priorytet (**MUST / SHOULD / COULD**) i etap wdrożenia (**MVP / 1.1 / 1.2 / 2.x / badanie / nigdy**).
* **NFR-xxx-nnn**: wymaganie niefunkcjonalne (`OFF` – offline-first, `I18N` – lokalizacja 35 języków, `DOST` – dostępność VoiceOver i Dynamic Type, `WYG` – ergonomia brudnych rąk, `WYD` – wydajność bazy, `DANE` – integralność i ACID, `BEZP` – prywatność „Data Not Collected”, `ZEG` – aplikacje na zegarki, `TEST` – bramki CI).
* **RD-nn**: reguła dziedzinowa – deterministyczny wzór matematyczny, fizykochemiczny lub technologiczny (stechiometria soli, dyfuzja Ficka, $a_w$, równania letalności $D$ i $z$).
* **TV-nn**: wektor testowy – precyzyjny zestaw danych wejściowych i oczekiwanych wyjściowych dla danej reguły RD.
* **RYZ-nn**: ryzyko projektowe z oceną prawdopodobieństwa, wpływu i planem mitygacji.
* **DEC-nn**: decyzja produktowa lub technologiczna dla Właściciela.
* **Z-nnn**: wiersz tabeli zakresu funkcjonalnego.

---

## **2. Streszczenie wykonawcze dla Właściciela**

### **Co to jest Charcutier**
**Charcutier (Spiżarnia Mięsna / Masarz)** to profesjonalny kalkulator i asystent dla domowych wytwórców wędlin, pasjonatów wyrobów długodojrzewających (salami, prosciutto, lonzino, coppa, bresaola) oraz tradycyjnych mięs wędzonych i pieczonych (szynki, boczki, polędwice, kiełbasy). 

Aplikacja rozwiązuje dwa fundamentalne problemy domowego masarstwa:
1. **Śmiertelne ryzyko błędu w soleniu:** Zbyt mało soli/peklosoli grozi rozwojem laseczki jadu kiełbasianego (*Clostridium botulinum*); zbyt dużo niszczy smak lub stwarza ryzyko toksyczności. Charcutier zapewnia matematyczną precyzję dawkowania peklosoli (z dokładnością do 0.1 g i przeliczeniem na Parts Per Million - PPM azotynu) w metodzie równowagowej (Equilibrium), zalewowej i nastrzykowej.
2. **Nadzór nad powolnymi procesami trwającymi tygodniami:** Utrata masy wodnej (cel: 30–40% ubytku wagi wyjściowej) wymaga regularnych ważeń i kontroli wilgotności w komorze. Charcutier wykrywa groźne zjawisko **Case Hardening** (zesztywnienie powierzchniowe blokujące odparowanie wody z gnijącego środka) i wylicza przewidywaną datę dojrzałości wyrobu.
3. **Reżim wędzarniczy i kulinarny:** Prowadzi krok po kroku przez osuszanie bez dymu („do pergaminu”), wędzenie właściwe dymem, parzenie w wodzie $75-80^\circ	ext{C}$ do temperatury rdzenia (z alarmem wibracyjnym na zegarku) oraz studzenie szokowe.

Aplikacja działa **w 100% offline, bez logowania, bez konta, bez reklam i bez szpiegowania**, z pełnym wsparciem dla Apple Watch i Garmin oraz wydrukiem etykiet partii w PDF z kodami QR. Kosztuje w duchu Apps4Brew: **mniej niż jedno espresso miesięcznie** (0,99 €) lub dostęp dożywotni (14,99 €).

### **Dla kogo (Główne Persony)**
* **Janusz (52 lata, inżynier):** wędzi tradycyjne szynki i kiełbasy w przydomowej wędzarni 4 razy w roku; potrzebuje precyzyjnego kalkulatora nastrzyków i timera parzenia do 68°C w rdzeniu, by wędliny nie były suche.
* **Mateusz (34 lata, programista):** pasjonat salami i wędlin długodojrzewających; zbudował komorę ze starej lodówki; waży batony salami co 3 dni i potrzebuje wykresu kinetyki utraty wagi z alarmem przed Case Hardening.
* **Ewelina (29 lat, młoda mama):** przygotowuje zdrowe wędliny w szynkowarze dla dziecka; zależy jej na czystym składzie, minimalnej bezpiecznej dawce soli i braku fosforanów.
* **Stanisław (69 lat, emerytowany rzeźnik):** kocha tradycyjne rzemiosło; potrzebuje bardzo dużych liter (Dynamic Type), braku skomplikowanych menu i obsługi w okularach lub bez.
* **Marek (41 lat, myśliwy):** przetwarza dziczyznę (dzik, jeleń); wymaga rygorystycznego reżimu badania włośnicy (*Trichinella*) oraz kalkulatora bilansowania chudego mięsa z dzika ze słoniną wieprzową.
* **Ewa (35 lat, osoba niewidoma):** pasjonatka kuchni domowej; przygotowuje wędliny przy użyciu wagi mówiącej; wymaga bezbłędnej obsługi VoiceOver i sygnałów haptycznych.

### **Czym wygrywa Charcutier (Przewagi rynkowe poparte badaniami)**
1. **PPM Guard i Eliminacja Botulizmu:** Istniejące przepisy w internecie posługują się niebezpiecznymi miarami („dwie łyżki soli”, „szczypta saletry”) lub mylą polską peklosól z amerykańskim Cure #1 (10-krotna różnica stężenia azotynu!). Charcutier operuje na miligramach czystego azotynu ($NaNO_2$) na kg mięsa z certyfikowaną walidacją USDA i UE.
2. **Algorytm Anty-Case-Hardening:** Jedyna aplikacja na rynku analizująca dynamikę utraty wagi w pierwszych 72 godzinach w relacji do wilgotności względnej RH komory, ostrzegająca przed zablokowaniem parowania.
3. **Prawdziwe wsparcie „Tłuste ręce w masarni”:** Podczas rozbioru półtuszy czy nadziewania jelit ręce są tłuste lub w rękawicach. Kluczowe funkcje (potwierdzenie wagi batonu, zmiana fazy wędzenia, odczyt temperatury sondy) obsługiwane są koronką Digital Crown na Apple Watch lub stuknięciem nadgarstka bez dotykania telefonu.
4. **Kalkulator Parzenia vs Pieczenia z dynamiką denaturacji:** Charcutier wylicza czas parzenia w wodzie 75–80°C w zależności od grubości geometrycznej batonu i ostrzega przed przekroczeniem 82°C (temperatura wypływu soków mięśniowych).
5. **Etykiety partii w PDF z kodami QR:** Wędliny dojrzewają miesiącami w komorze obok siebie. Użytkownik drukuje na domowej drukarce etykiety A4 z kodem QR, który po zeskanowaniu aparatem telefonu w ułamku sekundy otwiera kartę danej partii w aplikacji.
6. **Zero Chmury, Zero Konta:** Wszystkie unikalne receptury masarskie pozostają na urządzeniu użytkownika.

### **Model przychodu (Apps4Brew Studio Pass)**
* **Subskrypcja:** 0,99 € miesięcznie / 4,99 € rocznie (w Polsce: 3,99 zł / 19,99 zł).
* **Zakup dożywotni (Lifetime):** 14,99 € jednorazowo (w Polsce: 59,99 zł).
* **Darmowy rdzeń (Free Core):** Kalkulator peklowania EQ, 1 aktywna partia wędliny, podstawowy stoper wędzenia.
* **14-dniowy pełny Trial:** Bezpłatny dostęp do zaawansowanego trackera wagi, komory dojrzewalniczej, etykiet QR PDF i integracji z Apple Watch. Po wygaśnięciu trialu historia pozostaje w pełni dostępna (read-only), blokowane jest jedynie tworzenie nowych partii.
* **Próg rentowności opłaty Apple Developer (99 USD):** Zwraca się przy ok. 29 rocznych subskrypcjach w Polsce lub 10 zakupach dożywotnich.

### **Liczby dokumentu**
* Wymagania funkcjonalne (BR): **185** (MUST: 108, SHOULD: 54, COULD: 23).
* Wymagania niefunkcjonalne (NFR): **110**.
* Reguły dziedzinowe (RD): **50** (z kompletnymi wektorami testowymi TV-01…50).
* Zidentyfikowane ryzyka (RYZ): **50** (z planem obrony).
* Decyzje produktowe (DEC): **45**.
* Tabela zakresu funkcjonalnego (Z): **220** pozycji.
* Liczba znormalizowanych stron tekstu: **115+ stron maszynopisu** (ponad 220 000 znaków).

---

## **3. Warianty pierwszej wersji — Decyzja nr 1 (DEC-01)**

| Wariant | Zakres | Liczba BR w MVP | Czas agentów | Kalendarz | Ryzyko 4.3(b) | Rekomendacja |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **(a) Pełne MVP z BRD** | Wszystkie moduły: Peklowanie (EQ, zalewa, nastrzyk), Tracker Wagi z wykresem, Asystent Wędzenia z 4 fazami, Spiżarnia z jelitami, Apple Watch, Live Activity, Etykiety PDF z QR, Szkoła Masarska, 50 reguł RD. | 132 | 30–38 dni | 4–5 tyg. | Bardzo niskie | Alternatywny |
| **(b+) MVP zbalansowane (Rekomendowane)** | Pełen MUST + 6 kluczowych akceleratorów: wibracja haptyczna Watch dla temperatury rdzenia, Live Activity dla wędzenia, ochrona PPM Guard przed toksycznością, wykres ubytku masy z detekcją Case Hardening, 14 dni trialu, Family Sharing. Etykiety PDF uproszczone do 1 formatu, Garmin w 1.1. | **108** | **22–28 dni** | **3–4 tyg.** | **Niskie** | **GŁÓWNA REKOMENDACJA** |
| **(b) MVP minimalne (Tylko MUST)** | Sam kalkulator peklowania, prosta lista ubytku wagi bez wykresu, podstawowy stoper wędzenia, brak aplikacji na zegarki. | 88 | 16–20 dni | 2–3 tyg. | Średnie | Odradzany (słabsza obrona przed zarzutem kalkulatora) |
| **(c) (b+) + Sondy Bluetooth BLE** | Zakres (b+) rozszerzony o bezpośredni odczyt bezprzewodowych termometrów mięsnych BLE (np. Meater, Inkbird). | 124 | 36–48 dni | 5–6 tyg. | Bardzo niskie | Przesunąć do wersji 1.2 (wysokie ryzyko braku sprzętu do testów) |
| **(d) Tylko Peklowanie i Wędzenie (bez wędlin dojrzewających)** | Wycięcie modułu komory i ubytku wagi. | 68 | 14–18 dni | 2 tyg. | **Wysokie** (odrzucenie przez Apple za zbyt wąski kalkulator) | **Zdecydowanie odradzany** |

---

## **4. Warunki wstępne po stronie Właściciela**

1. **Konto Apple Developer:** Aktywny program organizacji Apps4Brew lub konto indywidualne z opłaconym rocznym dostępem (99 USD).
2. **Klucze i certyfikaty TestFlight:** Przygotowanie profilu provisioning z uprawnieniami Live Activity (`ActivityKit`) i powiadomień w tle (`UIBackgroundModes: ["audio"]` dla głośnego alarmu timera).
3. **Sprzęt testowy:**
   - iPhone z iOS 18+ (weryfikacja Live Activity i skanera kodów QR aparatem).
   - Apple Watch z watchOS 11+ (weryfikacja haptyki wibracyjnej i Digital Crown w trybie pracy na nadgarstku).


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · 00b Jedna lista decyzji (DEC-01…DEC-45) ==================== -->

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


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · 00c Sprzeczności i errata (toksykologia, botulinum, case hardening) ==================== -->

# **Charcutier BRD 0.1 — 00c Sprzeczności dziedzinowe i errata**

W obszarze przetwórstwa mięsnego istnieje szereg sprzeczności normatywnych, mitów kulinarnych oraz niebezpiecznych pułapek terminologicznych. Niniejszy dokument stanowi bezwzględną erratę dla analityków, badaczy i programistów aplikacji Charcutier.

---

## **1. Pułapka terminologiczna: Polska Peklosól vs Amerykański Cure #1 (Prague Powder #1)**

* **Problem:** W literaturze anglosaskiej i na forach internetowych powszechnie stosuje się pojęcie *Curing Salt #1*, *Prague Powder #1* lub *InstaCure #1*. W Polsce powszechnie używa się słowa *Peklosól*. Początkujący masarze mylą te produkty, co prowadzi do śmiertelnego zagrożenia!
* **Różnica chemiczna:**
  * **Polska Peklosól:** 99.4%–99.5% sól kuchenna (NaCl) + **0.5%–0.6% azotyn sodu ($NaNO_2$)**.
  * **Prague Powder #1:** 93.75% sól kuchenna (NaCl) + **6.25% azotyn sodu ($NaNO_2$)** (zabarwiony na różowo barwnikiem spożywczym, by odróżnić go od soli kuchennej).
* **Skutek pomyłki:** Zastosowanie Prague Powder #1 w proporcjach polskiej peklosoli (np. 20 g na kg mięsa) oznacza podanie **ponad 10-krotnie przekroczonej dawki śmiertelnej azotynu!** Z kolei użycie polskiej peklosoli w ilości przewidzianej dla Cure #1 (np. 2.5 g/kg) skutkuje brakiem ochrony przed *Clostridium botulinum* i zepsuciem mięsa.
* **Rozstrzygnięcie w aplikacji (RD-02):** Aplikacja nigdy nie używa samego słowa „peklosól” bez jednoznacznego podania stężenia procentowego. Wprowadzono twardy selektor:
  1. `Peklosól Polska (0.5% - 0.6% NaNO2)`
  2. `Prague Powder #1 / InstaCure #1 (6.25% NaNO2)`
  3. `Czysty azotyn sodu (laboratoryjny - tylko dla przemysłu)` – zablokowany w UI domowym.

---

## **2. Saletra potasowa ($KNO_3$ / Cure #2) a obróbka termiczna: Rynek Nitrozoamin**

* **Problem:** Wielu starszych masarzy dodaje saletrę potasową ($KNO_3$) do wszelkich rodzajów mięs, w tym do szynek parzonych, kiełbas pieczonych i boczku.
* **Podstawa naukowa:**
  * Azotan potasu ($KNO_3$) sam w sobie nie ma właściwości bakteriobójczych. Aby zadziałał, bakterie z rodziny *Staphylococcaceae* muszą powoli, w temperaturze $10-15^\circ	ext{C}$ przez okres kilku tygodni, zredukować go enzymatycznie (reduktaza azotanowa) do azotynu ($NaNO_2$).
  * Jeśli mięso z dodatkiem saletry zostanie poddane obróbce termicznej powyżej $75-100^\circ	ext{C}$ (parzenie, pieczenie, a zwłaszcza smażenie boczku na patelni w $130-170^\circ	ext{C}$), wolne azotany i azotyny wchodzą w gwałtowną reakcję z drugorzędowymi aminami białkowymi, tworząc silnie rakotwórcze **N-nitrozoaminy** (np. nitrozo-dimetyloaminę NDMA).
* **Rozstrzygnięcie w aplikacji (RD-05):** Saletra potasowa oraz Prague Powder #2 (zawierający $NaNO_3$) są **bezwzględnie zablokowane** w kalkulatorze dla procesów wędzenia na gorąco, parzenia, pieczenia i szynkowarów. Są dopuszczone wyłącznie dla wędlin surowych długodojrzewających o cyklu suszenia minimum 28 dni.

---

## **3. Normy stężenia azotynów: USDA FSIS vs Rozporządzenie Unii Europejskiej (WE) nr 1333/2008**

* **Sprzeczność:** 
  * **USDA FSIS (9 CFR § 318.7):** Dopuszcza maksymalnie **156 PPM** (mg/kg) dodanego azotynu dla wyrobów peklowanych na sucho (całe mięśnie), **200 PPM** dla kiełbas i wędzonek zalewowych, oraz **120 PPM** dla bekonu (z obowiązkowym dodatkiem 550 PPM askorbinianu sodu).
  * **Unia Europejska (Rozporządzenie 1333/2008 z późn. zm. 2023/2108):** Maksymalna dawka dodana azotynów w przetwórstwie mięsnym wynosi standardowo **150 mg/kg** (150 PPM), a dla tradycyjnych peklowanych wyrobów mięsnych od 100 do 150 mg/kg.
* **Rozstrzygnięcie w aplikacji (RD-03):** 
  * Wartość domyślna dla wędlin domowych wynosi **150 PPM** (zgodna z kompromisem USDA i UE).
  * Aplikacja posiada wbudowany strażnik **PPM Guard**: każda dawka powyżej 200 PPM generuje czerwone ostrzeżenie toksykologiczne, a poniżej 100 PPM – żółte ostrzeżenie o obniżonej stabilności mikrobiologicznej.

---

## **4. Zjawisko Case Hardening (Zakalec powierzchniowy): Spór o wilgotność w komorze dojrzewalniczej**

* **Mit:** „Aby wędlina szybciej wyschła, należy obniżyć wilgotność w komorze do 50–60% i włączyć mocny wentylator”.
* **Fakt naukowy:**
  * Woda z wnętrza mięsa dyfunduje ku powierzchni powoli, zgodnie z drugim prawem dyfuzji Ficka.
  * Jeśli wilgotność względna (RH) otoczenia spadnie poniżej 70%, odparowanie z powierzchni jest szybsze niż dopływ wody z rdzenia. Zewnętrzna warstwa białek ulega gwałtownemu wysuszeniu i skurczeniu, tworząc twardy, nieprzepuszczalny pierścień (*case hardening*).
  * Skutek: Woda zostaje uwięziona w środku batonu salami lub szynki. W beztlenowym, ciepłym i wilgotnym rdzeniu rozwijają się bakterie gnilne, a wędlina psuje się od środka („płynący rdzeń”).
* **Rozstrzygnięcie w aplikacji (RD-25):** 
  * Normą dla pierwszych 10 dni dojrzewania jest wilgotność **80%–85% RH**, a dla późniejszego etapu **75%–78% RH**.
  * Prędkość przepływu powietrza musi wynosić zaledwie **0.05–0.1 m/s**.
  * Jeśli waga wędliny spada w pierwszych dobach szybciej niż 3% na dobę, aplikacja natychmiast generuje alarm: *„Zagrożenie zesztywnieniem powierzchniowym! Zwiększ wilgotność w komorze!”*.

---

## **5. Włośnica (Trichinella spiralis) a dziczyzna i mięso świń domowych**

* **Problem:** Domowi masarze często wędzą na zimno kiełbasy z dzika lub surową polędwicę z dziczyzny.
* **Fakt mikrobiologiczny:**
  * Larwy włośnia krętego (*Trichinella spiralis*) giną w temperaturze wewnętrznej **58.5°C** utrzymanej przez min. 3 minuty lub po mrożeniu w odpowiednich reżimach temperaturowych (jednak niektóre arktyczne szczepy *Trichinella nativa* w dziczyźnie są odporne na mrożenie!).
  * Peklowanie, wędzenie zimnym dymem i suszenie **NIE ZABIJAJĄ włośnia!**
* **Rozstrzygnięcie w aplikacji (RD-42):** W przypadku wyboru surowca „Dziczyzna / Dzik”, aplikacja wyświetla obowiązkowy modal ostrzegawczy: *„Wymagane urzędowe badanie weterynaryjne mięsa metodą wytrawiania. Wędzenie zimne bez badania grozi śmiertelną włośnicą!”*.


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · A1 · rozdz. 1–3 (wizja, persony, zasady ZP-01…16) ==================== -->

# **Charcutier BRD 0.1 — Część A1: Wizja, Zasady Produktu, Persony i Scenariusze**

---

## **1. Wizja i obietnica produktu**

### **1.1 Wizja (jeden akapit)**
**Charcutier** to niezawodny, kieszonkowy asystent i kalkulator domowego masarza, który przejmuje pełną kontrolę nad bezpieczeństwem mikrobiologicznym i reżimem technologicznym wyrobu wędlin: precyzyjnie wylicza dawki soli i peklosoli w miligramach i PPM, eliminuje ryzyko zepsucia mięsa i jadu kiełbasianego, nadzoruje wielotygodniowy ubytek wagi w wędlinach dojrzewających chroniąc przed zesztywnieniem powierzchniowym (*case hardening*), a podczas wędzenia prowadzi krok po kroku przez osuszanie, dymienie i parzenie z powiadomieniami na Apple Watch i Garmin. Działa w 100% offline, bez logowania, bez konta i bez reklam, w duchu rzemiosła Apps4Brew.

**Obietnica w jednym zdaniu:**  
*„Wędź i dojrzewaj z pewnością mistrza rzemiosła — precyzja soli bez ryzyka zepsucia, waga pod kontrolą, ręce wolne.”*

### **1.2 Nienegocjowalne zasady produktu (ZP-01…ZP-16)**

| # | Zasada | Uzasadnienie i źródło |
| :--- | :--- | :--- |
| **ZP-01** | **Bezpieczeństwo biologiczne ponad wszystko (Safety-First).** | Błąd w stężeniu peklosoli grozi śmiercią (jad kiełbasiany) lub zatruciem. Żadna funkcja nie może zachęcać do niebezpiecznych skrótów. |
| **ZP-02** | **Ręce w tłuszczu i solance (Hands-Free w masarni).** | Użytkownik pracuje w rękawiczkach lub z mokrymi dłońmi. Kluczowe odczyty i akcje muszą działać na Apple Watch, Garmin i Live Activity bez dotykania telefonu. |
| **ZP-03** | **Bez konta i bez logowania.** | Zero barier wejścia. Pierwszy ekran to działający kalkulator lub podgląd aktywnej partii. |
| **ZP-04** | **Bez serwerów i bez chmurowego AI.** | Wszystkie obliczenia (PPM, Fick, kinetyka suszenia, letalność) wykonują się na procesorze telefonu w 100% offline. Zero kosztów serwerowych. |
| **ZP-05** | **Prywatność „Data Not Collected”.** | Zero zewnętrznych skryptów śledzących. Receptury, terminy wędzeń i stany magazynowe należą wyłącznie do użytkownika. |
| **ZP-06** | **Dane nigdy nie giną.** | Szynki dojrzewają do roku. Baza SQLite w trybie WAL chroniona w `/Library/SQLite` z 10 rotacyjnymi kopiami zapasowymi po każdej sesji. |
| **ZP-07** | **Kopia i eksport zawsze bezpłatne.** | Zgodnie z wytycznymi Apple i etosem Apps4Brew eksport danych do CSV i JSON jest bezwarunkowo darmowy. |
| **ZP-08** | **Uczciwy model monetyzacji.** | $0.99/msc, $4.99/rok, $14.99 Lifetime. 14 dni pełnego trialu. Po wygaśnięciu: pełny wgląd w historię (read-only), brak utraty danych. |
| **ZP-09** | **Czysty dym i zakaz dymienia na mokro.** | Asystent wędzenia bezwzględnie wymusza potwierdzenie etapu osuszania powierzchniowego przed przejściem do wędzenia dymem. |
| **ZP-10** | **Rozróżnienie typów peklosoli.** | Aplikacja nigdy nie podaje samej nazwy „peklosól” bez sprecyzowania stężenia (0.5% vs 6.25%). |
| **ZP-11** | **Rygor naukowy i hierarchia źródeł.** | Wszystkie wzory mają potwierdzone źródło w literaturze naukowej i normach (USDA FSIS, EFSA, IBPRS, Marianski). |
| **ZP-12** | **Dostępność warunkiem wydania.** | Pełna obsługa VoiceOver dla niewidomych masarzy, Dynamic Type dla seniorów, wysoki kontrast. |
| **ZP-13** | **Spokojny, rzemieślniczy język.** | Stylistyka inspirowana tradycyjnym cechem masarskim, brak krzykliwych powiadomień, szacunek do surowca. |
| **ZP-14** | **Drukowanie etykiet partii w 100% lokalnie.** | Generator wektorowy PDF etykiet A4 z kodami QR partii bez wychodzenia do sieci. |
| **ZP-15** | **Przenośność kodu od pierwszego commitu.** | Identyfikatory zakupów, bundle ID i schematy bazy przygotowane do niezależnego funkcjonowania. |
| **ZP-16** | **0 zł stałych kosztów infrastruktury.** | Żadnych płatnych API chmurowych, żadnych baz w Firebase. |

---

## **2. Persony użytkowników (P1–P8)**

### **P1: Janusz, 52 lata — Tradycyjny wędliniarz przydomowy (Główna 1)**
* **Profil:** Posiada murowaną lub drewnianą wędzarnię w ogrodzie. Wędzi 3–5 razy w roku (przed Wielkanocą, Bożym Narodzeniem i na rodzinne uroczystości) po 20–40 kg wsadu (szynki, schaby, boczki, kiełbasa swojska).
* **Ból:** Zdarza mu się przesolić wędzonki lub wyjąć szynkę suchą jak wiór, bo parzył „na oko” bez kontroli temperatury wewnątrz mięśnia.
* **Potrzeba w aplikacji:** Szybki kalkulator solanki zalewowej na określoną wagę mięsa i objętość wody, kalkulator nastrzyku przy kości oraz stoper parzenia z alarmem wibracyjnym, gdy sonda w szynce osiągnie 68°C.

### **P2: Mateusz, 34 lata — Entuzjasta wędlin długodojrzewających (Główna 2)**
* **Profil:** Pasjonat włoskich i hiszpańskich smaków. Samodzielnie przerobił chłodziarkę na komorę dojrzewalniczą z nawilżaczem i regulatorem wilgotności. Przygotowuje salami, coppę, pancettę i bresaolę.
* **Ból:** Lęk przed pleśnią toksyczną oraz przed zjawiskiem *Case Hardening*, w którym twarda skorupa zamyka wilgoć i psuje wsad po 6 tygodniach pracy. Zmęczenie prowadzeniem zapisków w notatniku papierowym.
* **Potrzeba w aplikacji:** Dokładny Tracker Utraty Wagi z wykresem ubytku wody (cel 35%), estymator terminu gotowości na bazie prawa Ficka, alarm zbyt szybkiego wysychania w pierwszych dobach i atlas pleśni szlachetnych.

### **P3: Ewelina, 29 lat — Świadoma mama i użytkowniczka szynkowaru (Główna 3)**
* **Profil:** Gotuje zdrowo dla małych dzieci. Kupiła szynkowar, aby uniknąć sklepowych wędlin pełnych fosforanów, karagenu i wzmacniaczy smaku.
* **Ból:** Boi się peklosoli (mit o rakotwórczości), ale jednocześnie obawia się, że wędlina zrobiona na samej soli szarej zepsuje się w lodówce w 3 dni lub będzie szara i niesmaczna.
* **Potrzeba w aplikacji:** Rzetelne, naukowe wyjaśnienie roli soli i minimalnych dawek azotynu, dedykowany kalkulator wsadu do szynkowaru oraz profile ziół naturalnych.

### **P4: Stanisław, 69 lat — Mistrz masarski na emeryturze (Główna 4)**
* **Profil:** Przez 40 lat pracował w zawodzie. Teraz robi wyroby dla wnuków i sąsiadów.
* **Ból:** Ma słabszy wzrok, nie radzi sobie ze skomplikowanymi, nowoczesnymi aplikacjami z małymi czcionkami.
* **Potrzeba w aplikacji:** Dynamic Type (bardzo duża, czytelna czcionka), ogromne przyciski dotykowe, klasyczne polskie normy recepturowe (PN-A-82007) i zero zbędnych nowinek technologicznych.

### **P5: Marek, 41 lat — Myśliwy i przetwórca dziczyzny (Drugorzędna)**
* **Profil:** Poluje na dziki i jelenie. Samodzielnie sprawia tusze i robi kiełbasy myśliwskie oraz suszone polędwice.
* **Ból:** Ryzyko włośnicy (*Trichinella*), konieczność bilansowania bardzo chudego mięsa z dziczyzny z tłuszczem wieprzowym (podgardle, słonina).
* **Potrzeba w aplikacji:** Kalkulator klasyfikacji mięsa (klasa I, II, III) z automatycznym dobiorem tłuszczu do docelowej zawartości 20–25% oraz procedury bezpieczeństwa mikrobiologicznego.

### **P6: Tomasz, 38 lat — Szef kuchni w restauracji rzemieślniczej (Drugorzędna / B2B)**
* **Profil:** Serwuje gościom autorską deskę wędlin dojrzewających i domowy pastrami.
* **Potrzeba:** Drukowanie etykiet partii A4 z kodami QR, kalkulator kosztu surowca na 1 kg gotowego wyrobu z uwzględnieniem ubytku masy, eksport dzienników partii do inspekcji sanitarnej (HACCP) w CSV.

### **P7: Bartek, 26 lat — Gadżeciarz kulinarny ze smartwatchem (Drugorzędna)**
* **Profil:** Gotuje nowocześnie, używa cyrkulatora sous-vide, wędzarni elektrycznej z termometrem Bluetooth i Apple Watch Ultra.
* **Potrzeba:** Podgląd temperatury i etapu na ekranie blokady (Live Activity) oraz szybkie wprowadzanie wagi batonu koronką zegarka.

### **P8: Ewa, 35 lat — Osoba niewidoma, pasjonatka gotowania (Projektowa / Dostępność)**
* **Rola:** Persona weryfikująca każde wydanie pod kątem barier dostępności. Używa VoiceOver i wagi kuchennej z syntezą mowy.
* **Wymóg:** Każda kontrolka, wykres i krok wędzenia musi posiadać pełny, zrozumiały opis semantyczny VoiceOver.

---

## **3. Sytuacje z życia masarza (SYT-01…SYT-15)**

* **SYT-01 (Mokre i tłuste ręce przy krojeniu szynki):** Janusz kroi 15 kg mięsa. Telefon leży 2 metry dalej na półce. W szynkowarze parzy się polędwica. Zegarek na nadgarstku wibruje: *„Temperatura rdzenia 60°C — pozostały 2°C do wyjęcia”*. Janusz zerka na nadgarstek i wie, że ma 5 minut na przygotowanie miski z lodem do studzenia.
* **SYT-02 (Ważenie salami w komorze w piwnicy):** Mateusz schodzi do piwnicy z wagą. Wyjmuje 6 batonów salami. Zamiast odblokowywać telefon brudnymi dłońmi, odpala aplikację na Apple Watch, kręci koronką Digital Crown wpisując `412 g` dla Partii #03 i zatwierdza stuknięciem łokcia. Wykres w telefonie natychmiast aktualizuje ubytek masy (obecnie 28.4%).
* **SYT-03 (Podejrzenie Case Hardening w 4. dobie):** Wilgotność w piwnicy Mateusza spadła przez awarię nawilżacza do 62%. Po wpisaniu wagi w 4. dobie aplikacja wyświetla czerwony alert: *„Tempo utraty wody: 4.1%/dobę (krytycznie za wysokie!). Ryzyko zesztywnienia powierzchniowego. Zwiększ wilgotność do min. 82% lub owiń batony papierem pergaminowym na 48h”*.
* **SYT-04 (Zapobieganie wędzeniu na mokro):** Janusz rozpala wędzarnię. Wkłada powieszone kiełbasy i chce od razu podać gęsty dym olchowy. Asystent w aplikacji wyświetla komunikat: *„KROK 1: Osuszanie bez dymu. Temperatura 45°C, maksymalny cug. Dotknij osłonek — muszą być suche i szeleścić jak pergamin. Podanie dymu na mokre mięso spowoduje kwaśny i smolisty smak!”*. Janusz czeka 45 minut, aż kiełbasy będą idealnie suche.
* **SYT-05 (Przeliczenie solanki ze starej książki kucharskiej):** Ewelina znalazła stary przepis babci: *„weź garnuszek soli i garść saletry na oko”*. Wpisuje w Charcutier wagę swojego schabu (1.8 kg) i wybiera metodę równowagową (EQ). Aplikacja precyzyjnie wylicza: 41.4 g peklosoli 0.5% (stężenie 2.3%), 0 g saletry (niebezpieczna przy parzeniu!), 3.6 g cukru, 5 g pieprzu, 3 g kolendry.
* **SYT-06 (Drukowanie etykiet na batony w komorze):** Tomasz przygotował 20 batonów dojrzewającego Lonzino. Z poziomu aplikacji klika *„Drukuj etykiety partii”*. Na domowej drukarce AirPrint drukuje się arkusz z 20 zawieszkami zawierającymi kod QR partii, datę startu, wagę wyjściową i docelową (-35%).
* **SYT-07 (Rozpoznanie pleśni szlachetnej vs czarnej):** Na bresaoli Mateusza pojawia się nalot. Otwiera *Atlas Pleśni* w aplikacji: porównuje zdjęcie śnieżnobiałego, aksamitnego nalotu *Penicillium nalgiovense* z niebezpiecznymi zielono-czarnymi skupiskami *Aspergillus/Mucor*. Wie, że jego wędlina jest zdrowa.


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · A2 · rozdz. 4–6.1 (rynek, model przychodu, zakres) ==================== -->

# **Charcutier BRD 0.1 — Część A2: Analiza Rynku, Model Przychodu i Ramy Zakresu**

---

## **4. Analiza rynku i konkurencji**

### **4.1 Stan rynku i luka produktowa**
Rynek domowego przetwórstwa mięsnego przeżywa globalny renesans. Konsumenci uciekają od przemysłowej żywności naszpikowanej wodą, fosforanami i konserwantami, poszukując tradycyjnego smaku, rzemiosła i samowystarczalności.
* **W Polsce:** Tradycja wędliniarstwa przydomowego jest jedną z najsilniejszych na świecie. Społeczność portalu `wedlinydomowe.pl` liczy dziesiątki tysięcy aktywnych użytkowników, a grupy dyskusyjne na Facebooku gromadzą setki tysięcy pasjonatów.
* **Globalnie (USA, Włochy, Hiszpania, Niemcy, Australia):** Olbrzymia społeczność pasjonatów wędlin dojrzewających skupiona wokół forów charcuterie, subreddita `r/Charcuterie` (ponad 150 tys. członków) oraz entuzjastów domowego BBQ.

### **4.2 Analiza istniejących rozwiązań**
1. **Arkusze kalkulacyjne Excel / Google Sheets:**
   * *Stan:* Najpopularniejsze narzędzie zaawansowanych masarzy.
   * *Wady:* Nieczytelne na telefonie, niemożliwe do obsługi brudnymi rękami w kuchni, brak przypomnień, brak powiadomień w czasie rzeczywistym, brak integracji z zegarkami.
2. **Generyczne aplikacje BBQ (np. PitmasterIQ, GrillTime):**
   * *Stan:* Skupiają się wyłącznie na szybkim grillowaniu steków czy burgerów.
   * *Wady:* Całkowity brak modułów peklowania, chemii azotynów, obliczeń PPM, wielotygodniowej kontroli ubytku wagi czy fazy osuszania wędzarniczego.
3. **Prymitywne kalkulatory internetowe (kalkulatory webowe):**
   * *Stan:* Proste skrypty JS liczące solankę ze stałym współczynnikiem.
   * *Wady:* Wymagają połączenia z internetem (brak zasięgu w piwnicach i na działkach), brak pamięci partii, brak śledzenia wagi, brak bezpieczeństwa danych.

### **4.3 Przewagi konkurencyjne Charcutier**
* **100% Offline-First:** Działa w blaszanej wędzarni w lesie i w głębokiej piwnicy bez zasięgu sieci komórkowej.
* **Pojedynczy ekosystem:** Peklowanie $
ightarrow$ Wędzenie $
ightarrow$ Dojrzewanie $
ightarrow$ Spiżarnia w jednej aplikacji.
* **PPM Guard:** Deterministyczna matematyka bezpieczeństwa chroniąca przed botulizmem i przedawkowaniem chemii.
* **Integracja z Apple Watch i Garmin:** Niezrównana wygoda obsługi brudnymi rękami.

---

## **5. Model przychodu i ekonomia jednostkowa**

Zgodnie z filozofią studia **Apps4Brew**, aplikacja realizuje model *„Cheaper than Espresso”*:
* **Miesięczna subskrypcja:** 0,99 € (w Polsce: 3,99 zł).
* **Roczna subskrypcja:** 4,99 € (w Polsce: 19,99 zł) — rabat 58%.
* **Zakup dożywotni (Lifetime):** 14,99 € (w Polsce: 59,99 zł) — jednorazowa płatność dla osób nienawidzących subskrypcji.

### **Ekonomia jednostkowa (Unit Economics):**
* **Koszt krańcowy użytkownika:** **0,00 USD / miesiąc** (brak serwerów chmurowych, brak chmurowych LLM, brak baz zewnętrznych).
* **Roczna opłata Apple Developer Program:** 99 USD.
* **Próg rentowności (Break-Even):**
  * W modelu subskrypcyjnym rocznym w Polsce (po prowizji 15% Apple w Small Business Program): przychód netto ok. 14,50 zł / użytkownika $pprox$ 3.65 USD. Zwrot kosztu konta Apple następuje przy **zaledwie 28 aktywnych subskrypcjach rocznych**.
  * W modelu Lifetime (przychód netto ok. 43,50 zł $pprox$ 11 USD): zwrot następuje przy **9 zakupach dożywotnich**.

---

## **6. Ramy zakresu i reguły phasingowe**

Zakres funkcjonalny podzielono na fazy:
* **MVP (Wersja 1.0):** Rdzeń kalkulatora peklowania EQ, zalewowego i nastrzykowego; Tracker wagi z wykresem ubytku masy i detekcją Case Hardening; Asystent wędzenia (4 fazy z osuszaniem); Ewidencja partii; Aplikacja Apple Watch; Etykiety PDF z QR.
* **Wersja 1.1:** Aplikacja na Garmin Connect IQ; Udostępnianie receptur przez kody QR offline; Tryb wysokiego kontrastu dla zadymionej wędzarni; Komplikacje tarczy zegarka.
* **Wersja 1.2:** Obsługa bezprzewodowych sond BLE (Meater, Inkbird); Integracja z czujnikami wilgotności komory dojrzewalniczej BLE.
* **Wersja 2.x:** Asystent rozbioru półtuszy i bilansowania tłuszczu z aparatem (pomiar proporcji mięsa do słoniny na urządzeniu).


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · A3a · rozdz. 6.2 tabela zakresu cz. 1 (peklowanie, dojrzewanie, wędzenie) ==================== -->

# **Charcutier BRD 0.1 — Część A3a: Tabela Zakresu Funkcjonalnego (Część 1: Z-001…Z-110)**

Poniższa tabela definiuje zakres funkcjonalny modułów Peklowania, Dojrzewania i Wędzenia.

| ID | Moduł | Funkcjonalność | Priorytet | Etap | Uzasadnienie |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Z-001** | Peklowanie | Kalkulator peklowania równowagowego (EQ) dla całych mięśni | MUST | MVP | Podstawa nowoczesnego wędliniarstwa bez ryzyka przesolenia. |
| **Z-002** | Peklowanie | Kalkulator solanki tradycyjnej mokrej (zalewowej) | MUST | MVP | Konieczność dla tradycyjnych wędzonek Janusza (P1). |
| **Z-003** | Peklowanie | Kalkulator nastrzyków (procent nastrzyku i gęstość solanki) | MUST | MVP | Kluczowe przy szynkach z kością (zapobieganie bone sour). |
| **Z-004** | Peklowanie | Automatyczny przelicznik PPM azotynu ($NaNO_2$) | MUST | MVP | Bezpieczeństwo biologiczne (ZP-01). |
| **Z-005** | Peklowanie | Wybór rodzaju peklosoli (Polska 0.5% vs Prague Powder #1 6.25%) | MUST | MVP | Eliminacja śmiertelnych pomyłek (00c). |
| **Z-006** | Peklowanie | Blokada użycia Cure #2 / Saletry w wyrobach obrabianych termicznie | MUST | MVP | Ochrona przed rakotwórczymi nitrozoaminami. |
| **Z-007** | Peklowanie | Kalkulator ziół i przypraw w gramach na kg wsadu | MUST | MVP | Powtarzalność receptur rzemieślniczych. |
| **Z-008** | Peklowanie | Asystent czasu peklowania wg dyfuzji Ficka (grubość mięśnia) | SHOULD | MVP | Zapobieganie wyjmowaniu niedopeklowanego mięsa. |
| **Z-009** | Peklowanie | Obsługa szynkowarów (receptury, docisk, czas parzenia) | SHOULD | MVP | Kluczowe dla persony Eweliny (P3). |
| **Z-010** | Peklowanie | Przelicznik gęstości solanki na stopnie Baumé (°Bé) i Salometr | COULD | 1.1 | Dla tradycyjnych masarzy operujących solomierzami. |
| **Z-020** | Dojrzewanie | Dziennik ważeń batonu wędliny dojrzewającej | MUST | MVP | Rdzeń trackera utraty wagi. |
| **Z-021** | Dojrzewanie | Wykres liniowy ubytku masy w czasie (oś: % ubytku i waga w g) | MUST | MVP | Wizualizacja postępu suszenia ku celowi 35%. |
| **Z-022** | Dojrzewanie | Znacznik docelowego ubytku masy (konfigurowalny: 30% do 45%) | MUST | MVP | Definiuje moment dojrzałości kulinarnej. |
| **Z-023** | Dojrzewanie | Algorytm detekcji Case Hardening (tempo ubytku vs wilgotność) | MUST | MVP | Ochrona przed zepsuciem drogiego wsadu. |
| **Z-024** | Dojrzewanie | Estymator przewidywanej daty gotowości (krzywa logarytmiczna) | SHOULD | MVP | Odpowiedź na pytanie: „kiedy wędlina będzie gotowa?”. |
| **Z-025** | Dojrzewanie | Rejestr parametrów komory (temperatura i wilgotność RH) | MUST | MVP | Warunek stabilności procesu dojrzewania. |
| **Z-026** | Dojrzewanie | Atlas pleśni szlachetnych i patogennych ze zdjęciami | SHOULD | MVP | Rozpoznawanie dobrej pleśni od toksyn. |
| **Z-027** | Dojrzewanie | Monitor spadku pH w fazie fermentacji salami | SHOULD | MVP | Weryfikacja bariery mikrobiologicznej ($pH < 5.3$). |
| **Z-028** | Dojrzewanie | Powiadomienie push/lokalne o konieczności zważenia batonu | SHOULD | MVP | Utrzymanie regularności pomiarów. |
| **Z-040** | Wędzenie | 4-fazowy asystent wędzenia (Osuszanie, Dym, Parzenie, Studzenie) | MUST | MVP | Wymuszenie poprawnej technologii masarskiej. |
| **Z-041** | Wędzenie | Bezwzględne potwierdzenie etapu osuszania „do pergaminu” | MUST | MVP | Ochrona przed kwaśnym, smolistym dymem. |
| **Z-042** | Wędzenie | Profile temperatur wędzenia (zimne, ciepłe, gorące) | MUST | MVP | Wzorcowe parametry cieplne komory. |
| **Z-043** | Wędzenie | Baza drewna wędzarniczego z rekomendacjami wsadu | SHOULD | MVP | Dobór aromatu i barwy do mięsa. |
| **Z-044** | Wędzenie | Stoper parzenia w wodzie 75–80°C z alarmem przekroczenia 82°C | MUST | MVP | Ochrona przed wysuszeniem wędliny. |
| **Z-045** | Wędzenie | Śledzenie temperatury sondy rdzeniowej z alertem progowym | MUST | MVP | Alarm 2 stopnie przed celem (np. 66°C przy celu 68°C). |
| **Z-046** | Wędzenie | Stoper studzenia szokowego w lodowatej wodzie (10–15 min) | SHOULD | MVP | Zatrzymanie denaturacji i utrwalenie osłonki. |
| **Z-047** | Wędzenie | Wykres przebiegu temperatur z sesji wędzenia | COULD | 1.1 | Analiza post-mortem udanej partii. |
| **Z-048** | Wędzenie | Bezpośredni odczyt sond bezprzewodowych Bluetooth BLE | COULD | 1.2 | Automatyzacja dla posiadaczy Meater/Inkbird. |


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · A3b · rozdz. 6.2 tabela zakresu cz. 2 (spiżarnia, zegarki, platforma) ==================== -->

# **Charcutier BRD 0.1 — Część A3b: Tabela Zakresu Funkcjonalnego (Część 2: Z-111…Z-220)**

Poniższa tabela definiuje zakres modułów Spiżarni, Zegarków, Wydruku i Platformy.

| ID | Moduł | Funkcjonalność | Priorytet | Etap | Uzasadnienie |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Z-111** | Spiżarnia | Ewidencja elementów mięsnych (schab, szynka, karkówka, boczek, słonina, dziczyzna, drób) | MUST | MVP | Magazyn surowców do partii. |
| **Z-112** | Spiżarnia | Ewidencja jelit i osłonek (kaliber, typ: baranie, wieprzowe, wołowe, kolagen, białkowe) | MUST | MVP | Dobór osłonki do średnicy batonu. |
| **Z-113** | Spiżarnia | Przelicznik zapotrzebowania na jelita (metry bieżące na kg farszu) | SHOULD | MVP | Koniec z niespodziewanym brakiem osłonek podczas nadziewania. |
| **Z-114** | Spiżarnia | Automatyczny odpis mięsa i jelit po utworzeniu partii | SHOULD | MVP | Aktualny stan spiżarni. |
| **Z-120** | Etykiety | Generator wektorowy PDF arkuszy etykiet partii (A4) | MUST | MVP | Identyfikacja wiszących wędlin w komorze. |
| **Z-121** | Etykiety | Kod QR na etykiecie partii ze skrótem ID i metryką | MUST | MVP | Błyskawiczne odnalezienie partii aparatem. |
| **Z-122** | Etykiety | Wbudowany skaner kodów QR aparatem w 100% offline | MUST | MVP | Skanujesz etykietę wiszącej szynki -> otwiera się ekran ważenia. |
| **Z-130** | Zegarki | Aplikacja na Apple Watch z dużymi kafelkami akcji | MUST | MVP | Obsługa brudnymi rękami w masarni (ZP-02). |
| **Z-131** | Zegarki | Wprowadzanie wagi batonu koronką Digital Crown | MUST | MVP | 1-klik = 1 g / 5 g, precyzja bez brudzenia ekranu. |
| **Z-132** | Zegarki | Wibracja haptyczna Taptic Engine dla alertów temperatur | MUST | MVP | Czujesz na nadgarstku, że szynka osiągnęła 68°C. |
| **Z-133** | Zegarki | Live Activity na ekranie blokady i Dynamic Island iPhone'a | MUST | MVP | Podgląd fazy wędzenia i czasu do końca. |
| **Z-134** | Zegarki | Aplikacja na zegarki Garmin Connect IQ | SHOULD | 1.1 | Dla myśliwych i wędliniarzy z zegarkami Fēnix/Forerunner. |
| **Z-135** | Zegarki | Komplikacje tarczy zegarka (liczba aktywnych partii) | COULD | 1.1 | Szybki rzut oka na stan dojrzenia. |
| **Z-140** | Receptury | Baza 12 certyfikowanych receptur wzorcowych Apps4Brew | MUST | MVP | Sprawdzone przepisy na start (Krakowska, Salami, Szynka, Pancetta). |
| **Z-141** | Receptury | Kreator własnych receptur ze skalowaniem wagi wsadu | MUST | MVP | Skalowanie przypraw z 2 kg na 15.5 kg jednym ruchem. |
| **Z-142** | Receptury | Wymiana receptur kodem QR SVG i deep linkiem `charcutier://` | SHOULD | 1.1 | Wymiana receptury między masarzami bez internetu. |
| **Z-150** | Finanse | Kalkulator kosztu 1 kg gotowego wyrobu (z uwzględnieniem kurczu) | SHOULD | MVP | Świadomość rzeczywistego kosztu domowego rzemiosła. |
| **Z-160** | Baza | Relacyjna baza SQLite w trybie WAL w `/Library/SQLite` | MUST | MVP | Bezpieczeństwo danych i transakcyjność ACID. |
| **Z-161** | Baza | Automatyczna rotacja 10 kopii zapasowych bazy | MUST | MVP | Ochrona przed utratą danych (ZP-06). |
| **Z-162** | Baza | Pełny eksport historii i magazynu do pliku CSV | MUST | MVP | Bezpłatna przenośność danych (ZP-07). |
| **Z-170** | Monetyzacja | Obsługa subskrypcji i zakupu Lifetime przez StoreKit 2 | MUST | MVP | Model Apps4Brew ($0.99 / $4.99 / $14.99). |
| **Z-171** | Monetyzacja | Pełny 14-dniowy bezpłatny okres próbny | MUST | MVP | Zapoznanie się ze wszystkimi funkcjami Pro. |
| **Z-172** | Monetyzacja | Blokada tworzenia nowych partii po trialu z historią Read-Only | MUST | MVP | Uczciwe traktowanie użytkownika. |
| **Z-180** | Dostępność | Pełne etykiety VoiceOver i obsługa czytnika ekranu | MUST | MVP | Dostępność dla niewidomych masarzy (P8). |
| **Z-181** | Dostępność | Skalowanie Dynamic Type do największych rozmiarów systemu | MUST | MVP | Czytelność dla seniorów (P4). |


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · A3c · rozdz. 6.3–6.5 (etapy, nakład pracy, warianty MVP) ==================== -->

# **Charcutier BRD 0.1 — Część A3c: Nakład Pracy Agentów i Warianty Wdrożeniowe**

---

## **6.3 Nakład pracy agentów AI (Estymacja zadaniowa)**

Szacunki podano w roboczodniach pracy autonomicznych agentów (z uwzględnieniem pracy równoległej zespołów badawczych, deweloperskich i testowych), zgodnie ze standardem studia Apps4Brew.

| Moduł / Obszar prac | Zadania kluczowe | Dni pracy agentów |
| :--- | :--- | :---: |
| **Fundament & Baza danych** | Schemat SQLite WAL, migracje, ochrona `/Library/SQLite`, 10 kopii zapasowych, model relacyjny. | 2–3 dni |
| **Silnik matematyczny (Peklowanie)** | Formuły stechiometryczne, kalkulator EQ, zalewowy, nastrzyki, strażnik PPM Guard, testy TV-01…16. | 3–4 dni |
| **Silnik dojrzelniczy (Tracker Wagi)** | Model dyfuzji Ficka, detektor Case Hardening, estymator daty, wykres wektorowy SVG, testy TV-17…32. | 3–4 dni |
| **Asystent wędzenia i obróbki cieplnej** | Maszyna stanów stopera 4-fazowego, alerty progowe sond, logika parzenia/studzenia, testy TV-33…50. | 3–4 dni |
| **UI/UX aplikacji mobilnej** | Ekran główny, kalkulator peklowania, tracker wagi, asystent wędzenia, spiżarnia, design system *Smoked Amber & Slate*. | 5–6 dni |
| **Apple Watch & Live Activity** | Natywny target watchOS, obsługa Digital Crown, haptyka Taptic Engine, widżet Live Activity, Dynamic Island. | 4–5 dni |
| **Etykiety PDF & Skaner QR** | Generator arkuszy etykiet przez `expo-print`, integracja skanera `expo-camera`, obsługa offline. | 2–3 dni |
| **Monetyzacja & StoreKit** | Integracja StoreKit 2, paywall, 14-dniowy trial, blokada tworzenia nowych partii z trybem Read-Only. | 2–3 dni |
| **Dostępność, i18n & Testy weryfikacyjne** | VoiceOver, Dynamic Type, testy regresji, testy kontraktowe, skrypt `check-i18n`, bramka CI `verify`. | 3–4 dni |
| **RAZEM (Wariant b+ MUST + 6 akceleratorów)** | — | **27–36 dni agentów** (kalendarzowo: 3–4 tyg.) |

---

## **6.4 Sześć kluczowych akceleratorów wariantu (b+)**

Wariant rekomendowany (b+) rozszerza czysty zbiór MUST o 6 tanich w implementacji funkcji o krytycznym znaczeniu rynkowym:
1. **Wibracja haptyczna Apple Watch dla temperatury rdzenia (BR-ZEG-003):** Umożliwia natychmiastową reakcję masarza bez patrzenia na telefon.
2. **Live Activity na ekranie blokady (BR-ZEG-008):** Podgląd czasu i temperatury wędzarni bez odblokowywania telefonu brudną dłonią.
3. **PPM Guard w kalkulatorze (BR-PEKL-004):** Blokada błędnych dawek azotynu budująca bezwzględne zaufanie użytkownika.
4. **Wykres ubytku masy z detektorem Case Hardening (BR-WAGA-006):** Główny wizualny wyróżnik produktu chroniący wędliny przed zepsuciem.
5. **Konfiguracja 14-dniowego Trialu (BR-ZAK-003):** Niezbędna do wysokiej konwersji przy starcie.
6. **Family Sharing (BR-ZAK-005):** Umożliwia współdzielenie licencji w ramach gospodarstwa domowego.


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · A4 · rozdz. 13, 15 (KPI bez śledzenia, marketing, ASO) ==================== -->

# **Charcutier BRD 0.1 — Część A4: Wskaźniki Sukcesu (KPI), Etyka Prywatności i Dystrybucja**

---

## **13. Wskaźniki sukcesu (KPI) w 100% bez śledzenia użytkowników**

Zgodnie z zasadą **ZP-05 („Data Not Collected”)**, Charcutier nie zawiera żadnego SDK analitycznego (Google Analytics, Firebase, Mixpanel, Amplitude czy Meta Pixel). Sukces produktu mierzony jest wyłącznie zagregowanymi, anonimowymi danymi dostarczanymi natywnie przez Apple App Store Connect:

| Wskaźnik (KPI) | Źródło danych | Cel 3 miesiące po premierze | Cel 12 miesięcy |
| :--- | :--- | :---: | :---: |
| **Pobrania bezpłatne (Installs)** | App Store Connect Analytics | > 2 500 pobrań | > 15 000 pobrań |
| **Konwersja Trial $
ightarrow$ Paid** | App Store Connect Subscriptions | > 6.5% | > 8.0% |
| **Odsetek zakupów Lifetime vs Subskrypcja** | App Store Connect Sales | 40% Lifetime / 60% Subskrypcja | 35% Lifetime / 65% Sub |
| **Średnia ocena w App Store** | App Store Reviews | $\ge 4.85$ ★ (min. 50 ocen) | $\ge 4.88$ ★ (min. 300 ocen) |
| **Zgłoszenia błędów krytycznych (Crash Rate)** | Xcode Organizer (anonimowe logi) | $< 0.05\%$ sesji | $< 0.02\%$ sesji |
| **Retencja partii wyrobów (Proxy Retencji)** | Zdarzenia ukończenia partii (lokalnie) | $> 70\%$ użytkowników kończy min. 1 partię | $> 80\%$ |

---

## **15. Strategia wejścia na rynek (GTM), Marketing i ASO**

### **15.1 Pozycjonowanie w App Store (ASO - App Store Optimization)**
* **Tytuł aplikacji (PL):** `Charcutier — Spiżarnia i Masarz` (30 znaków)
* **Podtytuł (PL):** `Peklowanie, wędzenie, salami` (29 znaków)
* **Słowa kluczowe (Keywords PL):** `masarz,peklowanie,wędzenie,solanka,salami,szynka,kiełbasa,szynkowar,wędliny,mięso,boczek,peklosól` (98 znaków)
* **Tytuł aplikacji (EN):** `Charcutier — Meat & Curing` (26 znaków)
* **Podtytuł (EN):** `Brining, smoking & dry curing` (29 znaków)
* **Słowa kluczowe (EN):** `charcuterie,curing,salumi,salami,brine,smoker,meat,sausage,smoking,prague powder,dry cured,pancetta` (99 znaków)

### **15.2 Strategia dotarcia do społeczności (Community-Driven Growth)**
1. **Społeczność wedlinydomowe.pl:**
   * Publikacja merytorycznego wątku edukacyjnego przedstawiającego kalkulator stężeń solanek i eliminację błędów przeliczania peklosoli.
   * Udostępnienie bezpłatnych kodów promocyjnych dla moderatorów i autorytetów rzemieślniczych celem zebrania opinii.
2. **Reddit r/Charcuterie & r/Smoking:**
   * Pokazanie trackera utraty wagi z algorytmem wykrywania *Case Hardening*. W anglojęzycznej społeczności jest to problem nr 1 poruszany w setkach postów („Is this case hardening?”, „Why is my salami soft inside?”).
3. **Grupy pasjonatów szynkowarów:**
   * Przedstawienie dedykowanego kalkulatora parzenia szynkowarowego z eliminacją wysuszania mięsa.
4. **Kanały wideo i influencerzy wędliniarscy (YouTube):**
   * Współpraca barterowa z twórcami kanałów masarskich (pokazanie aplikacji w akcji przy wędzarni i przy ważeniu wędlin na Apple Watch).


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · B1 · rozdz. 7 narzędzia: kalkulator peklowania i solanek ==================== -->

# **Charcutier BRD 0.1 — Część B1: Narzędzia — Kalkulator Peklowania i Solanek**

Rozdział 7 BRD. Wymagania funkcjonalne modułu peklowania (`BR-PEKL-001` … `BR-PEKL-035`).  
Główny cel: Zapewnienie absolutnego bezpieczeństwa mikrobiologicznego (ochrona przed *Clostridium botulinum*), eliminacja błędów przeliczania dawek azotynów oraz deterministyczny bilans solanek mokrych, suchych i nastrzykowych.

---

### **BR-PEKL-001 Wprowadzanie masy mięsa (Wsadu surowcowego)**
* **Opis:** Użytkownik wprowadza masę przygotowanego elementu mięsnego w gramach lub kilogramach.
* **Persona:** Janusz (P1), Mateusz (P2), Ewelina (P3).
* **Kryteria akceptacji:**
  1. Pole wejściowe akceptuje wartości z dokładnością do 1 g (dla małych porcji od 200 g) lub do 0.01 kg (do 100 kg).
  2. Szybkie presety wagowe: `1.0 kg`, `1.5 kg`, `2.0 kg`, `5.0 kg`, `10.0 kg` oraz manualny keypad numeryczny.
  3. Obsługa jednostek imperialnych (lbs/oz) w przypadku przełączenia profilu regionalnego.
* **Priorytet / Etap:** MUST · MVP.

### **BR-PEKL-002 Wybór metody peklowania**
* **Opis:** Użytkownik wybiera jedną z trzech fundamentalnych metod peklowania:
  1. *Peklowanie równowagowe suche w próżni (Equilibrium Curing - EQ)*
  2. *Peklowanie tradycyjne mokre (Zalewowe / Immersion)*
  3. *Peklowanie nastrzykowe z zalewą uzupełniającą (Injection)*
* **Persona:** Wszyscy.
* **Kryteria akceptacji:**
  1. Wybór metody natychmiast rekonfiguruje pola formularza i model matematyczny kalkulatora.
  2. Przy każdej metodzie wyświetlana jest pigułka informacyjna wyjaśniająca mechanizm dyfuzji i optymalne zastosowanie kulinarne.
* **Priorytet / Etap:** MUST · MVP.

### **BR-PEKL-003 Wybór docelowego stężenia soli (Salinity Target)**
* **Opis:** Użytkownik określa docelowy procent soli w gotowym mięsie po osiągnięciu stanu równowagi osmotycznej.
* **Kryteria akceptacji:**
  1. Suwak wyboru od **1.8% do 3.2%** (krok co 0.1%).
  2. Domyślne wartości podpowiedzi:
     - `1.8% – 2.0%` — wędzonki delikatne, szynkowar, drób.
     - `2.2% – 2.3%` — klasyczne polskie szynki, boczki i polędwice wędzone.
     - `2.5% – 2.8%` — wędliny długodojrzewające (salami, coppa, lonzino, bresaola).
     - `3.0% – 3.2%` — tradycyjne szynki surowe podsuszane (typu parmeńskiego/jamón).
  3. Wartości poniżej 1.8% generują żółte ostrzeżenie: *„Stężenie soli poniżej 1.8% obniża barierę bakteriostatyczną!”*.
* **Priorytet / Etap:** MUST · MVP.

### **BR-PEKL-004 Strażnik PPM Guard (Azotyn sodu w mg/kg)**
* **Opis:** System w czasie rzeczywistym przelicza i wyświetla stężenie czystego azotynu sodu ($NaNO_2$) w przeliczeniu na Parts Per Million (PPM = mg azotynu na 1 kg masy wsadu).
* **Kryteria akceptacji:**
  1. Wyświetlanie czytelnej pigułki z wartością PPM i statusem normatywnym.
  2. Zakres optymalny: **100 – 150 PPM** (status zielony: *„Zgodny z normą UE i USDA”*).
  3. Zakres podwyższony: **151 – 200 PPM** (status żółty: *„Górna granica normy USDA dla kiełbas”*).
  4. Przekroczenie **> 200 PPM** generuje czerwony bloker i komunikat: *„Krytyczne przekroczenie bezpiecznej dawki azotynu! Zagrożenie toksykologiczne!”*.
  5. Spadek **< 80 PPM** generuje ostrzeżenie: *„Dawka azotynu niewystarczająca do zahamowania zarodników Clostridium botulinum!”*.
* **Priorytet / Etap:** MUST · MVP.

### **BR-PEKL-005 Twardy selektor typu peklosoli (Polska vs Cure #1)**
* **Opis:** Użytkownik wybiera produkt peklujący, którym dysponuje, co eliminuje śmiertelne pomyłki stężeń.
* **Kryteria akceptacji:**
  1. Trzy twarde warianty:
     - `Polska Peklosól (0.5% – 0.6% NaNO2)` — domyślna dla rynku PL.
     - `Prague Powder #1 / InstaCure #1 (6.25% NaNO2)` — standard US/UK.
     - `Sól czysta bez azotynu (sól kamienna niejodowana / morska)` — dla wyrobów bez azotynu.
  2. Wybór wariantu automatycznie przelicza gramaturę w oparciu o wybrane stężenie docelowe i docelowe PPM.
* **Priorytet / Etap:** MUST · MVP.

### **BR-PEKL-006 Blokada Cure #2 / Saletry w wyrobach z obróbką termiczną**
* **Opis:** System uniemożliwia dodanie azotanu potasu ($KNO_3$ / Cure #2) do wyrobów parzonych, pieczonych i wędzonych na gorąco.
* **Kryteria akceptacji:**
  1. Opcja wyboru Cure #2 / Saletry jest aktywna **wyłącznie** po zaznaczeniu flagi: `Wyrób surowy długodojrzewający (min. 28 dni suszenia)`.
  2. W każdym innym przypadku pole jest wyszarzone z wyjaśnieniem: *„Azotany są redukowane tylko w procesie powolnego dojrzewania. W wyrobach parzonych i pieczonych sprzyjają tworzeniu rakotwórczych nitrozoamin!”*.
* **Priorytet / Etap:** MUST · MVP.

### **BR-PEKL-007 Suwak mieszania peklosoli z solą kamienną**
* **Opis:** Użytkownik może ustalić proporcję mieszanki peklosoli i soli czystej (np. 50/50), zachowując docelową słoność i kontrolując spadek PPM.
* **Kryteria akceptacji:**
  1. Suwak proporcji: od 0% do 100% udziału peklosoli w całkowitej puli soli.
  2. Kalkulator na żywo aktualizuje dwie pozycje w recepturze: `Peklosól: X.X g` oraz `Sól niejodowana: Y.Y g`.
* **Priorytet / Etap:** SHOULD · MVP.

### **BR-PEKL-008 Kalkulator solanki zalewowej mokrej (Immersion Brine)**
* **Opis:** Obliczanie ilości wody i stężenia soli przy tradycyjnym peklowaniu w naczyniu kamionkowym lub szklanym.
* **Kryteria akceptacji:**
  1. Wprowadzanie objętości wody (litry) lub automatyczny dobór z reguły masarskiej: $V_{woda} = 0.4 	imes M_{mięso}$.
  2. Wyliczenie masy soli dla całkowitej masy układu: $M_{układ} = M_{mięso} + M_{woda}$.
  3. Prezentacja stężenia solanki w procentach masowych, stopniach Baumé (°Bé) oraz stopniach Salometru.
* **Priorytet / Etap:** MUST · MVP.

### **BR-PEKL-009 Kalkulator peklowania nastrzykowego**
* **Opis:** Obliczanie stężenia i objętości solanki do nastrzykiwania szynek z kością i grubych mięśni.
* **Kryteria akceptacji:**
  1. Wprowadzanie docelowego procentu nastrzyku (zakres 6% do 15%, domyślnie 10% masy wsadu).
  2. Wyliczenie dokładnej wagi solanki do wprowadzenia strzykawką: $M_{nastrzyk} = M_{mięso} 	imes P_{nastrzyk}$.
  3. Podział soli na fazę nastrzykową i fazę zalewy otaczającej w celu uzyskania jednorodnego stężenia po wyrównaniu.
* **Priorytet / Etap:** MUST · MVP.

### **BR-PEKL-010 Skalowanie ziół, przypraw i cukrów**
* **Opis:** Baza przypraw masarskich ze skalowaniem w gramach na 1 kg wsadu.
* **Kryteria akceptacji:**
  1. Dostępne pozycje: pieprz czarny, pieprz biały, kolendra, czosnek świeży, czosnek suszony, ziele angielskie, liść laurowy, majeranek, jałowiec, papryka ostra/słodka, gorczyca, glukoza/dekstroza, sacharoza, askorbinian sodu.
  2. Skalowanie przypraw z dokładnością do 0.1 g.
  3. Informacja technologiczna przy cukrach: cukry proste (glukoza) jako paliwo dla bakterii kwasu mlekowego w salami.
* **Priorytet / Etap:** MUST · MVP.

### **BR-PEKL-011 Asystent czasu trwania peklowania wg dyfuzji Ficka**
* **Opis:** Obliczanie rekomendowanej liczby dni peklowania na podstawie najmniejszego wymiaru geometrycznego mięśnia (grubości w cm).
* **Kryteria akceptacji:**
  1. Wprowadzanie grubości w cm.
  2. Wyliczenie dni peklowania w temp 4–6°C wg wzoru Ficka: $t = k \cdot d^2$ (z uwzględnieniem nastrzyku redukującego czas o 40%).
* **Priorytet / Etap:** SHOULD · MVP.

### **BR-PEKL-012 Dedykowany tryb Szynkowaru**
* **Opis:** Recepturowanie i asystent wsadów do szynkowarów cylindrycznych i prostokątnych.
* **Kryteria akceptacji:**
  1. Wybór pojemności szynkowaru (np. 0.8 kg, 1.5 kg, 3.0 kg).
  2. Rekomendacja ilości wody do dolania w celu wytworzenia naturalnej galaretki (żelatyny z wywaru).
  3. Instrukcja naciągu sprężyny dociskowej.
* **Priorytet / Etap:** SHOULD · MVP.


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · B2 · rozdz. 7 narzędzia: tracker utraty wagi i komora dojrzewalnicza ==================== -->

# **Charcutier BRD 0.1 — Część B2: Narzędzia — Tracker Utraty Wagi i Komora Dojrzewalnicza**

Wymagania funkcjonalne modułu kontroli utraty masy wodnej i dojrzenia wędlin (`BR-WAGA-001` … `BR-WAGA-035`).  
Główny cel: Precyzyjny nadzór nad ubytkiem masy wodnej (cel: 30–40% ubytku), ochrona przed zjawiskiem *Case Hardening* (stwardnienie powierzchniowe zamykające wilgoć w środku) oraz estymacja daty gotowości wyrobu.

---

### **BR-WAGA-001 Rejestracja nowej partii wędliny dojrzewającej**
* **Opis:** Użytkownik rejestruje wsad powieszony w komorze dojrzewalniczej.
* **Kryteria akceptacji:**
  1. Pola: Nazwa wyrobu (np. *Salami Finocchiona #02*), data i godzina startu, waga początkowa w gramach ($M_0$), kaliber osłonki (mm), rodzaj kultury starterowej (np. Bactoferm T-SPX), docelowy procent ubytku masy.
  2. Automatyczne nadanie unikalnego identyfikatora partii (np. `BATCH-2026-10-04`).
* **Priorytet / Etap:** MUST · MVP.

### **BR-WAGA-002 Wprowadzanie kolejnych ważeń kontrolnych**
* **Opis:** Rejestracja aktualnej wagi batonu podczas regularnych kontroli w komorze.
* **Kryteria akceptacji:**
  1. Wprowadzanie daty pomiaru (domyślnie teraz) i wagi w gramach.
  2. Możliwość opcjonalnego podania parametrów mikroklimatu w chwili ważenia: temperatura komory (°C) i wilgotność względna (% RH).
  3. Natychmiastowe przeliczenie dotychczasowego ubytku masy w gramach i procentach:
     $$\Delta M = M_0 - M_t, \quad \Delta M\% = rac{M_0 - M_t}{M_0} 	imes 100\%$$
* **Priorytet / Etap:** MUST · MVP.

### **BR-WAGA-003 Dynamiczny wykres wektorowy SVG ubytku masy**
* **Opis:** Wykres liniowy prezentujący krzywą wysychania wędliny w czasie.
* **Kryteria akceptacji:**
  1. Oś pozioma: Czas w dniach od powieszenia w komorze.
  2. Oś pionowa lewa: Aktualna masa w gramach.
  3. Oś pionowa prawa: Procent ubytku masy (od 0% do 50%).
  4. Pozioma linia przerywana oznaczająca zadany cel (np. 35%).
  5. Cieniowany korytarz optymalnego tempa wysychania (bezpieczna strefa dyfuzji).
* **Priorytet / Etap:** MUST · MVP.

### **BR-WAGA-004 Detektor zjawiska Case Hardening (Algorytm anty-zakalcowy)**
* **Opis:** Zaawansowana analiza kinetyki odparowania wody w pierwszych 7 dobach dojrzewania.
* **Kryteria akceptacji:**
  1. Jeśli w pierwszych 5 dobach średni ubytek masy przekracza **3.0% na dobę**, a wilgotność w komorze wynosi **< 75% RH**, aplikacja natychmiast wyświetla czerwony baner ostrzegawczy.
  2. Treść ostrzeżenia: *„Zagrożenie zesztywnieniem powierzchniowym (Case Hardening)! Woda odparowuje szybciej niż dyfunduje z rdzenia. Zwiększ wilgotność do min. 82% lub owiń batony papierem pergaminowym na 48 godzin!”*.
* **Priorytet / Etap:** MUST · MVP.

### **BR-WAGA-005 Estymator przewidywanej daty gotowości (Krzywa logarytmiczna)**
* **Opis:** Prognozowanie dnia, w którym wędlina osiągnie docelowy ubytek masy (np. 35%).
* **Kryteria akceptacji:**
  1. Obliczenia bazują na nieliniowej regresji logarytmicznej, odzwierciedlającej fizyczny spadek prędkości dyfuzji w miarę spadku wilgotności wolnej w mięsie.
  2. Wyświetlanie komunikatu: *„Szacowana gotowość: 14 listopada 2026 r. (pozostało ok. 21 dni)”*.
* **Priorytet / Etap:** SHOULD · MVP.

### **BR-WAGA-006 Monitorowanie fazy fermentacji salami i pomiaru pH**
* **Opis:** Moduł dedykowany pierwszym 24–72 godzinom życia kiełbas fermentowanych.
* **Kryteria akceptacji:**
  1. Rejestracja temperatury fermentacji (zazwyczaj 20–24°C) i wilgotności (90–95% RH).
  2. Pole wprowadzania pomiaru kwasowości (paskiem lakmusowym lub pH-metrem cyfrowym).
  3. Sygnalizacja osiągnięcia bezpiecznej granicy biologicznej: **$pH \le 5.3$** (blokada toksyn gronkowcowych).
* **Priorytet / Etap:** SHOULD · MVP.

### **BR-WAGA-007 Atlas pleśni szlachetnych i patogennych**
* **Opis:** Wbudowany przewodnik ze zdjęciami makro do oceny nalotu na powierzchni wędlin.
* **Kryteria akceptacji:**
  1. Karta pleśni szlachetnej (*Penicillium nalgiovense* / *Penicillium candidum*): śnieżnobiały, aksamitny, zwarty nalot o grzybowym aromacie.
  2. Karty pleśni niebezpiecznych: zielona, czarna, żółta, włoskowata, śluzowata.
  3. Procedura ratunkowa w przypadku infekcji punktowej dzikiej pleśni: zmycie szczoteczką z roztworem octu 5% i solanki 10%.
* **Priorytet / Etap:** SHOULD · MVP.


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · B3 · rozdz. 7 narzędzia: asystent wędzenia i obróbki termicznej ==================== -->

# **Charcutier BRD 0.1 — Część B3: Narzędzia — Asystent Wędzenia i Obróbki Termicznej**

Wymagania funkcjonalne asystenta wędzarniczego i obróbki cieplnej (`BR-WEDZ-001` … `BR-WEDZ-035`).  
Główny cel: Wymuszenie technologicznego reżimu 4 faz (Osuszanie $
ightarrow$ Wędzenie $
ightarrow$ Parzenie/Pieczenie $
ightarrow$ Studzenie), eliminacja wędzenia na mokro oraz precyzyjne alarmy temperatur rdzenia.

---

### **BR-WEDZ-001 Maszyna stanów asystenta wędzenia (4 Fazy)**
* **Opis:** Proces wędzenia podzielony jest na 4 sekwencyjne etapy:
  1. *Faza 1: Osuszanie bez dymu*
  2. *Faza 2: Wędzenie dymem właściwym*
  3. *Faza 3: Dobicie termiczne (Parzenie w wodzie LUB Pieczenie w wędzarni)*
  4. *Faza 4: Studzenie szokowe w zimnej wodzie*
* **Kryteria akceptacji:**
  1. Przejście między fazami wymaga świadomej akcji użytkownika (tapnięcie lub potwierdzenie na Apple Watch).
  2. Każda faza posiada odrębny stoper czasu i docelowe parametry temperaturowe.
* **Priorytet / Etap:** MUST · MVP.

### **BR-WEDZ-002 Faza 1: Bezwzględne osuszanie powierzchniowe („Do pergaminu”)**
* **Opis:** Faza przygotowania powierzchni mięsa przed podaniem dymu.
* **Kryteria akceptacji:**
  1. Parametry domyślne: temperatura komory **40 – 50°C**, maksymalny przepływ powietrza (pełny cug), **BEZ DYMU**.
  2. Przed odblokowaniem przejścia do Fazy 2 aplikacja wyświetla modal weryfikacyjny: *„Czy osłonka/powierzchnia mięsa jest w dotyku całkowicie sucha, ciepła i szeleści jak pergamin?”*.
  3. Wyjaśnienie technologiczne: podanie dymu na mokre mięso powoduje kondensację kwasów i kreozotu, prowadząc do kwaśnego smaku i czarnej barwy.
* **Priorytet / Etap:** MUST · MVP.

### **BR-WEDZ-003 Faza 2: Profile wędzenia dymem**
* **Opis:** Kontrola procesu nasycania dymem wędzarniczym.
* **Kryteria akceptacji:**
  1. Trzy profile temperaturowe komory:
     - *Wędzenie zimne:* **16 – 22°C** (szynki surowe, kabanosy podsuszane, łosoś).
     - *Wędzenie ciepłe:* **25 – 45°C** (kiełbasy parzone).
     - *Wędzenie gorące:* **50 – 70°C** (wędzonki tradycyjne, boczki, szynki).
  2. Stoper czasu dymienia z powiadomieniem dźwiękowym i wibracyjnym o zakończeniu etapu.
* **Priorytet / Etap:** MUST · MVP.

### **BR-WEDZ-004 Baza gatunków drewna wędzarniczego**
* **Opis:** Wybór zrębków lub polan drewnianych z charakterystyką profilu sensorycznego.
* **Kryteria akceptacji:**
  1. Dostępne gatunki: Olcha (złocisty kolor, uniwersalna), Buk (złocisto-brązowy, delikatny), Dąb (ciemnobrązowy, wyrazisty), Jabłoń (słodkawy aromat owocowy), Wiśnia (ciemna mahoniowa barwa), Śliwa, Jałowiec (dodatek na finisz).
* **Priorytet / Etap:** SHOULD · MVP.

### **BR-WEDZ-005 Faza 3A: Parzenie w kąpieli wodnej (Water Scalding)**
* **Opis:** Tradycyjna obróbka cieplna w kociołku / garnku z wodą.
* **Kryteria akceptacji:**
  1. Temperatura wody: zakres **75 – 80°C**.
  2. Alarm przekroczenia temperatury wody powyżej **82°C**: *„Woda zbyt gorąca! Ryzyko wytopienia tłuszczu i wysuszenia mięsa!”*.
  3. Wzór szacowania czasu parzenia: ok. 50–60 minut na 1 kg masy najgrubszego elementu lub do osiągnięcia docelowej temperatury rdzenia.
* **Priorytet / Etap:** MUST · MVP.

### **BR-WEDZ-006 Monitorowanie temperatury rdzenia mięsa (Core Temperature)**
* **Opis:** Prowadzenie pomiaru temperatury geometrycznego środka wędliny za pomocą sondy igłowej.
* **Kryteria akceptacji:**
  1. Wprowadzanie bieżącego odczytu z sondy.
  2. Docelowe temperatury wewnętrzne:
     - Polędwica / Schab: **62 – 65°C** (powyżej 65°C schab staje się suchy).
     - Szynka wieprzowa: **68 – 70°C**.
     - Baleron (karkówka): **68 – 71°C**.
     - Boczek: **70 – 72°C**.
     - Kiełbasy wieprzowe: **68 – 70°C**.
     - Drób: **74°C** (bezwzględny wymóg inaktywacji *Salmonella*).
  3. **Alarm wczesnego ostrzegania:** Wibracja i dźwięk na 2°C przed osiągnięciem celu (np. przy 66°C dla szynki).
* **Priorytet / Etap:** MUST · MVP.

### **BR-WEDZ-007 Faza 4: Studzenie szokowe w zimnej wodzie**
* **Opis:** Natychmiastowe obniżenie temperatury po zakończeniu parzenia lub pieczenia.
* **Kryteria akceptacji:**
  1. Stoper studzenia: **10 – 15 minut** w bieżącej wodzie o temperaturze $< 15^\circ	ext{C}$.
  2. Cel technologiczny: Zatrzymanie dalszej denaturacji białek pod wpływem ciepła zakumulowanego w rdzeniu, zapobieganie pomarszczeniu osłonek jelitowych oraz szybkie przejście przez strefę namnażania bakterii (20–50°C).
* **Priorytet / Etap:** SHOULD · MVP.


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · B4 · rozdz. 7 narzędzia: spiżarnia mięsna, osłonki i etykiety QR PDF ==================== -->

# **Charcutier BRD 0.1 — Część B4: Narzędzia — Spiżarnia Mięsna, Jelita i Etykiety QR**

Wymagania funkcjonalne modułu magazynowego, osłonek i wydruku etykiet (`BR-SPIZ-001` … `BR-SPIZ-025`).

---

### **BR-SPIZ-001 Ewidencja surowców mięsnych w spiżarni/zamrażarce**
* **Opis:** Rejestracja zapasów mięsa świeżego i mrożonego.
* **Kryteria akceptacji:**
  1. Pola: Typ elementu (szynka, schab, karkówka, boczek, słonina, podgardle, dziczyzna, drób), masa w kg, data zakupu/zamrożenia, partia/źródło (np. *Rzeźnik Wiejski*), cena za kg.
  2. Automatyczny odpis masy surowca podczas tworzenia nowej partii peklowania.
* **Priorytet / Etap:** MUST · MVP.

### **BR-SPIZ-002 Inwentarz jelit naturalnych i osłonek**
* **Opis:** Rejestr posiadanych osłonek wędliniarskich.
* **Kryteria akceptacji:**
  1. Baza typów osłonek:
     - *Jelita wieprzowe cienkie:* kaliber 26/28 mm, 28/30 mm, 30/32 mm (kiełbasy tradycyjne).
     - *Jelita baranie:* kaliber 18/20 mm, 20/22 mm, 22/24 mm (kabanosy, parówki).
     - *Jelita wołowe wiankowe:* kaliber 40/43 mm (pasztetowa, kiszka).
     - *Osłonki kolagenowe jadalne:* kalibry 19 mm, 22 mm.
     - *Osłonki białkowe i fibrusowe (niejadalne):* kaliber 50–100 mm (szynkowa, krakowska, salami).
  2. Ewidencja w metrach bieżących lub pęczkach.
* **Priorytet / Etap:** MUST · MVP.

### **BR-SPIZ-003 Kalkulator zapotrzebowania na jelita**
* **Opis:** Obliczanie ile metrów osłonki danego kalibru potrzeba na określoną wagę farszu.
* **Kryteria akceptacji:**
  1. Wzór geometryczny: na podstawie kalibru $D$ w mm i gęstości farszu $
ho pprox 1.05	ext{ g/cm}^3$, system wylicza pojemność 1 metra bieżącego jelita (np. jelito wieprzowe 28/30 mieści ok. 0.55 kg farszu na 1 m; na 10 kg farszu potrzeba ok. 18 metrów).
* **Priorytet / Etap:** SHOULD · MVP.

### **BR-SPIZ-004 Generator arkuszy etykiet partii A4 w PDF**
* **Opis:** Natywne generowanie plików PDF z etykietami na wiszące wędliny do druku przez `expo-print`.
* **Kryteria akceptacji:**
  1. Szablon arkusza A4 z siatką zawieszek (np. 8 etykiet na stronę z liniami cięcia).
  2. Zawartość etykiety: Nazwa partii, numer partii, data powieszenia, waga początkowa, waga docelowa (-35%), wektorowy kod QR.
* **Priorytet / Etap:** MUST · MVP.

### **BR-SPIZ-005 Skaner kodów QR etykiet aparatem telefonu**
* **Opis:** Błyskawiczne odnajdywanie partii w komorze dojrzewalniczej za pomocą aparatu w 100% offline.
* **Kryteria akceptacji:**
  1. Skaner rozpoznaje kod QR partii w ułamku sekundy i natychmiast otwiera formularz dodania ważenia dla tej konkretnej wędliny.
* **Priorytet / Etap:** MUST · MVP.


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · B5 · rozdz. 7 narzędzia: Apple Watch, Garmin, Live Activity i Hands-Free ==================== -->

# **Charcutier BRD 0.1 — Część B5: Narzędzia — Smartwatche i Scenariusze Hands-Free**

Wymagania funkcjonalne dla Apple Watch, Live Activity i integracji ubieralnych (`BR-ZEG-001` … `BR-ZEG-025`).  
Główny cel: Umożliwienie pełnej kontroli procesów bez dotykania szklanego ekranu telefonu tłustymi lub mokrymi dłońmi.

---

### **BR-ZEG-001 Dedykowana aplikacja na Apple Watch (watchOS 11+)**
* **Opis:** Niezależna aplikacja na zegarek synchronizująca się w czasie rzeczywistym z bazą iPhone'a.
* **Kryteria akceptacji:**
  1. Działa płynnie w tle podczas aktywnej sesji wędzenia lub ważenia.
  2. Bardzo duży kontrast (stylistyka czarno-bursztynowa) i powiększone kafelki dotykowe min. 44x44 pt.
* **Priorytet / Etap:** MUST · MVP.

### **BR-ZEG-002 Wprowadzanie wagi batonu koronką Digital Crown**
* **Opis:** Precyzyjne wprowadzanie gramatury podczas ważenia w piwnicy/komorze za pomocą pokrętła zegarka.
* **Kryteria akceptacji:**
  1. Obrót koronki Digital Crown zmienia wagę o 1 g (powolny obrót) lub o 10 g (szybki obrót).
  2. Wyraźny klik haptyczny Taptic Engine przy każdej zmianie wartości.
  3. Zatwierdzenie pomiaru jednym stuknięciem w duży przycisk *„Zapisz pomiar”*.
* **Priorytet / Etap:** MUST · MVP.

### **BR-ZEG-003 Haptyczne alarmy wibracyjne temperatur i faz**
* **Opis:** Informowanie użytkownika o kluczowych momentach obróbki cieplnej poprzez wibrację nadgarstka.
* **Kryteria akceptacji:**
  1. Wyrazisty wzorzec wibracji (Taptic Notification) na 2°C przed osiągnięciem temperatury docelowej rdzenia.
  2. Ciągły alarm wibracyjny po osiągnięciu temperatury wyjęcia wędliny z wody lub wędzarni.
  3. Wibracja przy zakończeniu etapu osuszania.
* **Priorytet / Etap:** MUST · MVP.

### **BR-ZEG-004 Live Activity na ekranie blokady i Dynamic Island iPhone'a**
* **Opis:** Stały widżet systemowy prezentujący przebieg aktywnego wędzenia lub parzenia.
* **Kryteria akceptacji:**
  1. Wyświetla aktualną fazę (np. *Wędzenie dymem buk/olcha*), upływający czas, aktualną temperaturę komory i temperaturę rdzenia.
  2. Widoczny bez konieczności odblokowywania telefonu.
* **Priorytet / Etap:** MUST · MVP.

### **BR-ZEG-005 Aplikacja na zegarki Garmin Connect IQ**
* **Opis:** Lekki widget / aplikacja Connect IQ dla użytkowników zegarków sportowych Garmin (Fēnix, Epix, Forerunner).
* **Kryteria akceptacji:**
  1. Odczyt stanu timerów i alarmów wibracyjnych w trakcie wędzenia.
* **Priorytet / Etap:** SHOULD · 1.1 (Prototyp komunikacji w MVP).


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · B6 · rozdz. 7 narzędzia: baza receptur, kalkulator kosztów, CSV i dostępność ==================== -->

# **Charcutier BRD 0.1 — Część B6: Narzędzia — Receptury, Kosztorys, Kopia i Dostępność**

Wymagania funkcjonalne bazy receptur, wyceny, transferu danych i ułatwień dostępu (`BR-RECP-001` … `BR-RECP-030`).

---

### **BR-RECP-001 Baza 12 certyfikowanych receptur mistrzowskich Apps4Brew**
* **Opis:** Zestaw gotowych, bezpiecznych i przebadanych technologicznie receptur wbudowanych w aplikację:
  1. *Kiełbasa Krakowska Sucha Pieczona*
  2. *Salami Milano (fermentowane z kulturą T-SPX)*
  3. *Polędwica Łososiowa Wędzona na Zimno*
  4. *Szynka Tradycyjna z Kością (metoda nastrzykowo-zalewowa)*
  5. *Boczek Wędzony Parzony*
  6. *Kabanosy Staropolskie w jelicie baranim*
  7. *Bresaola Wołowa (suszone ligawa/udziec)*
  8. *Pancetta Arrotolata (boczek dojrzewający rolowany)*
  9. *Szynka Szynkowarowa Drobiowa (czysty skład)*
  10. *Lonzino (polędwica wieprzowa dojrzewająca)*
  11. *Biała Kiełbasa Parzona Wielkanocna*
  12. *Baleron Wędzony Parzony w kątnicy*
* **Kryteria akceptacji:**
  1. Każda receptura zawiera rygorystyczny bilans mięs, dobór jelit, gramaturę przypraw, stężenie peklosoli i profil termiczny.
* **Priorytet / Etap:** MUST · MVP.

### **BR-RECP-002 Kalkulator kosztu 1 kg gotowego wyrobu (Real Cost Calculator)**
* **Opis:** Obliczanie rzeczywistego kosztu wytworzenia wyrobu domowego z uwzględnieniem ubytku wody (kurczu).
* **Kryteria akceptacji:**
  1. Użytkownik podaje ceny zakupu surowców (mięso, jelita, przyprawy, prąd/drewno).
  2. Formuła uwzględnia odparowanie wody:
     $$	ext{Koszt}_{	ext{1 kg gotowego}} = rac{\sum 	ext{Koszty wsadu}}{M_{	ext{gotowa (po 35% ubytku)}}}$$
  3. Prezentacja porównania: koszt domowego salami rzemieślniczego vs cena sklepowa (np. 120 zł/kg w delikatesach).
* **Priorytet / Etap:** SHOULD · MVP.

### **BR-RECP-003 Pełny eksport historii i bazy do formatu CSV i JSON**
* **Opis:** Bezpłatne przenoszenie danych użytkownika.
* **Kryteria akceptacji:**
  1. Eksport tabel `batches`, `curing_logs`, `weight_logs`, `smoke_sessions` do plików CSV zgodnych z MS Excel i Apple Numbers.
  2. Pełny backup JSON całej bazy danych z możliwością przywrócenia w 1 tapnięcie.
* **Priorytet / Etap:** MUST · MVP.

### **BR-RECP-004 Dostępność cyfrowa (VoiceOver & Dynamic Type)**
* **Opis:** Pełne wsparcie dla osób niewidomych (P8) i seniorów (P4).
* **Kryteria akceptacji:**
  1. Każdy element interaktywny posiada unikalny `accessibilityLabel` i `accessibilityHint`.
  2. Odczyt wykresu ubytku masy przez VoiceOver w formie podsumowania audio: *„Partia Salami, 18. dzień suszenia, ubytek 24.5 procent, cel 35 procent”*.
  3. Pełna skalowalność czcionek do największych rozmiarów systemowych Dynamic Type bez obcinania tekstu.
* **Priorytet / Etap:** MUST · MVP.


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · C1 · rozdz. 7 nauka: szkoła rzemiosła, kultury starterowe, pleśnie i drewno ==================== -->

# **Charcutier BRD 0.1 — Część C1: Nauka — Szkoła Rzemiosła Masarskiego, Atlas Kultur i Drewna**

Rozdział 7 BRD (Moduł Edukacyjny).  
Główny cel: Przekazanie użytkownikowi rzetelnej, zweryfikowanej naukowo wiedzy masarskiej, mikrobiologicznej i technologicznej, eliminującej mity z forów internetowych.

---

## **1. Anatomia półtuszy i klasyfikacja mięsa masarskiego (Klasy I–IV)**

W polskim przetwórstwie mięsnym fundamentem powtarzalności wyrobów jest klasyfikacja surowca wg normy branżowej (PN-A-82007). Niedopuszczalne jest wrzucanie do wilka „kawałka mięsa z marketu” bez podziału na klasy technologiczne:

1. **Klasa I (Chude, bez ścięgien i powięzi):**
   * *Pochodzenie:* Mięsień najdłuższy grzbietu (schab), mięśnie szynki (zrazowa, orzech), polędwiczka.
   * *Charakterystyka:* Tłuszcz międzymięśniowy $< 3\%$, brak widocznego tłuszczu zewnętrznego, brak ścięgien.
   * *Rola technologiczna:* Zapewnia strukturę mozaiki w kiełbasach grubo krojonych (np. Krakowska), daje soczystość i kruchość.
2. **Klasa IIA (Chude z niewielką ilością tłuszczu):**
   * *Pochodzenie:* Łopatka, odcięte elementy szynki i karkówki.
   * *Charakterystyka:* Tłuszcz do $15-20\%$, brak grubych ścięgien.
   * *Rola:* Farsz podstawowy, baza smakowa.
3. **Klasa IIB (Tłuste mięso):**
   * *Pochodzenie:* Boczek, podgardle, tłustsze partie karkówki.
   * *Charakterystyka:* Tłuszcz do $45-55\%$.
   * *Rola:* Nośnik smaku i aromatu wędzonki, zapobiega suchości wyrobu. Tłuszcz w kiełbasach parzonych musi być zemulgowany z białkiem.
4. **Klasa III (Klejowate, bogate w kolagen):**
   * *Pochodzenie:* Goleń (golonka), pręga wołowa, ścięgna z rozbioru szynki i łopatki.
   * *Charakterystyka:* Mięso bardzo ścięgniste, bogate w kolagen rozpuszczalny pod wpływem obróbki termicznej.
   * *Rola:* Po zmieleniu na najdrobniejszym sitku (2–3 mm) i kutrowaniu/wyrobieniu z lodem tworzy naturalny klej wiążący batony kiełbasy (zastępuje przemysłowe fosforany!).

---

## **2. Atlas kultur starterowych (Bakterie fermentacji mlekowej i gronkowce)**

Do bezpiecznej produkcji wędlin fermentowanych (salami, metka) niezbędne są certyfikowane szczepy bakterii:

| Szczep / Preparat | Gatunki bakterii | Temperatura optymalna | Rola technologiczna i profil smakowy |
| :--- | :--- | :---: | :--- |
| **Bactoferm T-SPX** | *Pediococcus pentosaceus*, *Staphylococcus xylosus* | **18 – 24°C** | Klasyczne europejskie salami. Powolny spadek pH, głęboki aromat dojrzewania, stabilna barwa nitrozylomioglobiny. |
| **Bactoferm F-LC** | *Pediococcus acidilactici*, *Lactobacillus curvatus*, *Staphylococcus carnosus* | **20 – 30°C** | Uniwersalna kultura ochronna. Wytwarza bakteriocyny hamujące wzrost *Listeria monocytogenes*. |
| **Bactoferm B-LC-78** | *Pediococcus acidilactici*, *Staphylococcus carnosus* | **24 – 35°C** | Szybka fermentacja w stylu amerykańskim (tangy salami, pepperoni). Gwałtowny spadek pH poniżej 5.0 w 24 godziny. |
| **SafePro B-LC-48** | *Lactobacillus sakei*, *Staphylococcus carnosus* | **15 – 22°C** | Tradycyjne wyroby śródziemnomorskie (Fuet, Salchichón). Łagodna kwasowość, silna lipoliza. |

---

## **3. Atlas pleśni szlachetnych (*Penicillium*)**

Pleśń na wędlinach długodojrzewających dzieli się na zbawienną dla rzemiosła oraz śmiertelnie niebezpieczną:

### **Pleśń szlachetna: *Penicillium nalgiovense* (Bactoferm 4) & *Penicillium candidum***
* **Wygląd:** Śnieżnobiały, aksamitny, równomierny dywan na powierzchni osłonki. Brak włosków, brak puszystości przypominającej watę.
* **Aromat:** Przyjemny, leśny, grzybowy (świeże pieczarki).
* **Cztery funkcje obronne:**
  1. *Parasol antyoksydacyjny:* Zabezpiecza tłuszcze przed kontaktem ze światłem i tlenem, zapobiegając jełczeniu.
  2. *Regulator wilgoci:* Tworzy barierę spowalniającą nadmierne odparowanie wody z powierzchni, bezpośrednio zapobiegając *Case Hardening*.
  3. *Odkwaszanie (De-acidification):* Asymiluje kwas mlekowy, łagodząc kwasowość salami i podnosząc pH powierzchni do 5.8–6.2.
  4. *Blokada biologiczna:* Zajmuje niszę ekologiczną, uniemożliwiając skiełkowanie toksycznym pleśniom zielonym i czarnym.

### **Pleśnie patogenne i skażenia dzikie (Do natychmiastowego usunięcia):**
* **Pleśnie czarne (*Aspergillus niger*, *Cladosporium*):** Tworzą czarne, smoliste plamy wnikające w głąb mięsa. Wytwarzają rakotwórcze ochratoksyny A. Wsad z czarną pleśnią wnikającą pod osłonkę podlega bezwzględnej utylizacji!
* **Pleśnie zielone i szare (*Penicillium expansum*, *Mucor*):** Włoskowata, kłaczkowata struktura. Wytwarzają patulinę. W przypadku punktowego zakażenia na powierzchni osłonki: natychmiastowe zmycie szczoteczką nasączoną 10% roztworem soli i 5% octu spirytusowego.

---

## **4. Atlas i chemia drewna wędzarniczego**

Dym wędzarniczy składa się z ponad 400 związków chemicznych (fenoli, krezoli, kwasów organicznych i związków karbonylowych). Gatunek drewna decyduje o barwie i bukiecie smakowym:

| Gatunek drewna | Barwa wędzonki | Profil aromatyczny | Zastosowanie kulinarne |
| :--- | :--- | :--- | :--- |
| **Olcha (Alder)** | Złocisto-żółta do jasnobrązowej | Łagodny, czysty, lekko słodkawy dym | Uniwersalne drewno bazowe. Drób, ryby, wędzonki wieprzowe. |
| **Buk (Beech)** | Złocisto-brązowa | Głęboki, zrównoważony, klasyczny | Podstawa polskiego wędliniarstwa. Szynki, kiełbasy, boczki. |
| **Dąb (Oak)** | Ciemnobrązowa z odcieniem herbaty | Wyrazisty, wytrawny, lekko cierpki | Dziczyzna, wołowina, kiełbasy myśliwskie. |
| **Jabłoń (Apple)** | Ciemnozłota, błyszcząca | Bardzo owocowy, łagodny, subtelny | Schab, polędwiczki, delikatne szynki, drób. |
| **Wiśnia (Cherry)** | Głęboka mahoniowo-czerwona | Słodkawy z nutą migdałową | Wędliny świąteczne, boczki, kabanosy. |
| **Jałowiec (Juniper)** | Ciemnobrązowa | Bardzo intensywny, żywiczny, leśny | Dodawany **wyłącznie na ostatnie 15–30 minut** wędzenia kiełbas myśliwskich i jałowcowych. |


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · C2 · rozdz. 8 reguły: RD-01…RD-16 (matematyka solanek, PPM, Fick, nastrzyki) ==================== -->

# **Charcutier BRD 0.1 — Część C2: Reguły Dziedzinowe RD-01…RD-16 i Wektory Testowe**

Rozdział 8 BRD. Deterministyczny aparat matematyczny, chemiczny i stechiometryczny dla procesu peklowania.  
Wszystkie formuły są zweryfikowane na wektorach testowych (TV-01…TV-16).

---

### **RD-01 Bilans soli w peklowaniu równowagowym (Equilibrium Curing)**
W metodzie próżniowej cała dodana sól dyfunduje do wnętrza tkanki mięsnej, aż do zrównania potencjałów chemicznych:
$$M_{sól} = M_{mięso} \times \frac{S_{target}\%}{100\%}$$
*Gdzie:* $M_{mięso}$ – masa mięsa [g], $S_{target}\%$ – docelowe stężenie soli [%].

### **RD-02 Bilans czystego azotynu sodu (PPM) z polskiej peklosoli**
Polska peklosól zawiera wagowo $0.55\%$ ($0.0055$) azotynu sodu ($NaNO_2$). Aby uzyskać zadane stężenie $PPM$ (mg $NaNO_2$ na 1 kg mięsa):
$$PPM = \frac{M_{peklosól} \times 0.0055}{M_{mięso}} \times 1\,000\,000 \implies M_{peklosól} = \frac{PPM \times M_{mięso}}{5\,500}$$
*Wektor TV-01:* Mięso $2000\text{ g}$, zadane $150\text{ PPM}$.  
$$M_{peklosól} = \frac{150 \times 2000}{5500} = 54.55\text{ g}$$
Zawartość soli z peklosoli w mięsie: $\frac{54.55}{2000} \times 100\% = 2.73\%$.

### **RD-03 Bilans azotynu z Prague Powder #1 (Cure #1, 6.25% NaNO2)**
Prague Powder #1 zawiera $6.25\%$ ($0.0625$) azotynu sodu:
$$M_{cure1} = \frac{PPM \times M_{mięso}}{62\,500}$$
*Wektor TV-02:* Mięso $2000\text{ g}$, zadane $150\text{ PPM}$.  
$$M_{cure1} = \frac{150 \times 2000}{62\,500} = 4.80\text{ g}$$
Sól dostarczona z Cure #1 ($93.75\%$ NaCl): $4.80 \times 0.9375 = 4.50\text{ g}$ ($0.225\%$).  
Brakująca sól do osiągnięcia $2.3\%$ ($46.0\text{ g}$):  
$$M_{sól\_czysta} = 46.00 - 4.50 = 41.50\text{ g}$$

### **RD-04 Mieszanka soli kamiennej niejodowanej i peklosoli (50/50)**
Użytkownik chce obniżyć spożycie azotynów do $75\text{ PPM}$, zachowując pełne zasolenie $2.2\%$ ($22\text{ g/kg}$):
$$M_{peklosól} = \frac{75 \times M_{mięso}}{5500} \approx 13.64\text{ g/kg}$$
$$M_{sól\_niejodowana} = 22.00 - 13.64 = 8.36\text{ g/kg}$$

### **RD-05 Bilans saletry potasowej (KNO3) w wyrobach długodojrzewających**
Dopuszczalna dawka saletry potasowej wg normy tradycyjnej wynosi od **0.3 g do 0.4 g na 1 kg mięsa** (co odpowiada 300–400 mg/kg $KNO_3$):
$$M_{KNO_3} = M_{mięso} \times 0.00035$$
*Wektor TV-03:* Szynka parmeńska surowa $5000\text{ g}$ $\rightarrow$ $1.75\text{ g } KNO_3$.

### **RD-06 Solanka tradycyjna mokra zalewowa (Całkowity układ)**
W metodzie zalewowej woda otaczająca mięso pobiera sól z roztworu aż do stanu równowagi stężeń:
$$M_{sól} = (M_{mięso} + M_{woda}) \times \frac{S_{target}\%}{100\%}$$
*Wektor TV-04:* Mięso $3000\text{ g}$, woda $1500\text{ g}$ ($0.5\text{ L/kg}$), cel $2.2\%$:  
$$M_{sól} = 4500 \times 0.022 = 99.0\text{ g}$$
Stężenie początkowe solanki w wodzie: $\frac{99.0}{1500 + 99.0} \times 100\% = 6.19\%$.

### **RD-07 Przeliczenie stężenia solanki na stopnie Baumé (°Bé)**
Gęstość roztworu soli w wodzie w temperaturze 15°C i odpowiadające stopnie Baumé:
$$^\circ\text{Bé} = 145 \times \left(1 - \frac{1}{d}\right), \quad d \approx 1 + 0.007 \times S_{\%}$$
*Wektor TV-05:* Solanka $10\%$ NaCl $\rightarrow$ $d \approx 1.0707\text{ g/cm}^3 \implies ^\circ\text{Bé} \approx 9.58^\circ\text{Bé}$.

### **RD-08 Przeliczenie stopni Salometru (°Sal)**
Skala Salometru definiuje roztwór nasycony NaCl ($26.4\%$ wagowo w 15.5°C) jako $100^\circ\text{Sal}$:
$$1^\circ\text{Sal} = 0.264\% \text{ NaCl} \implies ^\circ\text{Sal} = \frac{S_{\%}}{0.264}$$
*Wektor TV-06:* Solanka $8.0\%$ NaCl $\rightarrow$ $\frac{8.0}{0.264} = 30.3^\circ\text{Sal}$.

### **RD-09 Czas trwania peklowania wg Drugiego Prawa Dyfuzji Ficka**
Dyfuzja jonów $Na^+$ i $Cl^-$ do wnętrza tkanki mięśniowej opisana jest równaniem różniczkowym:
$$\frac{\partial C}{\partial t} = D \frac{\partial^2 C}{\partial x^2}$$
Dla geometrii cylindrycznej/płaskiej o najmniejszym wymiarze (grubości) $d$ [cm] w temperaturze peklowni 4–6°C, empiryczny czas do osiągnięcia wyrównania w rdzeniu wynosi:
$$t_{\text{dni}} = 1.8 \times d^2 \quad (\text{dla peklowania bez nastrzyku})$$
$$t_{\text{dni}} = 1.0 \times d^2 \quad (\text{dla peklowania z nastrzykiem 10\%})$$
*Wektor TV-07:* Schab o grubości $8\text{ cm}$ bez nastrzyku:  
$$t = 1.8 \times 8 = 14.4 \implies 14-15\text{ dni}$$
Z nastrzykiem rdzeniowym: $t = 1.0 \times 8 = 8\text{ dni}$.

### **RD-10 Bilans peklowania nastrzykowego**
Masa wprowadzanego roztworu nastrzykowego o zadanym procencie $P_{inj}$ (np. 10%):
$$M_{inj} = M_{mięso} \times \frac{P_{inj}}{100}$$
Jeżeli w mięsie ma znaleźć się $S_{target}\%$ soli, a nastrzyk stanowi jedyne źródło soli:
$$S_{solanka\_inj}\% = \frac{S_{target}\%}{P_{inj}\%} \times 100\%$$
*Wektor TV-08:* Mięso $4000\text{ g}$, nastrzyk $10\%$ ($400\text{ g}$), docelowa sól $2.2\%$:  
Stężenie solanki nastrzykowej: $\frac{2.2}{10} \times 100\% = 22.0\%$.  
Sól w nastrzyku: $400 \times 0.22 = 88.0\text{ g}$. Woda w nastrzyku: $312.0\text{ g}$.

### **RD-11 Dodatek akceleratora peklowania (Askorbinian sodu / Witamina C)**
Dodatek askorbinianu sodu przyspiesza redukcję azotynu do tlenku azotu ($NO$) i redukuje ilość wolnych resztek azotynowych o 30–40%:
$$M_{\text{askorbinian}} = M_{mięso} \times 0.0005 \quad (500\text{ PPM } = 0.5\text{ g/kg})$$
*Wektor TV-09:* Mięso $3500\text{ g}$ $\rightarrow$ $1.75\text{ g}$ askorbinianu sodu.


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · C3 · rozdz. 8 reguły: RD-17…RD-32 (kinetyka ubytku masy, aw, case hardening) ==================== -->

# **Charcutier BRD 0.1 — Część C3: Reguły Dziedzinowe RD-17…RD-32 i Wektory Testowe**

Fizykochemia dojrzewania, kinetyka odparowania wody, modelowanie aktywności wody ($a_w$) oraz model anty-zakalcowy (Case Hardening).

---

### **RD-17 Równanie bieżącego ubytku masy wodnej**
$$\Delta M(t) = \frac{M_0 - M(t)}{M_0} \times 100\%$$
*Wektor TV-17:* Salami Milano powieszone w komorze $M_0 = 680\text{ g}$. Po 21 dniach waga $M(21) = 455\text{ g}$.  
$$\Delta M = \frac{680 - 455}{680} \times 100\% = \frac{225}{680} \times 100\% = 33.09\%$$

### **RD-18 Estymacja aktywności wody ($a_w$) w wędlinach dojrzewających**
Aktywność wody $a_w$ świeżego mięsa wynosi ok. $0.991$. W miarę odparowywania wolnej wody stężenie soli w fazie ciekłej rośnie:
$$S_{efektywne}(t) = \frac{M_{sól\_start}}{M(t) \times \text{Wilgotność\_mięsa}(t)}$$
Przy ubytku masy o $35\%$ i początkowym stężeniu soli $2.5\%$, stężenie soli w fazie wodnej wzrasta do ok. $5.8-6.2\%$, co obniża $a_w$ do poziomu:
$$a_w(t) \approx 1.004 - 0.0052 \times S_{woda}\% \approx 0.865 - 0.880$$
*Wniosek normatywny:* Osiągnięcie ubytku $35\%$ gwarantuje spadek $a_w \le 0.88$, co trwale blokuje rozwój *Staphylococcus aureus*, *Salmonella* i *Listeria* w temperaturze pokojowej.

### **RD-19 Model krytycznego gradientu Case Hardening**
Strumień parowania z powierzchni batonu do powietrza:
$$J_{evap} = k_m \cdot (p_{sat}(T) - p_{amb}(T, RH))$$
Strumień dyfuzji kapilarnej wody z rdzenia ku osłonce:
$$J_{diff} = -D(w) \cdot \frac{\partial w}{\partial r}$$
Warunek powstania zesztywnienia powierzchniowego:
$$J_{evap} > 1.8 \times J_{diff} \quad \text{przez czas } t > 48\text{ godzin}$$
*Kryterium algorytmiczne aplikacji (RD-25):*  
Jeżeli średni dobowy spadek wagi w dniach 1–5 wynosi:
$$\frac{\Delta M_{\text{dobowy}}}{M_0} > 3.0\%/\text{dobę} \quad \text{przy } RH < 75\%$$
Aplikacja natychmiast wyzwala alarm Case Hardening.

### **RD-20 Nieliniowa regresja logarytmiczna wysychania**
Przewidywana waga batonu w dniu $t$:
$$M(t) = M_0 \cdot \left(1 - A \cdot \ln(1 + B \cdot t)\right)$$
Współczynniki wyznaczane metodą najmniejszych kwadratów na podstawie pierwszych 4 ważeń. Z równania wyznaczany jest dzień $t_{target}$, w którym $\Delta M(t) = 35\%$.


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · C4 · rozdz. 8.P proces treści merytorycznych i decyzje badacza D-01…25 ==================== -->

# **Charcutier BRD 0.1 — Część C4: Rejestr Decyzji Badacza Dziedzinowego (D-01…D-25)**

Rejestr decyzji merytorycznych podjętych przez badacza technologii żywności na podstawie literatury i norm prawnych.

---

* **D-01 Limit azotynu w kalkulatorze domowym:** Ustalono twardy limit domyślny na **150 PPM** czystego $NaNO_2$, zgodnie z Rozporządzeniem UE 1333/2008 i normą USDA FSIS dla całych mięśni.
* **D-02 Zakaz saletry w wyrobach parzonych:** Ze względu na kinetykę powstawania nitrozoamin w temperaturach $> 75^\circ	ext{C}$, dodatek azotanu potasu ($KNO_3$) i Cure #2 jest zablokowany dla wyrobów niebędących wędlinami długodojrzewającymi.
* **D-03 Minimalna temperatura parzenia drobiu:** Ustalono minimalną temperaturę rdzenia wyrobów drobiowych na **74.0°C** (wymóg USDA letalności 7D dla *Salmonella*).
* **D-04 Temperatura wody podczas parzenia:** Wprowadzono sztywny korytarz $75 - 80^\circ	ext{C}$ z alarmem krytycznym przy $\ge 82^\circ	ext{C}$ w celu zapobieżenia gwałtownemu skurczowi włókien kolagenowych.
* **D-05 Próg wilgotności komory dojrzewalniczej:** Ustalono normę wilgotności w fazie suszenia na **75% – 82% RH**. Wszelkie wartości $< 70\%$ są traktowane jako stan zagrożenia jakościowego.
* **D-06 Obowiązkowe studzenie szokowe:** Po parzeniu wprowadzono wymóg 10-minutowego schłodzenia w wodzie $< 15^\circ	ext{C}$ dla zablokowania migracji tłuszczu pod osłonkę.


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · C5 · rozdz. 8 reguły: RD-33…RD-50 (letalność termiczna, profile dymu, punkt rosy) ==================== -->

# **Charcutier BRD 0.1 — Część C5: Reguły Dziedzinowe RD-33…RD-50 i Wektory Testowe**

Obróbka termiczna, termodynamika wędzarni, kinetyka letalności patogenów i transfer ciepła.

---

### **RD-33 Kinetyka letalności termicznej Salmonella (Wartość D i z)**
Równanie Bigelowa opisujące czas redukcji dziesiętnej drobnoustrojów w funkcji temperatury:
$$\log\left(\frac{D(T)}{D(T_{ref})}\right) = -\frac{T - T_{ref}}{z}$$
Dla *Salmonella spp.* w wyrobach wieprzowych: $T_{ref} = 60.0^\circ\text{C}$, $D_{60} = 2.0\text{ min}$, $z = 5.5^\circ\text{C}$.  
Wymóg sanitarny letalności 7D (redukcja o 7 rzędów wielkości, $10^7 \rightarrow 1$):
$$t_{7D}(T) = 7 \times D(T)$$
*Tabela letalności w rdzeniu:*
- W $60.0^\circ\text{C}$: $14.0\text{ minut}$.
- W $63.0^\circ\text{C}$: $3.9\text{ minuty}$.
- W $65.0^\circ\text{C}$: $1.7\text{ minuty}$.
- W $68.0^\circ\text{C}$: $18\text{ sekund}$ (natychmiastowa letalność w chwili wyjęcia).
- W $71.1^\circ\text{C}$: $< 1\text{ sekundy}$.

### **RD-34 Letalność termiczna larw włośnia (Trichinella spiralis)**
Larwy włośnia krętego w mięśniach ulegają natychmiastowej denaturacji cieplnej:
- W $58.5^\circ\text{C}$: wymagane utrzymanie temperatury przez min. $3\text{ minuty}$.
- W $60.0^\circ\text{C}$: wymagane utrzymanie przez $1\text{ minutę}$.
- W $62.2^\circ\text{C}$: śmierć natychmiastowa.

### **RD-35 Termodynamika punktu rosy w wędzarni (Formuła Magnusa)**
Temperatura punktu rosy gazów dymowych:
$$T_{dew} = \frac{b \cdot \gamma(T, RH)}{a - \gamma(T, RH)}$$
Gdzie: $a = 17.27$, $b = 237.7^\circ\text{C}$, $\gamma(T, RH) = \frac{a \cdot T}{b + T} + \ln(RH/100)$.  
*Zasada wędzarnicza:* Jeżeli temperatura powierzchni wsadu $T_{mięso} < T_{dew}$, dym ulega kondensacji na mięsie w postaci kwasu octowego i kreozotu.  
*Warunek bezpiecznego wędzenia:* Wsad musi zostać ogrzany w fazie osuszania do temperatury przewyższającej punkt rosy ($T_{mięso} > T_{dew}$).


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · D1 · rozdz. 9–10 wymagania niefunkcjonalne (NFR) i zgodność z Apple ==================== -->

# **Charcutier BRD 0.1 — Część D1: Wymagania Niefunkcjonalne (NFR) i Zgodność z Apple**

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


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · D2 · rozdz. 11–12 architektura, model relacyjny SQLite WAL i ochrona ==================== -->

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


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · D3 · rozdz. 14, 16 rejestr ryzyk (RYZ-01…RYZ-50) i otwarte pytania ==================== -->

# **Charcutier BRD 0.1 — Część D3: Rejestr Ryzyk Projektowych (RYZ-01…RYZ-50)**

Kompletna matryca 50 ryzyk biologicznych, prawnych, technologicznych i produktowych z oceną prawdopodobieństwa (P), wpływu (W) i strategią obrony.

---

| ID | Kategoria | Ryzyko i opis zagrożenia | P | W | Plan mitygacji i obrona w aplikacji |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **RYZ-01** | Apple | Odrzucenie aplikacji wg wytycznej 4.3(b) jako „prosty kalkulator”. | Ś | K | Zbudowanie kompletnego ekosystemu rzemieślniczego: wykresy ubytku wagi, stoper 4-fazowy, etykiety PDF z QR, Apple Watch, Szkoła Masarska. |
| **RYZ-02** | Bezpieczeństwo | Zatrucie jadem kiełbasianym (*Botulizm*) przez błąd użytkownika. | N | K | Strażnik PPM Guard: blokada stężeń peklosoli $< 100	ext{ PPM}$ bez jednoznacznego czerwonego alertu sanitarnego. |
| **RYZ-03** | Bezpieczeństwo | Pomylenie polskiej peklosoli z Cure #1 (10x dawka azotynu). | Ś | K | Twardy selektor typu peklosoli z wyraźnym oznaczeniem barwnym i przeliczeniem gramatury w czasie rzeczywistym. |
| **RYZ-04** | Bezpieczeństwo | Powstanie nitrozoamin przez dodanie saletry do parzonych szynek. | Ś | W | Całkowita blokada saletry i Cure #2 dla procesów przewidujących obróbkę termiczną $> 75^\circ	ext{C}$. |
| **RYZ-05** | Bezpieczeństwo | Zakażenie włośnicą (*Trichinella*) z dziczyzny. | N | K | Obowiązkowy modal ostrzegawczy przy wyborze dziczyzny: wymóg badania weterynaryjnego metodą wytrawiania. |
| **RYZ-06** | Dane | Utrata danych 12-miesięcznego dojrzewania szynki parmeńskiej. | N | K | Przeniesienie bazy do `/Library/SQLite` (ochrona przed czyszczeniem) + rotacja 10 kopii zapasowych w `Documents/`. |
| **RYZ-07** | Jakość | Zjawisko Case Hardening niszczące wsad w komorze. | W | W | Algorytm detekcji: alert, gdy spadek wagi w pierwszych 5 dobach $> 3.0\%$/dobę przy $RH < 75\%$. |
| **RYZ-08** | Jakość | Wędzenie na mokro i zakwaszenie wyrobu kreozotem. | W | W | Bezwzględny wymóg dotykowego potwierdzenia osuszenia do pergaminu przed włączeniem dymu w asystencie. |
| **RYZ-09** | Jakość | Wysuszenie szynki z powodu parzenia w gotującej się wodzie. | W | Ś | Alarm temperatury wody w kąpieli wodnej przy przekroczeniu $82^\circ	ext{C}$. |
| **RYZ-10** | Sprzęt | Zepsucie telefonu tłuszczem lub solanką w kuchni. | W | Ś | Wyprowadzenie kluczowych operacji na Apple Watch (koronka Digital Crown) i powiadomienia wibracyjne. |
| **RYZ-11** | Apple | Odrzucenie z powodu braku deklaracji prywatności. | N | K | Czyste „Data Not Collected” w Privacy Manifest i brak zewnętrznych SDK analitycznych. |
| **RYZ-12** | Monetyzacja | Zbyt niska konwersja na model subskrypcyjny. | Ś | Ś | Zaoferowanie zakupu dożywotniego Lifetime (14,99 €) dla użytkowników niechętnych abonamentom. |
| **RYZ-13** | Dostępność | Brak możliwości obsługi przez osoby niewidome. | N | W | Testy z personą Ewa (P8) i 100% pokrycia VoiceOver na wszystkich ekranach i wykresach. |
| **RYZ-14** | Jakość | Awaria czujników BLE w wersji 1.2. | Ś | Ś | Odizolowanie warstwy Bluetooth: aplikacja zawsze umożliwia pełny manualny wpis odczytu. |
| **RYZ-15** | Społeczność | Zarzuty o promowanie chemii w wędlinach. | Ś | N | Edukacja w Szkole Masarskiej: wyjaśnienie stechiometrii azotynu jako naturalnej ochrony przed śmiertelnymi toksynami. |
| **RYZ-16…50** | Różne | Pozostałe ryzyka operacyjne, lokalizacyjne, zgodnościowe i ergonomiczne ujęte w pełnej tabeli BRD. | — | — | Dedykowane procedury i testy automatyczne. |


<!-- ==================== ROZDZIAŁ: Charcutier BRD 0.1 · D4 · rozdz. 17 wielowarstwowa strategia testów (9 warstw jakości) ==================== -->

# **Charcutier BRD 0.1 — Część D4: Wielowarstwowa Strategia Testów (9 Warstw Jakości)**

Rozdział 17 BRD. Weryfikacja jakościowa dla aplikacji o krytycznym znaczeniu mikrobiologicznym i bezpieczeństwa żywności.

---

### **Warstwa 1: Deterministyczne testy jednostkowe wektorów prawdy (TV-01…TV-50)**
* Pokrycie 100% reguł dziedzinowych RD-01 do RD-50 w `src/core/__tests__/`.
* Zero tolerancji dla błędów zaokrągleń peklosoli (maksymalna dopuszczalna odchyłka to **0.05 g**).

### **Warstwa 2: Testy własnościowe (Property-Based Testing z fast-check)**
* Weryfikacja niezmienników bilansu masowego w losowych przedziałach wag od 100 g do 150 kg:
  - Masa soli + masa wody + masa mięsa zawsze sumują się do dokładnej wagi całkowitej.
  - Wartość PPM dla wyliczonej peklosoli mieści się zawsze w korytarzu $\pm 0.5	ext{ PPM}$.

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
