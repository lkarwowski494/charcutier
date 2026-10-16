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
  1. Wzór geometryczny: na podstawie kalibru $D$ w mm i gęstości farszu $ho pprox 1.05	ext{ g/cm}^3$, system wylicza pojemność 1 metra bieżącego jelita (np. jelito wieprzowe 28/30 mieści ok. 0.55 kg farszu na 1 m; na 10 kg farszu potrzeba ok. 18 metrów).
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
