# **Charcutier BRD 0.1 — Część B3: Narzędzia — Asystent Wędzenia i Obróbki Termicznej**

Wymagania funkcjonalne asystenta wędzarniczego i obróbki cieplnej (`BR-WEDZ-001` … `BR-WEDZ-035`).  
Główny cel: Wymuszenie technologicznego reżimu 4 faz (Osuszanie $ightarrow$ Wędzenie $ightarrow$ Parzenie/Pieczenie $ightarrow$ Studzenie), eliminacja wędzenia na mokro oraz precyzyjne alarmy temperatur rdzenia.

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
