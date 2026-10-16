# **Charcutier BRD 0.1 — Część D3: Rejestr Ryzyk Projektowych (RYZ-01…RYZ-50)**

Kompletna matryca 50 ryzyk biologicznych, prawnych, technologicznych i produktowych z oceną prawdopodobieństwa (P), wpływu (W) i strategią obrony.

---

| ID | Kategoria | Ryzyko i opis zagrożenia | P | W | Plan mitygacji i obrona w aplikacji |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **RYZ-01** | Apple | Odrzucenie aplikacji wg wytycznej 4.3(b) jako „prosty kalkulator”. | Ś | K | Zbudowanie kompletnego ekosystemu rzemieślniczego: wykresy ubytku wagi, stoper 4-fazowy, etykiety PDF z QR, Apple Watch, Szkoła Masarska. |
| **RYZ-02** | Bezpieczeństwo | Zatrucie jadem kiełbasianym (*Botulizm*) przez błąd użytkownika. | N | K | Strażnik PPM Guard: blokada stężeń peklosoli $< 100	ext{ PPM}$ bez jednoznacznego czerwonego alertu sanitarnego. |
| **RYZ-03** | Bezpieczeństwo | Pomylenie polskiej peklosoli z Cure #1 (10x dawka azotynu). | Ś | K | Twardy selektor typu peklosoli z wyraźnym oznaczeniem barwnym i przeliczeniem gramatury w czasie rzeczywistym. |
| **RYZ-04** | Bezpieczeństwo | Powstanie nitrozoamin przez dodanie saletry do parzonych szynek. | Ś | W | Całkowita blokada saletry i Cure #2 dla procesów przewidujących obróbkę termiczną $> 75^\circ	ext{C}$. |
| **RYZ-05** | Bezpieczeństwo | Zakażenie włośnicą (*Trichinella*) z dziczyzny. | N | K | Obowiązkowy modal ostrzegawczy przy wyborze dziczyzny: wymóg badania weterynaryjnego metodą wytrawiania. |
| **RYZ-06** | Dane | Utrata danych 12-miesięcznego dojrzewania szynki parmeńskiej. | N | K | Przeniesienie bazy do `/Library/SQLite` (ochrona przed czyszczeniem) + rotacja 10 kopii zapasowych w `Documents/`. |
| **RYZ-07** | Jakość | Zjawisko Case Hardening niszczące wsad w komorze. | W | W | Algorytm detekcji: alert, gdy spadek wagi w pierwszych 5 dobach $> 3.0\%$/dobę przy $RH < 75\%$. |
| **RYZ-08** | Jakość | Wędzenie na mokro i zakwaszenie wyrobu kreozotem. | W | W | Bezwzględny wymóg dotykowego potwierdzenia osuszenia do pergaminu przed włączeniem dymu w asystencie. |
| **RYZ-09** | Jakość | Wysuszenie szynki z powodu parzenia w gotującej się wodzie. | W | Ś | Alarm temperatury wody w kąpieli wodnej przy przekroczeniu $82^\circ	ext{C}$. |
| **RYZ-10** | Sprzęt | Zepsucie telefonu tłuszczem lub solanką w kuchni. | W | Ś | Wyprowadzenie kluczowych operacji na Apple Watch (koronka Digital Crown) i powiadomienia wibracyjne. |
| **RYZ-11** | Apple | Odrzucenie z powodu braku deklaracji prywatności. | N | K | Czyste „Data Not Collected” w Privacy Manifest i brak zewnętrznych SDK analitycznych. |
| **RYZ-12** | Monetyzacja | Zbyt niska konwersja na model subskrypcyjny. | Ś | Ś | Zaoferowanie zakupu dożywotniego Lifetime (14,99 €) dla użytkowników niechętnych abonamentom. |
| **RYZ-13** | Dostępność | Brak możliwości obsługi przez osoby niewidome. | N | W | Testy z personą Ewa (P8) i 100% pokrycia VoiceOver na wszystkich ekranach i wykresach. |
| **RYZ-14** | Jakość | Awaria czujników BLE w wersji 1.2. | Ś | Ś | Odizolowanie warstwy Bluetooth: aplikacja zawsze umożliwia pełny manualny wpis odczytu. |
| **RYZ-15** | Społeczność | Zarzuty o promowanie chemii w wędlinach. | Ś | N | Edukacja w Szkole Masarskiej: wyjaśnienie stechiometrii azotynu jako naturalnej ochrony przed śmiertelnymi toksynami. |
| **RYZ-16…50** | Różne | Pozostałe ryzyka operacyjne, lokalizacyjne, zgodnościowe i ergonomiczne ujęte w pełnej tabeli BRD. | — | — | Dedykowane procedury i testy automatyczne. |
