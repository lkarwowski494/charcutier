# **Charcutier BRD 0.1 — 00c Sprzeczności dziedzinowe i errata**

W obszarze przetwórstwa mięsnego istnieje szereg sprzeczności normatywnych, mitów kulinarnych oraz niebezpiecznych pułapek terminologicznych. Niniejszy dokument stanowi bezwzględną erratę dla analityków, badaczy i programistów aplikacji Charcutier.

---

## **1. Pułapka terminologiczna: Polska Peklosól vs Amerykański Cure #1 (Prague Powder #1)**

* **Problem:** W literaturze anglosaskiej i na forach internetowych powszechnie stosuje się pojęcie *Curing Salt #1*, *Prague Powder #1* lub *InstaCure #1*. W Polsce powszechnie używa się słowa *Peklosól*. Początkujący masarze mylą te produkty, co prowadzi do śmiertelnego zagrożenia!
* **Różnica chemiczna:**
  * **Polska Peklosól:** 99.4%–99.5% sól kuchenna (NaCl) + **0.5%–0.6% azotyn sodu ($NaNO_2$)**.
  * **Prague Powder #1:** 93.75% sól kuchenna (NaCl) + **6.25% azotyn sodu ($NaNO_2$)** (zabarwiony na różowo barwnikiem spożywczym, by odróżnić go od soli kuchennej).
* **Skutek pomyłki:** Zastosowanie Prague Powder #1 w proporcjach polskiej peklosoli (np. 20 g na kg mięsa) oznacza podanie **ponad 10-krotnie przekroczonej dawki śmiertelnej azotynu!** Z kolei użycie polskiej peklosoli w ilości przewidzianej dla Cure #1 (np. 2.5 g/kg) skutkuje brakiem ochrony przed *Clostridium botulinum* i zepsuciem mięsa.
* **Rozstrzygnięcie w aplikacji (RD-02):** Aplikacja nigdy nie używa samego słowa „peklosól” bez jednoznacznego podania stężenia procentowego. Wprowadzono twardy selektor:
  1. `Peklosól Polska (0.5% - 0.6% NaNO2)`
  2. `Prague Powder #1 / InstaCure #1 (6.25% NaNO2)`
  3. `Czysty azotyn sodu (laboratoryjny - tylko dla przemysłu)` – zablokowany w UI domowym.

---

## **2. Saletra potasowa ($KNO_3$ / Cure #2) a obróbka termiczna: Rynek Nitrozoamin**

* **Problem:** Wielu starszych masarzy dodaje saletrę potasową ($KNO_3$) do wszelkich rodzajów mięs, w tym do szynek parzonych, kiełbas pieczonych i boczku.
* **Podstawa naukowa:**
  * Azotan potasu ($KNO_3$) sam w sobie nie ma właściwości bakteriobójczych. Aby zadziałał, bakterie z rodziny *Staphylococcaceae* muszą powoli, w temperaturze $10-15^\circ	ext{C}$ przez okres kilku tygodni, zredukować go enzymatycznie (reduktaza azotanowa) do azotynu ($NaNO_2$).
  * Jeśli mięso z dodatkiem saletry zostanie poddane obróbce termicznej powyżej $75-100^\circ	ext{C}$ (parzenie, pieczenie, a zwłaszcza smażenie boczku na patelni w $130-170^\circ	ext{C}$), wolne azotany i azotyny wchodzą w gwałtowną reakcję z drugorzędowymi aminami białkowymi, tworząc silnie rakotwórcze **N-nitrozoaminy** (np. nitrozo-dimetyloaminę NDMA).
* **Rozstrzygnięcie w aplikacji (RD-05):** Saletra potasowa oraz Prague Powder #2 (zawierający $NaNO_3$) są **bezwzględnie zablokowane** w kalkulatorze dla procesów wędzenia na gorąco, parzenia, pieczenia i szynkowarów. Są dopuszczone wyłącznie dla wędlin surowych długodojrzewających o cyklu suszenia minimum 28 dni.

---

## **3. Normy stężenia azotynów: USDA FSIS vs Rozporządzenie Unii Europejskiej (WE) nr 1333/2008**

* **Sprzeczność:** 
  * **USDA FSIS (9 CFR § 318.7):** Dopuszcza maksymalnie **156 PPM** (mg/kg) dodanego azotynu dla wyrobów peklowanych na sucho (całe mięśnie), **200 PPM** dla kiełbas i wędzonek zalewowych, oraz **120 PPM** dla bekonu (z obowiązkowym dodatkiem 550 PPM askorbinianu sodu).
  * **Unia Europejska (Rozporządzenie 1333/2008 z późn. zm. 2023/2108):** Maksymalna dawka dodana azotynów w przetwórstwie mięsnym wynosi standardowo **150 mg/kg** (150 PPM), a dla tradycyjnych peklowanych wyrobów mięsnych od 100 do 150 mg/kg.
* **Rozstrzygnięcie w aplikacji (RD-03):** 
  * Wartość domyślna dla wędlin domowych wynosi **150 PPM** (zgodna z kompromisem USDA i UE).
  * Aplikacja posiada wbudowany strażnik **PPM Guard**: każda dawka powyżej 200 PPM generuje czerwone ostrzeżenie toksykologiczne, a poniżej 100 PPM – żółte ostrzeżenie o obniżonej stabilności mikrobiologicznej.

---

## **4. Zjawisko Case Hardening (Zakalec powierzchniowy): Spór o wilgotność w komorze dojrzewalniczej**

* **Mit:** „Aby wędlina szybciej wyschła, należy obniżyć wilgotność w komorze do 50–60% i włączyć mocny wentylator”.
* **Fakt naukowy:**
  * Woda z wnętrza mięsa dyfunduje ku powierzchni powoli, zgodnie z drugim prawem dyfuzji Ficka.
  * Jeśli wilgotność względna (RH) otoczenia spadnie poniżej 70%, odparowanie z powierzchni jest szybsze niż dopływ wody z rdzenia. Zewnętrzna warstwa białek ulega gwałtownemu wysuszeniu i skurczeniu, tworząc twardy, nieprzepuszczalny pierścień (*case hardening*).
  * Skutek: Woda zostaje uwięziona w środku batonu salami lub szynki. W beztlenowym, ciepłym i wilgotnym rdzeniu rozwijają się bakterie gnilne, a wędlina psuje się od środka („płynący rdzeń”).
* **Rozstrzygnięcie w aplikacji (RD-25):** 
  * Normą dla pierwszych 10 dni dojrzewania jest wilgotność **80%–85% RH**, a dla późniejszego etapu **75%–78% RH**.
  * Prędkość przepływu powietrza musi wynosić zaledwie **0.05–0.1 m/s**.
  * Jeśli waga wędliny spada w pierwszych dobach szybciej niż 3% na dobę, aplikacja natychmiast generuje alarm: *„Zagrożenie zesztywnieniem powierzchniowym! Zwiększ wilgotność w komorze!”*.

---

## **5. Włośnica (Trichinella spiralis) a dziczyzna i mięso świń domowych**

* **Problem:** Domowi masarze często wędzą na zimno kiełbasy z dzika lub surową polędwicę z dziczyzny.
* **Fakt mikrobiologiczny:**
  * Larwy włośnia krętego (*Trichinella spiralis*) giną w temperaturze wewnętrznej **58.5°C** utrzymanej przez min. 3 minuty lub po mrożeniu w odpowiednich reżimach temperaturowych (jednak niektóre arktyczne szczepy *Trichinella nativa* w dziczyźnie są odporne na mrożenie!).
  * Peklowanie, wędzenie zimnym dymem i suszenie **NIE ZABIJAJĄ włośnia!**
* **Rozstrzygnięcie w aplikacji (RD-42):** W przypadku wyboru surowca „Dziczyzna / Dzik”, aplikacja wyświetla obowiązkowy modal ostrzegawczy: *„Wymagane urzędowe badanie weterynaryjne mięsa metodą wytrawiania. Wędzenie zimne bez badania grozi śmiertelną włośnicą!”*.
