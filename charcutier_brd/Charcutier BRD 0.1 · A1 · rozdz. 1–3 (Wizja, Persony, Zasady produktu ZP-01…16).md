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
