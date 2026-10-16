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
