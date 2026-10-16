# **Charcutier BRD 0.1 — Część A2: Analiza Rynku, Model Przychodu i Ramy Zakresu**

---

## **4. Analiza rynku i konkurencji**

### **4.1 Stan rynku i luka produktowa**
Rynek domowego przetwórstwa mięsnego przeżywa globalny renesans. Konsumenci uciekają od przemysłowej żywności naszpikowanej wodą, fosforanami i konserwantami, poszukując tradycyjnego smaku, rzemiosła i samowystarczalności.
* **W Polsce:** Tradycja wędliniarstwa przydomowego jest jedną z najsilniejszych na świecie. Społeczność portalu `wedlinydomowe.pl` liczy dziesiątki tysięcy aktywnych użytkowników, a grupy dyskusyjne na Facebooku gromadzą setki tysięcy pasjonatów.
* **Globalnie (USA, Włochy, Hiszpania, Niemcy, Australia):** Olbrzymia społeczność pasjonatów wędlin dojrzewających skupiona wokół forów charcuterie, subreddita `r/Charcuterie` (ponad 150 tys. członków) oraz entuzjastów domowego BBQ.

### **4.2 Analiza istniejących rozwiązań**
1. **Arkusze kalkulacyjne Excel / Google Sheets:**
   * *Stan:* Najpopularniejsze narzędzie zaawansowanych masarzy.
   * *Wady:* Nieczytelne na telefonie, niemożliwe do obsługi brudnymi rękami w kuchni, brak przypomnień, brak powiadomień w czasie rzeczywistym, brak integracji z zegarkami.
2. **Generyczne aplikacje BBQ (np. PitmasterIQ, GrillTime):**
   * *Stan:* Skupiają się wyłącznie na szybkim grillowaniu steków czy burgerów.
   * *Wady:* Całkowity brak modułów peklowania, chemii azotynów, obliczeń PPM, wielotygodniowej kontroli ubytku wagi czy fazy osuszania wędzarniczego.
3. **Prymitywne kalkulatory internetowe (kalkulatory webowe):**
   * *Stan:* Proste skrypty JS liczące solankę ze stałym współczynnikiem.
   * *Wady:* Wymagają połączenia z internetem (brak zasięgu w piwnicach i na działkach), brak pamięci partii, brak śledzenia wagi, brak bezpieczeństwa danych.

### **4.3 Przewagi konkurencyjne Charcutier**
* **100% Offline-First:** Działa w blaszanej wędzarni w lesie i w głębokiej piwnicy bez zasięgu sieci komórkowej.
* **Pojedynczy ekosystem:** Peklowanie $ightarrow$ Wędzenie $ightarrow$ Dojrzewanie $ightarrow$ Spiżarnia w jednej aplikacji.
* **PPM Guard:** Deterministyczna matematyka bezpieczeństwa chroniąca przed botulizmem i przedawkowaniem chemii.
* **Integracja z Apple Watch i Garmin:** Niezrównana wygoda obsługi brudnymi rękami.

---

## **5. Model przychodu i ekonomia jednostkowa**

Zgodnie z filozofią studia **Apps4Brew**, aplikacja realizuje model *„Cheaper than Espresso”*:
* **Miesięczna subskrypcja:** 0,99 € (w Polsce: 3,99 zł).
* **Roczna subskrypcja:** 4,99 € (w Polsce: 19,99 zł) — rabat 58%.
* **Zakup dożywotni (Lifetime):** 14,99 € (w Polsce: 59,99 zł) — jednorazowa płatność dla osób nienawidzących subskrypcji.

### **Ekonomia jednostkowa (Unit Economics):**
* **Koszt krańcowy użytkownika:** **0,00 USD / miesiąc** (brak serwerów chmurowych, brak chmurowych LLM, brak baz zewnętrznych).
* **Roczna opłata Apple Developer Program:** 99 USD.
* **Próg rentowności (Break-Even):**
  * W modelu subskrypcyjnym rocznym w Polsce (po prowizji 15% Apple w Small Business Program): przychód netto ok. 14,50 zł / użytkownika $pprox$ 3.65 USD. Zwrot kosztu konta Apple następuje przy **zaledwie 28 aktywnych subskrypcjach rocznych**.
  * W modelu Lifetime (przychód netto ok. 43,50 zł $pprox$ 11 USD): zwrot następuje przy **9 zakupach dożywotnich**.

---

## **6. Ramy zakresu i reguły phasingowe**

Zakres funkcjonalny podzielono na fazy:
* **MVP (Wersja 1.0):** Rdzeń kalkulatora peklowania EQ, zalewowego i nastrzykowego; Tracker wagi z wykresem ubytku masy i detekcją Case Hardening; Asystent wędzenia (4 fazy z osuszaniem); Ewidencja partii; Aplikacja Apple Watch; Etykiety PDF z QR.
* **Wersja 1.1:** Aplikacja na Garmin Connect IQ; Udostępnianie receptur przez kody QR offline; Tryb wysokiego kontrastu dla zadymionej wędzarni; Komplikacje tarczy zegarka.
* **Wersja 1.2:** Obsługa bezprzewodowych sond BLE (Meater, Inkbird); Integracja z czujnikami wilgotności komory dojrzewalniczej BLE.
* **Wersja 2.x:** Asystent rozbioru półtuszy i bilansowania tłuszczu z aparatem (pomiar proporcji mięsa do słoniny na urządzeniu).
