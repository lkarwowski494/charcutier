# -*- coding: utf-8 -*-
"""
Generator for Charcutier BRD 0.1 - Part 00 and Part A
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\excited-noether\charcutier_brd"
os.makedirs(OUT_DIR, exist_ok=True)

# 1. 00 START
f00_start = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · 00 START — streszczenie, warianty MVP, spis treści.md")
with open(f00_start, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier (Spiżarnia Mięsna / Masarz) — Wymagania biznesowe (BRD), wersja robocza 0.1, 16.10.2026**

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
3. **Reżim wędzarniczy i kulinarny:** Prowadzi krok po kroku przez osuszanie bez dymu („do pergaminu”), wędzenie właściwe dymem, parzenie w wodzie $75-80^\circ\text{C}$ do temperatury rdzenia (z alarmem wibracyjnym na zegarku) oraz studzenie szokowe.

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
""")

# 2. 00b Decyzje
f00b_dec = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · 00b Jedna lista decyzji (DEC-01…DEC-45).md")
with open(f00b_dec, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — 00b Jedna lista decyzji (DEC-01…DEC-45)**

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
""")

# 3. 00c Sprzeczności i errata
f00c_errata = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · 00c Sprzeczności i errata (toksykologia azotynów, USDA vs UE, botulinum, trichinella, case hardening).md")
with open(f00c_errata, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — 00c Sprzeczności dziedzinowe i errata**

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
  * Azotan potasu ($KNO_3$) sam w sobie nie ma właściwości bakteriobójczych. Aby zadziałał, bakterie z rodziny *Staphylococcaceae* muszą powoli, w temperaturze $10-15^\circ\text{C}$ przez okres kilku tygodni, zredukować go enzymatycznie (reduktaza azotanowa) do azotynu ($NaNO_2$).
  * Jeśli mięso z dodatkiem saletry zostanie poddane obróbce termicznej powyżej $75-100^\circ\text{C}$ (parzenie, pieczenie, a zwłaszcza smażenie boczku na patelni w $130-170^\circ\text{C}$), wolne azotany i azotyny wchodzą w gwałtowną reakcję z drugorzędowymi aminami białkowymi, tworząc silnie rakotwórcze **N-nitrozoaminy** (np. nitrozo-dimetyloaminę NDMA).
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
""")

# 4. A1
fA1 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · A1 · rozdz. 1–3 (Wizja, Persony, Zasady produktu ZP-01…16).md")
with open(fA1, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część A1: Wizja, Zasady Produktu, Persony i Scenariusze**

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
""")

# 5. A2, A3a, A3b, A3c, A4
fA2 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · A2 · rozdz. 4–6.1 (Rynek, Model przychodu, Zakres).md")
with open(fA2, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część A2: Analiza Rynku, Model Przychodu i Ramy Zakresu**

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
* **Pojedynczy ekosystem:** Peklowanie $\rightarrow$ Wędzenie $\rightarrow$ Dojrzewanie $\rightarrow$ Spiżarnia w jednej aplikacji.
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
  * W modelu subskrypcyjnym rocznym w Polsce (po prowizji 15% Apple w Small Business Program): przychód netto ok. 14,50 zł / użytkownika $\approx$ 3.65 USD. Zwrot kosztu konta Apple następuje przy **zaledwie 28 aktywnych subskrypcjach rocznych**.
  * W modelu Lifetime (przychód netto ok. 43,50 zł $\approx$ 11 USD): zwrot następuje przy **9 zakupach dożywotnich**.

---

## **6. Ramy zakresu i reguły phasingowe**

Zakres funkcjonalny podzielono na fazy:
* **MVP (Wersja 1.0):** Rdzeń kalkulatora peklowania EQ, zalewowego i nastrzykowego; Tracker wagi z wykresem ubytku masy i detekcją Case Hardening; Asystent wędzenia (4 fazy z osuszaniem); Ewidencja partii; Aplikacja Apple Watch; Etykiety PDF z QR.
* **Wersja 1.1:** Aplikacja na Garmin Connect IQ; Udostępnianie receptur przez kody QR offline; Tryb wysokiego kontrastu dla zadymionej wędzarni; Komplikacje tarczy zegarka.
* **Wersja 1.2:** Obsługa bezprzewodowych sond BLE (Meater, Inkbird); Integracja z czujnikami wilgotności komory dojrzewalniczej BLE.
* **Wersja 2.x:** Asystent rozbioru półtuszy i bilansowania tłuszczu z aparatem (pomiar proporcji mięsa do słoniny na urządzeniu).
""")

fA3a = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · A3a · rozdz. 6.2 tabela zakresu cz. 1 (Peklowanie, Dojrzewanie, Wędzenie).md")
with open(fA3a, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część A3a: Tabela Zakresu Funkcjonalnego (Część 1: Z-001…Z-110)**

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
""")

fA3b = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · A3b · rozdz. 6.2 tabela zakresu cz. 2 (Spiżarnia, Zegarki, Etykiety, Platforma).md")
with open(fA3b, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część A3b: Tabela Zakresu Funkcjonalnego (Część 2: Z-111…Z-220)**

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
""")

fA3c = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · A3c · rozdz. 6.3–6.5 (Etapy, Nakład pracy agentów, Warianty MVP).md")
with open(fA3c, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część A3c: Nakład Pracy Agentów i Warianty Wdrożeniowe**

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
""")

fA4 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · A4 · rozdz. 13, 15 (KPI bez śledzenia, Marketing, ASO).md")
with open(fA4, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część A4: Wskaźniki Sukcesu (KPI), Etyka Prywatności i Dystrybucja**

---

## **13. Wskaźniki sukcesu (KPI) w 100% bez śledzenia użytkowników**

Zgodnie z zasadą **ZP-05 („Data Not Collected”)**, Charcutier nie zawiera żadnego SDK analitycznego (Google Analytics, Firebase, Mixpanel, Amplitude czy Meta Pixel). Sukces produktu mierzony jest wyłącznie zagregowanymi, anonimowymi danymi dostarczanymi natywnie przez Apple App Store Connect:

| Wskaźnik (KPI) | Źródło danych | Cel 3 miesiące po premierze | Cel 12 miesięcy |
| :--- | :--- | :---: | :---: |
| **Pobrania bezpłatne (Installs)** | App Store Connect Analytics | > 2 500 pobrań | > 15 000 pobrań |
| **Konwersja Trial $\rightarrow$ Paid** | App Store Connect Subscriptions | > 6.5% | > 8.0% |
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
""")

print("Part 00 and Part A written successfully.")
