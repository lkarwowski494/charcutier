# **Charcutier BRD 0.1 — Część A3a: Tabela Zakresu Funkcjonalnego (Część 1: Z-001…Z-110)**

Poniższa tabela definiuje zakres funkcjonalny modułów Peklowania, Dojrzewania i Wędzenia.

| ID | Moduł | Funkcjonalność | Priorytet | Etap | Uzasadnienie |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Z-001** | Peklowanie | Kalkulator peklowania równowagowego (EQ) dla całych mięśni | MUST | MVP | Podstawa nowoczesnego wędliniarstwa bez ryzyka przesolenia. |
| **Z-002** | Peklowanie | Kalkulator solanki tradycyjnej mokrej (zalewowej) | MUST | MVP | Konieczność dla tradycyjnych wędzonek Janusza (P1). |
| **Z-003** | Peklowanie | Kalkulator nastrzyków (procent nastrzyku i gęstość solanki) | MUST | MVP | Kluczowe przy szynkach z kością (zapobieganie bone sour). |
| **Z-004** | Peklowanie | Automatyczny przelicznik PPM azotynu ($NaNO_2$) | MUST | MVP | Bezpieczeństwo biologiczne (ZP-01). |
| **Z-005** | Peklowanie | Wybór rodzaju peklosoli (Polska 0.5% vs Prague Powder #1 6.25%) | MUST | MVP | Eliminacja śmiertelnych pomyłek (00c). |
| **Z-006** | Peklowanie | Blokada użycia Cure #2 / Saletry w wyrobach obrabianych termicznie | MUST | MVP | Ochrona przed rakotwórczymi nitrozoaminami. |
| **Z-007** | Peklowanie | Kalkulator ziół i przypraw w gramach na kg wsadu | MUST | MVP | Powtarzalność receptur rzemieślniczych. |
| **Z-008** | Peklowanie | Asystent czasu peklowania wg dyfuzji Ficka (grubość mięśnia) | SHOULD | MVP | Zapobieganie wyjmowaniu niedopeklowanego mięsa. |
| **Z-009** | Peklowanie | Obsługa szynkowarów (receptury, docisk, czas parzenia) | SHOULD | MVP | Kluczowe dla persony Eweliny (P3). |
| **Z-010** | Peklowanie | Przelicznik gęstości solanki na stopnie Baumé (°Bé) i Salometr | COULD | 1.1 | Dla tradycyjnych masarzy operujących solomierzami. |
| **Z-020** | Dojrzewanie | Dziennik ważeń batonu wędliny dojrzewającej | MUST | MVP | Rdzeń trackera utraty wagi. |
| **Z-021** | Dojrzewanie | Wykres liniowy ubytku masy w czasie (oś: % ubytku i waga w g) | MUST | MVP | Wizualizacja postępu suszenia ku celowi 35%. |
| **Z-022** | Dojrzewanie | Znacznik docelowego ubytku masy (konfigurowalny: 30% do 45%) | MUST | MVP | Definiuje moment dojrzałości kulinarnej. |
| **Z-023** | Dojrzewanie | Algorytm detekcji Case Hardening (tempo ubytku vs wilgotność) | MUST | MVP | Ochrona przed zepsuciem drogiego wsadu. |
| **Z-024** | Dojrzewanie | Estymator przewidywanej daty gotowości (krzywa logarytmiczna) | SHOULD | MVP | Odpowiedź na pytanie: „kiedy wędlina będzie gotowa?”. |
| **Z-025** | Dojrzewanie | Rejestr parametrów komory (temperatura i wilgotność RH) | MUST | MVP | Warunek stabilności procesu dojrzewania. |
| **Z-026** | Dojrzewanie | Atlas pleśni szlachetnych i patogennych ze zdjęciami | SHOULD | MVP | Rozpoznawanie dobrej pleśni od toksyn. |
| **Z-027** | Dojrzewanie | Monitor spadku pH w fazie fermentacji salami | SHOULD | MVP | Weryfikacja bariery mikrobiologicznej ($pH < 5.3$). |
| **Z-028** | Dojrzewanie | Powiadomienie push/lokalne o konieczności zważenia batonu | SHOULD | MVP | Utrzymanie regularności pomiarów. |
| **Z-040** | Wędzenie | 4-fazowy asystent wędzenia (Osuszanie, Dym, Parzenie, Studzenie) | MUST | MVP | Wymuszenie poprawnej technologii masarskiej. |
| **Z-041** | Wędzenie | Bezwzględne potwierdzenie etapu osuszania „do pergaminu” | MUST | MVP | Ochrona przed kwaśnym, smolistym dymem. |
| **Z-042** | Wędzenie | Profile temperatur wędzenia (zimne, ciepłe, gorące) | MUST | MVP | Wzorcowe parametry cieplne komory. |
| **Z-043** | Wędzenie | Baza drewna wędzarniczego z rekomendacjami wsadu | SHOULD | MVP | Dobór aromatu i barwy do mięsa. |
| **Z-044** | Wędzenie | Stoper parzenia w wodzie 75–80°C z alarmem przekroczenia 82°C | MUST | MVP | Ochrona przed wysuszeniem wędliny. |
| **Z-045** | Wędzenie | Śledzenie temperatury sondy rdzeniowej z alertem progowym | MUST | MVP | Alarm 2 stopnie przed celem (np. 66°C przy celu 68°C). |
| **Z-046** | Wędzenie | Stoper studzenia szokowego w lodowatej wodzie (10–15 min) | SHOULD | MVP | Zatrzymanie denaturacji i utrwalenie osłonki. |
| **Z-047** | Wędzenie | Wykres przebiegu temperatur z sesji wędzenia | COULD | 1.1 | Analiza post-mortem udanej partii. |
| **Z-048** | Wędzenie | Bezpośredni odczyt sond bezprzewodowych Bluetooth BLE | COULD | 1.2 | Automatyzacja dla posiadaczy Meater/Inkbird. |
