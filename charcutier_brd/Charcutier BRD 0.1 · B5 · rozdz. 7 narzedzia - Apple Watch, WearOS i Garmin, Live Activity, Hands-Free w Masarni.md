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
