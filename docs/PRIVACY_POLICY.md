# Polityka Prywatności — CHARCUTIER (Spiżarnia Masarza)
**Data wejścia w życie:** 16 października 2026 r.  
**Wydawca:** Apps4Brew Studio · Łukasz Karwowski (`lkarwowski494`)  
**Kontakt:** support@apps4brew.com  

---

### 1. Złota Zasada Ekosystemu Apps4Brew: 100% Offline-First
Aplikacja **CHARCUTIER** została zaprojektowana od podstaw w architekturze **100% Offline-First**. Oznacza to, że:
- Wszystkie Twoje dane, receptury masarskie, notatki degustacyjne, zapasy jelit i przypraw w spiżarni oraz historia partii i ważeń są przechowywane **wyłącznie lokalnie na Twoim urządzeniu** w bezpiecznej bazie danych SQLite.
- Aplikacja **nie posiada zewnętrznych serwerów bazy danych**, nie wymaga rejestracji, tworzenia konta, adresu e-mail ani hasła.
- Aplikacja działa w pełni sprawnie w trybie samolotowym, w masarni, wędzarni czy w piwnicy bez zasięgu sieci komórkowej i Wi-Fi.

---

### 2. Etykieta Prywatności Apple (Privacy Nutrition Label: Data Not Collected)
Zgodnie z wytycznymi Apple App Store:
- **Dane zbierane przez aplikację:** `Brak (Data Not Collected)`
- **Dane śledzące użytkownika (Tracking):** `Brak (No Tracking)`
- **Zewnętrzne biblioteki telemetryczne / analityczne:** Aplikacja **nie zawiera żadnych trackerów**, takich jak Google Analytics, Firebase Analytics, Meta SDK, Adjust, AppsFlyer ani żadnych innych sieci reklamowych.

---

### 3. Uprawnienia Systemowe i Ich Przeznaczenie
Aplikacja prosi wyłącznie o minimalne uprawnienia niezbędne do realizacji funkcji rzemieślniczych:
1. **Aparat fotograficzny (`NSCameraUsageDescription`):**
   - *Cel:* Skanowanie kodów QR na wydrukowanych etykietach partii w spiżarni lub import receptur (`charcutier://recipe?...`).
   - *Bezpieczeństwo:* Obraz z kamery jest przetwarzany wyłącznie w pamięci podręcznej urządzenia w czasie rzeczywistym i nigdy nie jest zapisywany ani przesyłany przez sieć.
2. **Powiadomienia lokalne (`expo-notifications`):**
   - *Cel:* Przypomnienia o zmianie etapów peklowania, alarmach Case Hardening oraz osiągnięciu temperatury rdzenia podczas wędzenia.
   - *Bezpieczeństwo:* Wszystkie powiadomienia są planowane lokalnie przez system iOS/Android bez udziału serwerów zewnętrznych.
3. **Dźwięk i zapobieganie wygaszaniu ekranu (`UIBackgroundModes: audio`, `KeepAwake`):**
   - *Cel:* Odtwarzanie głośnego dzwonka po zakończeniu fazy wędzenia oraz utrzymanie czytelności ekranu na blacie masarskim.

---

### 4. Zakupy w Aplikacji (In-App Purchases)
Obsługa płatności subskrypcyjnych i zakupu licencji wieczystej (Lifetime) odbywa się w 100% za pośrednictwem natywnych mechanizmów **Apple In-App Purchase (StoreKit)** oraz **Google Play Billing**. Wydawca aplikacji nie ma dostępu do Twoich danych karty płatniczej, numerów kont ani danych rozliczeniowych.

---

### 5. Bezpieczeństwo i Kopia Zapasowa (Zero Data Loss)
Użytkownik ma pełną kontrolę nad swoimi danymi:
- W każdej chwili możesz wygenerować kopię zapasową w formacie JSON i zapisać ją w bezpiecznym miejscu (pliki systemowe, dysk iCloud, pamięć lokalna).
- Aplikacja automatycznie utrzymuje do 10 rotacyjnych kopii zapasowych w katalogu aplikacji.
- Usunięcie aplikacji z urządzenia skutkuje usunięciem lokalnej bazy SQLite, chyba że użytkownik wcześniej wyeksportował kopię zapasową JSON.

---

### 6. Zmiany w Polityce Prywatności
Wszelkie aktualizacje niniejszej polityki będą publikowane w repozytorium projektu oraz w dokumentacji kolejnych wersji aplikacji w App Store i Google Play.

W razie pytań prosimy o kontakt: **support@apps4brew.com**.
