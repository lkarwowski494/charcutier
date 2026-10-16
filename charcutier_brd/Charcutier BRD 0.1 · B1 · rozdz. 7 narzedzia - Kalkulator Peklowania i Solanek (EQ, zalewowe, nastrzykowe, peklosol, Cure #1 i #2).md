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
