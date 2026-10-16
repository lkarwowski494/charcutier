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
   - Kalkulator kosztu 1 kg gotowego wyrobu (z uwzględnieniem 35% kurczu).

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
