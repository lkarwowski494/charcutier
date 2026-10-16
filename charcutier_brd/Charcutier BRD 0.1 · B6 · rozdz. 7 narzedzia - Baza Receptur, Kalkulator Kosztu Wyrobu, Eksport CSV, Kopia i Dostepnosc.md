# **Charcutier BRD 0.1 — Część B6: Narzędzia — Receptury, Kosztorys, Kopia i Dostępność**

Wymagania funkcjonalne bazy receptur, wyceny, transferu danych i ułatwień dostępu (`BR-RECP-001` … `BR-RECP-030`).

---

### **BR-RECP-001 Baza 12 certyfikowanych receptur mistrzowskich Apps4Brew**
* **Opis:** Zestaw gotowych, bezpiecznych i przebadanych technologicznie receptur wbudowanych w aplikację:
  1. *Kiełbasa Krakowska Sucha Pieczona*
  2. *Salami Milano (fermentowane z kulturą T-SPX)*
  3. *Polędwica Łososiowa Wędzona na Zimno*
  4. *Szynka Tradycyjna z Kością (metoda nastrzykowo-zalewowa)*
  5. *Boczek Wędzony Parzony*
  6. *Kabanosy Staropolskie w jelicie baranim*
  7. *Bresaola Wołowa (suszone ligawa/udziec)*
  8. *Pancetta Arrotolata (boczek dojrzewający rolowany)*
  9. *Szynka Szynkowarowa Drobiowa (czysty skład)*
  10. *Lonzino (polędwica wieprzowa dojrzewająca)*
  11. *Biała Kiełbasa Parzona Wielkanocna*
  12. *Baleron Wędzony Parzony w kątnicy*
* **Kryteria akceptacji:**
  1. Każda receptura zawiera rygorystyczny bilans mięs, dobór jelit, gramaturę przypraw, stężenie peklosoli i profil termiczny.
* **Priorytet / Etap:** MUST · MVP.

### **BR-RECP-002 Kalkulator kosztu 1 kg gotowego wyrobu (Real Cost Calculator)**
* **Opis:** Obliczanie rzeczywistego kosztu wytworzenia wyrobu domowego z uwzględnieniem ubytku wody (kurczu).
* **Kryteria akceptacji:**
  1. Użytkownik podaje ceny zakupu surowców (mięso, jelita, przyprawy, prąd/drewno).
  2. Formuła uwzględnia odparowanie wody:
     $$	ext{Koszt}_{	ext{1 kg gotowego}} = rac{\sum 	ext{Koszty wsadu}}{M_{	ext{gotowa (po 35% ubytku)}}}$$
  3. Prezentacja porównania: koszt domowego salami rzemieślniczego vs cena sklepowa (np. 120 zł/kg w delikatesach).
* **Priorytet / Etap:** SHOULD · MVP.

### **BR-RECP-003 Pełny eksport historii i bazy do formatu CSV i JSON**
* **Opis:** Bezpłatne przenoszenie danych użytkownika.
* **Kryteria akceptacji:**
  1. Eksport tabel `batches`, `curing_logs`, `weight_logs`, `smoke_sessions` do plików CSV zgodnych z MS Excel i Apple Numbers.
  2. Pełny backup JSON całej bazy danych z możliwością przywrócenia w 1 tapnięcie.
* **Priorytet / Etap:** MUST · MVP.

### **BR-RECP-004 Dostępność cyfrowa (VoiceOver & Dynamic Type)**
* **Opis:** Pełne wsparcie dla osób niewidomych (P8) i seniorów (P4).
* **Kryteria akceptacji:**
  1. Każdy element interaktywny posiada unikalny `accessibilityLabel` i `accessibilityHint`.
  2. Odczyt wykresu ubytku masy przez VoiceOver w formie podsumowania audio: *„Partia Salami, 18. dzień suszenia, ubytek 24.5 procent, cel 35 procent”*.
  3. Pełna skalowalność czcionek do największych rozmiarów systemowych Dynamic Type bez obcinania tekstu.
* **Priorytet / Etap:** MUST · MVP.
