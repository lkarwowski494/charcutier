# **Charcutier BRD 0.1 — Część A3b: Tabela Zakresu Funkcjonalnego (Część 2: Z-111…Z-220)**

Poniższa tabela definiuje zakres modułów Spiżarni, Zegarków, Wydruku i Platformy.

| ID | Moduł | Funkcjonalność | Priorytet | Etap | Uzasadnienie |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Z-111** | Spiżarnia | Ewidencja elementów mięsnych (schab, szynka, karkówka, boczek, słonina, dziczyzna, drób) | MUST | MVP | Magazyn surowców do partii. |
| **Z-112** | Spiżarnia | Ewidencja jelit i osłonek (kaliber, typ: baranie, wieprzowe, wołowe, kolagen, białkowe) | MUST | MVP | Dobór osłonki do średnicy batonu. |
| **Z-113** | Spiżarnia | Przelicznik zapotrzebowania na jelita (metry bieżące na kg farszu) | SHOULD | MVP | Koniec z niespodziewanym brakiem osłonek podczas nadziewania. |
| **Z-114** | Spiżarnia | Automatyczny odpis mięsa i jelit po utworzeniu partii | SHOULD | MVP | Aktualny stan spiżarni. |
| **Z-120** | Etykiety | Generator wektorowy PDF arkuszy etykiet partii (A4) | MUST | MVP | Identyfikacja wiszących wędlin w komorze. |
| **Z-121** | Etykiety | Kod QR na etykiecie partii ze skrótem ID i metryką | MUST | MVP | Błyskawiczne odnalezienie partii aparatem. |
| **Z-122** | Etykiety | Wbudowany skaner kodów QR aparatem w 100% offline | MUST | MVP | Skanujesz etykietę wiszącej szynki -> otwiera się ekran ważenia. |
| **Z-130** | Zegarki | Aplikacja na Apple Watch z dużymi kafelkami akcji | MUST | MVP | Obsługa brudnymi rękami w masarni (ZP-02). |
| **Z-131** | Zegarki | Wprowadzanie wagi batonu koronką Digital Crown | MUST | MVP | 1-klik = 1 g / 5 g, precyzja bez brudzenia ekranu. |
| **Z-132** | Zegarki | Wibracja haptyczna Taptic Engine dla alertów temperatur | MUST | MVP | Czujesz na nadgarstku, że szynka osiągnęła 68°C. |
| **Z-133** | Zegarki | Live Activity na ekranie blokady i Dynamic Island iPhone'a | MUST | MVP | Podgląd fazy wędzenia i czasu do końca. |
| **Z-134** | Zegarki | Aplikacja na zegarki Garmin Connect IQ | SHOULD | 1.1 | Dla myśliwych i wędliniarzy z zegarkami Fēnix/Forerunner. |
| **Z-135** | Zegarki | Komplikacje tarczy zegarka (liczba aktywnych partii) | COULD | 1.1 | Szybki rzut oka na stan dojrzenia. |
| **Z-140** | Receptury | Baza 12 certyfikowanych receptur wzorcowych Apps4Brew | MUST | MVP | Sprawdzone przepisy na start (Krakowska, Salami, Szynka, Pancetta). |
| **Z-141** | Receptury | Kreator własnych receptur ze skalowaniem wagi wsadu | MUST | MVP | Skalowanie przypraw z 2 kg na 15.5 kg jednym ruchem. |
| **Z-142** | Receptury | Wymiana receptur kodem QR SVG i deep linkiem `charcutier://` | SHOULD | 1.1 | Wymiana receptury między masarzami bez internetu. |
| **Z-150** | Finanse | Kalkulator kosztu 1 kg gotowego wyrobu (z uwzględnieniem kurczu) | SHOULD | MVP | Świadomość rzeczywistego kosztu domowego rzemiosła. |
| **Z-160** | Baza | Relacyjna baza SQLite w trybie WAL w `/Library/SQLite` | MUST | MVP | Bezpieczeństwo danych i transakcyjność ACID. |
| **Z-161** | Baza | Automatyczna rotacja 10 kopii zapasowych bazy | MUST | MVP | Ochrona przed utratą danych (ZP-06). |
| **Z-162** | Baza | Pełny eksport historii i magazynu do pliku CSV | MUST | MVP | Bezpłatna przenośność danych (ZP-07). |
| **Z-170** | Monetyzacja | Obsługa subskrypcji i zakupu Lifetime przez StoreKit 2 | MUST | MVP | Model Apps4Brew ($0.99 / $4.99 / $14.99). |
| **Z-171** | Monetyzacja | Pełny 14-dniowy bezpłatny okres próbny | MUST | MVP | Zapoznanie się ze wszystkimi funkcjami Pro. |
| **Z-172** | Monetyzacja | Blokada tworzenia nowych partii po trialu z historią Read-Only | MUST | MVP | Uczciwe traktowanie użytkownika. |
| **Z-180** | Dostępność | Pełne etykiety VoiceOver i obsługa czytnika ekranu | MUST | MVP | Dostępność dla niewidomych masarzy (P8). |
| **Z-181** | Dostępność | Skalowanie Dynamic Type do największych rozmiarów systemu | MUST | MVP | Czytelność dla seniorów (P4). |
