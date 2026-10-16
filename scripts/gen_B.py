# -*- coding: utf-8 -*-
"""
Generator for Charcutier BRD 0.1 - Part B (Tools Requirements, Chapters B1..B6)
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\excited-noether\charcutier_brd"
os.makedirs(OUT_DIR, exist_ok=True)

fB1 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · B1 · rozdz. 7 narzedzia - Kalkulator Peklowania i Solanek (EQ, zalewowe, nastrzykowe, peklosol, Cure #1 i #2).md")
with open(fB1, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część B1: Narzędzia — Kalkulator Peklowania i Solanek**

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
  1. Wprowadzanie objętości wody (litry) lub automatyczny dobór z reguły masarskiej: $V_{woda} = 0.4 \times M_{mięso}$.
  2. Wyliczenie masy soli dla całkowitej masy układu: $M_{układ} = M_{mięso} + M_{woda}$.
  3. Prezentacja stężenia solanki w procentach masowych, stopniach Baumé (°Bé) oraz stopniach Salometru.
* **Priorytet / Etap:** MUST · MVP.

### **BR-PEKL-009 Kalkulator peklowania nastrzykowego**
* **Opis:** Obliczanie stężenia i objętości solanki do nastrzykiwania szynek z kością i grubych mięśni.
* **Kryteria akceptacji:**
  1. Wprowadzanie docelowego procentu nastrzyku (zakres 6% do 15%, domyślnie 10% masy wsadu).
  2. Wyliczenie dokładnej wagi solanki do wprowadzenia strzykawką: $M_{nastrzyk} = M_{mięso} \times P_{nastrzyk}$.
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
""")

# B2: Tracker Wagi
fB2 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · B2 · rozdz. 7 narzedzia - Tracker Utraty Wagi i Komora Dojrzewalnicza (Weight Loss Tracker, aw, kinetyka suszenia).md")
with open(fB2, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część B2: Narzędzia — Tracker Utraty Wagi i Komora Dojrzewalnicza**

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
     $$\Delta M = M_0 - M_t, \quad \Delta M\% = \frac{M_0 - M_t}{M_0} \times 100\%$$
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
""")

# B3: Wędzenie
fB3 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · B3 · rozdz. 7 narzedzia - Asystent Wedzenia i Obrobki Termicznej (profile osuszania, dymu, parzenia i sondy).md")
with open(fB3, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część B3: Narzędzia — Asystent Wędzenia i Obróbki Termicznej**

Wymagania funkcjonalne asystenta wędzarniczego i obróbki cieplnej (`BR-WEDZ-001` … `BR-WEDZ-035`).  
Główny cel: Wymuszenie technologicznego reżimu 4 faz (Osuszanie $\rightarrow$ Wędzenie $\rightarrow$ Parzenie/Pieczenie $\rightarrow$ Studzenie), eliminacja wędzenia na mokro oraz precyzyjne alarmy temperatur rdzenia.

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
  1. Stoper studzenia: **10 – 15 minut** w bieżącej wodzie o temperaturze $< 15^\circ\text{C}$.
  2. Cel technologiczny: Zatrzymanie dalszej denaturacji białek pod wpływem ciepła zakumulowanego w rdzeniu, zapobieganie pomarszczeniu osłonek jelitowych oraz szybkie przejście przez strefę namnażania bakterii (20–50°C).
* **Priorytet / Etap:** SHOULD · MVP.
""")

# B4: Spiżarnia
fB4 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · B4 · rozdz. 7 narzedzia - Spizarnia Miesna, Inwentarz Surowcow, Jelita, Oslonki i Etykiety QR PDF.md")
with open(fB4, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część B4: Narzędzia — Spiżarnia Mięsna, Jelita i Etykiety QR**

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
  1. Wzór geometryczny: na podstawie kalibru $D$ w mm i gęstości farszu $\rho \approx 1.05\text{ g/cm}^3$, system wylicza pojemność 1 metra bieżącego jelita (np. jelito wieprzowe 28/30 mieści ok. 0.55 kg farszu na 1 m; na 10 kg farszu potrzeba ok. 18 metrów).
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
""")

# B5: Zegarki
fB5 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · B5 · rozdz. 7 narzedzia - Apple Watch, WearOS i Garmin, Live Activity, Hands-Free w Masarni.md")
with open(fB5, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część B5: Narzędzia — Smartwatche i Scenariusze Hands-Free**

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
""")

# B6: Receptury i Dostępność
fB6 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · B6 · rozdz. 7 narzedzia - Baza Receptur, Kalkulator Kosztu Wyrobu, Eksport CSV, Kopia i Dostepnosc.md")
with open(fB6, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część B6: Narzędzia — Receptury, Kosztorys, Kopia i Dostępność**

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
     $$\text{Koszt}_{\text{1 kg gotowego}} = \frac{\sum \text{Koszty wsadu}}{M_{\text{gotowa (po 35% ubytku)}}}$$
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
""")

print("Part B written successfully.")
