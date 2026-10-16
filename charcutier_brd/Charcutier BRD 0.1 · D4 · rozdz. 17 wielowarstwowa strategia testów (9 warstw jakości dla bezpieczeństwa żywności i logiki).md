# **Charcutier BRD 0.1 — Część D4: Wielowarstwowa Strategia Testów (9 Warstw Jakości)**

Rozdział 17 BRD. Weryfikacja jakościowa dla aplikacji o krytycznym znaczeniu mikrobiologicznym i bezpieczeństwa żywności.

---

### **Warstwa 1: Deterministyczne testy jednostkowe wektorów prawdy (TV-01…TV-50)**
* Pokrycie 100% reguł dziedzinowych RD-01 do RD-50 w `src/core/__tests__/`.
* Zero tolerancji dla błędów zaokrągleń peklosoli (maksymalna dopuszczalna odchyłka to **0.05 g**).

### **Warstwa 2: Testy własnościowe (Property-Based Testing z fast-check)**
* Weryfikacja niezmienników bilansu masowego w losowych przedziałach wag od 100 g do 150 kg:
  - Masa soli + masa wody + masa mięsa zawsze sumują się do dokładnej wagi całkowitej.
  - Wartość PPM dla wyliczonej peklosoli mieści się zawsze w korytarzu $\pm 0.5	ext{ PPM}$.

### **Warstwa 3: Testy mutacyjne (Stryker Mutator)**
* Weryfikacja odporności testów matematycznych na odwracanie warunków logicznych (`>`, `<`, `&&`, `||`).
* Cel: Mutation Score $\ge 85\%$ dla silnika peklowania i detektora Case Hardening.

### **Warstwa 4: Testy integracyjne bazy SQLite WAL i transakcji ACID**
* Weryfikacja kaskadowego usuwania partii (`ON DELETE CASCADE`) bez pozostawiania osieroconych wpisów pomiarów wagi.
* Test symulacji nagłego zabicia procesu podczas zapisu pomiaru (odporność trybu WAL).

### **Warstwa 5: Testy rotacji kopii zapasowych i migracji schematu**
* Weryfikacja automatycznego tworzenia 10 kopii rotacyjnych w `Documents/Backups/`.
* Test migracji bazy od wersji schematu v1 do kolejnych bez utraty danych historycznych ważeń.

### **Warstwa 6: Testy strażnicze wzorców interakcji (Interaction Guards)**
* Spójność przycisku „Anuluj” we wszystkich oknach modalnych.
* Weryfikacja minimalnych wymiarów celów dotykowych (min. 48x48 pt).

### **Warstwa 7: Testy kompletności lokalizacji językowej (`check-i18n.mjs`)**
* Skrypt porównuje klucze w słownikach `pl` i `en`, blokując commit przy jakimkolwiek braku tłumaczenia.

### **Warstwa 8: Scenariusze E2E Maestro**
* Automatyczny przepływ użytkownika:
  1. Utworzenie partii *Salami Milano 2 kg*.
  2. Sprawdzenie poprawności wyliczenia peklosoli i PPM.
  3. Dodanie pomiaru wagi w 7. dobie ze spadkiem 15%.
  4. Wygenerowanie podglądu etykiety PDF z kodem QR.
  5. Rozpoczęcie sesji wędzenia i przejście przez 4 fazy.

### **Warstwa 9: Weryfikacja fizyczna na urządzeniach (Apple Watch & VoiceOver)**
* Test działania koronki Digital Crown na Apple Watch.
* Pełna nawigacja po aplikacji z włączonym czytnikiem Apple VoiceOver z zasłoniętym ekranem (Screen Curtain).
