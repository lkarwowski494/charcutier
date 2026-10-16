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
