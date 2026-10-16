# CHARCUTIER (Spiżarnia Mięsna / Masarz) 🥩🥓

> **Profesjonalny kalkulator i asystent domowego masarza przygotowującego wędliny długodojrzewające, wędzonki oraz mięsa peklowane.**  
> Część rzemieślniczego studia **Apps4Brew** (obok aplikacji *Napar*, *Piekarz*, *Słoik* oraz *Oczko*).  
> **100% Offline-First · Zero Login · Zero Chmury · Prywatność „Data Not Collected” · Apple HIG · watchOS & Garmin**

---

## 🎯 Główny problem i misja

Domowe przetwórstwo mięsne to rzemiosło o najwyższej odpowiedzialności mikrobiologicznej:
1. **Precyzja dawkowania soli i peklosoli:** Zbyt mała ilość soli lub azotynu grozi rozwojem śmiertelnego jadu kiełbasianego (*Clostridium botulinum*) oraz zepsuciem mięsa; zbyt duża – zniszczeniem smaku lub przekroczeniem bezpiecznych norm toksykologicznych.
2. **Nadzorowanie procesów trwających tygodniami i miesiącami:** Dojrzewanie salami, szynek typu parmeńskiego czy bresaoli wymaga ciągłego monitorowania ubytku wody (cel 30–40%) oraz ochrony przed zjawiskiem **Case Hardening** (stwardnienie powierzchni zamykające wilgoć w gnijącym rdzeniu).
3. **Reżim termiczny wędzarni:** Błąd polegający na wpuszczeniu dymu na mokre mięso powoduje osadzenie kwaśnego kreozotu i smolisty posmak; z kolei przegrzanie wody podczas parzenia ($>82^\circ\text{C}$) nieodwracalnie wysusza mięso.
4. **Warunki pracy w masarni (brudne ręce):** Tłuste ręce i noże uniemożliwiają dotykanie smartfona – obsługa musi opierać się na smartwatchach (Apple Watch, Garmin), powiadomieniach wibracyjnych i dużych tarczach dotykowych.

---

## ✨ Kluczowe moduły

1. 🧂 **Moduł Marynowania i Peklowania:**
   - **Kalkulator solanek równowagowych (Equilibrium Brining - EQ):** Zero ryzyka przesolenia mięsa.
   - **Kalkulator peklowania tradycyjnego zalewowego:** Obliczanie stężenia w stopniach Baumé (°Bé) i Salometru.
   - **Kalkulator nastrzyków:** Precyzyjne dozowanie solanki w głąb mięśni przy kościach (ochrona przed zepsuciem głębokim).
   - **PPM Guard (Azotyn i Azotan):** Automatyczny przelicznik miligramów czystego azotynu na kg wsadu wg norm USDA FSIS i UE z rozróżnieniem polskiej peklosoli (0.5%–0.6% $NaNO_2$), Prague Powder #1 (6.25% $NaNO_2$) oraz Prague Powder #2 / Saletry ($KNO_3$).

2. ⚖️ **Tracker Utraty Wagi (Weight Loss Tracker):**
   - Śledzenie ubytku wilgoci w wędlinach dojrzewających (salami, polędwice suszone, coppa, pancetta, szynki długodojrzewające) w kierunku celu 30–40%.
   - **Detektor Case Hardening:** Wykrywanie zbyt szybkiego ubytku wody w pierwszych dobach przy zbyt niskiej wilgotności komory.
   - Algorytmiczna estymacja daty osiągnięcia docelowej wagi na podstawie krzywej wysychania.

3. 💨 **Asystent Wędzenia i Obróbki Termicznej:**
   - 4-fazowy proces: Osuszanie bez dymu (do pergaminu) $\rightarrow$ Wędzenie dymem $\rightarrow$ Parzenie / Pieczenie w wędzarni $\rightarrow$ Szokowe studzenie w lodowatej wodzie.
   - Obsługa sond termicznych: Alerty przed osiągnięciem docelowej temperatury wewnętrznej w rdzeniu (np. polędwica 62–65°C, szynka 68–70°C, drób 74°C).
   - Profile drewna wędzarniczego (olcha, buk, dąb, jabłoń, wiśnia, jałowiec).

4. ⌚ **Wsparcie dla Zegarków (Apple Watch & Garmin) oraz Live Activity:**
   - Podgląd etapu wędzenia na ekranie blokady (Dynamic Island & Live Activity).
   - Wibracja haptyczna przy zmianie fazy oraz na 2 stopnie przed osiągnięciem temperatury rdzenia.
   - Wprowadzanie pomiarów wagi za pomocą koronki Digital Crown bez brudzenia telefonu.

5. 🏷️ **Spiżarnia Mięsna, Etykiety i Baza Receptur:**
   - Inwentarz elementów mięsnych, jelit naturalnych (wieprzowe, baranie, wołowe) i osłonek kolagenowych.
   - Drukowanie eleganckich etykiet partii A4 w PDF z kodami QR (`expo-print`).
   - Kalkulator zapotrzebowania jelit z uwzględnieniem kalibru i rezerwy 15%.

6. ⏳ **Harmonogram Wsteczny (Reverse Butchery Scheduler — adaptacja z projektu Piekarz):**
   - Planowanie produkcji wstecz od docelowej daty i godziny podania na stół (np. niedziela wielkanocna lub Wigilia).
   - Precyzyjne wyliczenie dat i godzin startu: peklowania, ociekania/osadzania w chłodzie, osuszania w wędzarni bez dymu, dymienia właściwego, parzenia/pieczenia oraz szokowego studzenia dla 5 typów wędlin.

7. 💰 **Kalkulator Kosztu i Rzeczywistej Wydajności (Batch Cost & Yield — adaptacja z Napar / Słoik / Oczko):**
   - Pełny bilans finansowy wsadu: mięso, jelita/osłonki, przyprawy, peklosól, drewno wędzarnicze i prąd.
   - Rzeczywisty koszt za 1 kg gotowego wyrobu po uwzględnieniu ubytku wilgoci (kurczu 15–40%).
   - Wyliczenie kosztu 100g plastra oraz porównanie z cenami rzemieślniczymi w delikatesach (szacunek oszczędności domowych).

8. 👅 **6-Osiowy Radar Sensoryczny Wędlin (Sensory Tasting Radar — adaptacja z projektu Słoik):**
   - Wizualna ocena degustacyjna na 6 wymiarach organoleptycznych: Słoność, Dymność, Kwasowość, Pikantność, Zwięzłość/Kruchość, Soczystość.
   - Renderowany w natywnym SVG wykres pajęczynowy z poziomami odniesienia i możliwością zapisu profilu partii.

9. 🩺 **Doktor Wędliniarski SOS & Kąpiel Odsalająca (Butchery Doctor — adaptacja z Piekarz / Słoik):**
   - System ekspercki diagnozy 7 wad wędliniarskich (Case Hardening, Przesolenie, Biały nalot, Pleśń toksyczna, Podciek tłuszczowy, Gorzki kreozot, Zakwaszenie farszu).
   - Procedura ratunkowa redystrybucji próżniowej wilgoci w lodówce 4°C przez 10–14 dni dla wędlin z Case Hardening.
   - Interaktywny Kalkulator Kąpieli Odsalającej: wyliczanie wymaganej objętości wody lodowatej (3L/kg) i czasu moczenia.

10. 🏆 **12 Certyfikowanych Wzorców Mistrzowskich (Curated Masterclass Presets):**
    - 1-Tap wczytywanie autentycznych formuł:
      1. **Szynka Tradycyjna Wędzona Parzona** (mokra solanka nastrzykowa, 20g soli/kg, 120 PPM)
      2. **Salami Milano** (kultura T-SPX, glukoza 0.4%, bariera pH 5.2, cel -35% wagi)
      3. **Polędwica Łososiowa** (zimne wędzenie 18–22°C, 22g soli/kg, 125 PPM)
      4. **Krakowska Sucha Pieczona w dymie** (gruborozdrobniona, pieczenie w dymie do 68°C)
      5. **Boczek Wędzony Parzony** (suche nacieranie EQ, wędzenie ciepłe 55°C, parzenie 70°C)
      6. **Kabanosy Staropolskie** (jelita baranie 19-21 mm, suszenie i wędzenie ciepłe, cel -40%)
      7. **Bresaola Wołowa** (udziec wołowy ligawa, zioła alpejskie, cure #2, cel -38%)
      8. **Pancetta Arrotolata** (zwijana, pieprz czarny, gałka, jałowiec, cel -30%)
      9. **Szynka Szynkowarowa Drobiowa** (parzenie w cylindrze do rdzenia 74°C, wywar żelatynowy)
      10. **Lonzino Dojrzewające** (schab bez kości, wino białe, fenkuł, cure #2, cel -35%)
      11. **Biała Kiełbasa Parzona** (100% sól kamienna kłodawska, 0% peklosoli, majeranek, czosnek)
      12. **Baleron Wędzony Parzony** (karczek wieprzowy peklowany mokro z nastrzykiem 10%)

11. 🥫 **Kalkulator Szynkowaru i Prasy Mięsnej (Szynkowar Mode):**
    - Predefiniowane cylindry (0.8 kg, 1.5 kg, 3.0 kg) ze stali nierdzewnej.
    - Automatyczne dozowanie wywaru/wody z żelatyną (5–8%) dla idealnej galaretki.
    - Dobór siły docisku sprężyny (Lekki / Średni / Mocny) zapobiegający wypchnięciu soków.
    - Reżim termiczny: parzenie w wodzie 75–80°C do rdzenia 68°C (wieprzowina) lub 74°C (drób).

12. 🔬 **Moduł Fermentacji Salami i Kontrola Bariery pH:**
    - Monitorowanie tempa zakwaszania farszu w pierwszych 24–48 godzinach.
    - Rygorystyczny alert mikrobiologiczny przy braku spadku poniżej pH 5.3 w ciągu 48h (ochrona przed enterotoksyną gronkowcową *Staphylococcus aureus*).
    - Kompendium kultur starterowych (Bactoferm T-SPX, F-LC, B-LC-78, SafePro B-LC-48).

13. 📚 **Atlas Klasyfikacji Mięsa Masarskiego (PN-A-82007):**
    - Klasy wieprzowe I, IIA, IIB, III, IV (zawartość tłuszczu, ścięgien i kleju) w Akademii Masarza.
    - Wskazówki doboru sit i siatek wilka (szarpak, 10–13 mm, 6–8 mm, 2–3 mm emulsja).

14. 🔗 **Protokół Wymiany Receptur Offline (Recipe Share via URL & QR):**
    - Udostępnianie receptur za pomocą deep-linków `charcutier://recipe?data=...` oraz kodów QR.
    - Automatyczna walidacja PPM Guard przy imporcie blokująca toksyczne stężenia azotynu (>200 PPM).

15. ⌚ **Kontrakt Synchronizacji Zegarków i iOS 18 Dynamic Island / Live Activity:**
    - Zunifikowane formaty danych dla Apple Watch WCSession oraz aplikacji Garmin ConnectIQ JSON API.
    - Integracja z iOS 18 ActivityKit / Dynamic Island: status wędzenia, temperatury komory/rdzenia i odliczanie timera na zablokowanym ekranie.

---

## 🛠️ Stack Technologiczny

* **Framework:** React Native (Expo SDK 52, New Architecture enabled)
* **Język:** TypeScript 5.5+ (strict mode)
* **Baza Danych:** SQLite w trybie WAL z automatyczną rotacją 10 kopii zapasowych w `/Library/SQLite`
* **Testy:** Jest, fast-check (property-based testing), React Test Renderer
* **Dźwięk i Sprzęt:** Expo AV, Expo Haptics, Expo Print, Expo Camera, Expo FileSystem

---

## 📖 Pełna Dokumentacja Biznesowa (BRD)

Kompletne, dogłębne Wymagania Biznesowe (BRD 0.1) w standardzie Apps4Brew znajdują się w katalogu [`charcutier_brd/`](charcutier_brd/) oraz w jednym tomie:
* 📄 [`docs/brd/CHARCUTIER_BRD_Kompletne_Wydanie.md`](docs/brd/CHARCUTIER_BRD_Kompletne_Wydanie.md)
* ☁️ Kopia w chmurze na Google Drive: [Folder Charcutier / 02 BRD](https://drive.google.com/drive/folders/1MVMA6mfHzFLNdgwvfClZSsAikMg0HLz1)

---

## 📜 Licencja

Projekt rozwijany w ramach studia Apps4Brew. Wszelkie prawa zastrzeżone.
