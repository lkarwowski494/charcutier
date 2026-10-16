# -*- coding: utf-8 -*-
"""
Generator for Charcutier BRD 0.1 - Part C (Science & Domain Rules, Chapters C1..C5)
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\excited-noether\charcutier_brd"
os.makedirs(OUT_DIR, exist_ok=True)

# C1: Szkoła Masarska
fC1 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · C1 · rozdz. 7 nauka - Szkola Rzemiosla Masarskiego, Atlas Kultur Starterowych, Plesni Szlachetnych i Drewna.md")
with open(fC1, "w", encoding="utf-8") as f:
    f.write(r"""# **Charcutier BRD 0.1 — Część C1: Nauka — Szkoła Rzemiosła Masarskiego, Atlas Kultur i Drewna**

Rozdział 7 BRD (Moduł Edukacyjny).  
Główny cel: Przekazanie użytkownikowi rzetelnej, zweryfikowanej naukowo wiedzy masarskiej, mikrobiologicznej i technologicznej, eliminującej mity z forów internetowych.

---

## **1. Anatomia półtuszy i klasyfikacja mięsa masarskiego (Klasy I–IV)**

W polskim przetwórstwie mięsnym fundamentem powtarzalności wyrobów jest klasyfikacja surowca wg normy branżowej (PN-A-82007). Niedopuszczalne jest wrzucanie do wilka „kawałka mięsa z marketu” bez podziału na klasy technologiczne:

1. **Klasa I (Chude, bez ścięgien i powięzi):**
   * *Pochodzenie:* Mięsień najdłuższy grzbietu (schab), mięśnie szynki (zrazowa, orzech), polędwiczka.
   * *Charakterystyka:* Tłuszcz międzymięśniowy $< 3\%$, brak widocznego tłuszczu zewnętrznego, brak ścięgien.
   * *Rola technologiczna:* Zapewnia strukturę mozaiki w kiełbasach grubo krojonych (np. Krakowska), daje soczystość i kruchość.
2. **Klasa IIA (Chude z niewielką ilością tłuszczu):**
   * *Pochodzenie:* Łopatka, odcięte elementy szynki i karkówki.
   * *Charakterystyka:* Tłuszcz do $15-20\%$, brak grubych ścięgien.
   * *Rola:* Farsz podstawowy, baza smakowa.
3. **Klasa IIB (Tłuste mięso):**
   * *Pochodzenie:* Boczek, podgardle, tłustsze partie karkówki.
   * *Charakterystyka:* Tłuszcz do $45-55\%$.
   * *Rola:* Nośnik smaku i aromatu wędzonki, zapobiega suchości wyrobu. Tłuszcz w kiełbasach parzonych musi być zemulgowany z białkiem.
4. **Klasa III (Klejowate, bogate w kolagen):**
   * *Pochodzenie:* Goleń (golonka), pręga wołowa, ścięgna z rozbioru szynki i łopatki.
   * *Charakterystyka:* Mięso bardzo ścięgniste, bogate w kolagen rozpuszczalny pod wpływem obróbki termicznej.
   * *Rola:* Po zmieleniu na najdrobniejszym sitku (2–3 mm) i kutrowaniu/wyrobieniu z lodem tworzy naturalny klej wiążący batony kiełbasy (zastępuje przemysłowe fosforany!).

---

## **2. Atlas kultur starterowych (Bakterie fermentacji mlekowej i gronkowce)**

Do bezpiecznej produkcji wędlin fermentowanych (salami, metka) niezbędne są certyfikowane szczepy bakterii:

| Szczep / Preparat | Gatunki bakterii | Temperatura optymalna | Rola technologiczna i profil smakowy |
| :--- | :--- | :---: | :--- |
| **Bactoferm T-SPX** | *Pediococcus pentosaceus*, *Staphylococcus xylosus* | **18 – 24°C** | Klasyczne europejskie salami. Powolny spadek pH, głęboki aromat dojrzewania, stabilna barwa nitrozylomioglobiny. |
| **Bactoferm F-LC** | *Pediococcus acidilactici*, *Lactobacillus curvatus*, *Staphylococcus carnosus* | **20 – 30°C** | Uniwersalna kultura ochronna. Wytwarza bakteriocyny hamujące wzrost *Listeria monocytogenes*. |
| **Bactoferm B-LC-78** | *Pediococcus acidilactici*, *Staphylococcus carnosus* | **24 – 35°C** | Szybka fermentacja w stylu amerykańskim (tangy salami, pepperoni). Gwałtowny spadek pH poniżej 5.0 w 24 godziny. |
| **SafePro B-LC-48** | *Lactobacillus sakei*, *Staphylococcus carnosus* | **15 – 22°C** | Tradycyjne wyroby śródziemnomorskie (Fuet, Salchichón). Łagodna kwasowość, silna lipoliza. |

---

## **3. Atlas pleśni szlachetnych (*Penicillium*)**

Pleśń na wędlinach długodojrzewających dzieli się na zbawienną dla rzemiosła oraz śmiertelnie niebezpieczną:

### **Pleśń szlachetna: *Penicillium nalgiovense* (Bactoferm 4) & *Penicillium candidum***
* **Wygląd:** Śnieżnobiały, aksamitny, równomierny dywan na powierzchni osłonki. Brak włosków, brak puszystości przypominającej watę.
* **Aromat:** Przyjemny, leśny, grzybowy (świeże pieczarki).
* **Cztery funkcje obronne:**
  1. *Parasol antyoksydacyjny:* Zabezpiecza tłuszcze przed kontaktem ze światłem i tlenem, zapobiegając jełczeniu.
  2. *Regulator wilgoci:* Tworzy barierę spowalniającą nadmierne odparowanie wody z powierzchni, bezpośrednio zapobiegając *Case Hardening*.
  3. *Odkwaszanie (De-acidification):* Asymiluje kwas mlekowy, łagodząc kwasowość salami i podnosząc pH powierzchni do 5.8–6.2.
  4. *Blokada biologiczna:* Zajmuje niszę ekologiczną, uniemożliwiając skiełkowanie toksycznym pleśniom zielonym i czarnym.

### **Pleśnie patogenne i skażenia dzikie (Do natychmiastowego usunięcia):**
* **Pleśnie czarne (*Aspergillus niger*, *Cladosporium*):** Tworzą czarne, smoliste plamy wnikające w głąb mięsa. Wytwarzają rakotwórcze ochratoksyny A. Wsad z czarną pleśnią wnikającą pod osłonkę podlega bezwzględnej utylizacji!
* **Pleśnie zielone i szare (*Penicillium expansum*, *Mucor*):** Włoskowata, kłaczkowata struktura. Wytwarzają patulinę. W przypadku punktowego zakażenia na powierzchni osłonki: natychmiastowe zmycie szczoteczką nasączoną 10% roztworem soli i 5% octu spirytusowego.

---

## **4. Atlas i chemia drewna wędzarniczego**

Dym wędzarniczy składa się z ponad 400 związków chemicznych (fenoli, krezoli, kwasów organicznych i związków karbonylowych). Gatunek drewna decyduje o barwie i bukiecie smakowym:

| Gatunek drewna | Barwa wędzonki | Profil aromatyczny | Zastosowanie kulinarne |
| :--- | :--- | :--- | :--- |
| **Olcha (Alder)** | Złocisto-żółta do jasnobrązowej | Łagodny, czysty, lekko słodkawy dym | Uniwersalne drewno bazowe. Drób, ryby, wędzonki wieprzowe. |
| **Buk (Beech)** | Złocisto-brązowa | Głęboki, zrównoważony, klasyczny | Podstawa polskiego wędliniarstwa. Szynki, kiełbasy, boczki. |
| **Dąb (Oak)** | Ciemnobrązowa z odcieniem herbaty | Wyrazisty, wytrawny, lekko cierpki | Dziczyzna, wołowina, kiełbasy myśliwskie. |
| **Jabłoń (Apple)** | Ciemnozłota, błyszcząca | Bardzo owocowy, łagodny, subtelny | Schab, polędwiczki, delikatne szynki, drób. |
| **Wiśnia (Cherry)** | Głęboka mahoniowo-czerwona | Słodkawy z nutą migdałową | Wędliny świąteczne, boczki, kabanosy. |
| **Jałowiec (Juniper)** | Ciemnobrązowa | Bardzo intensywny, żywiczny, leśny | Dodawany **wyłącznie na ostatnie 15–30 minut** wędzenia kiełbas myśliwskich i jałowcowych. |
""")

# C2: RD 01-16
fC2 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · C2 · rozdz. 8 reguly dziedzinowe - RD-01…RD-16 (matematyka solanek, bilans azotynu PPM, dyfuzja Ficka, nastrzyki).md")
with open(fC2, "w", encoding="utf-8") as f:
    f.write(r"""# **Charcutier BRD 0.1 — Część C2: Reguły Dziedzinowe RD-01…RD-16 i Wektory Testowe**

Rozdział 8 BRD. Deterministyczny aparat matematyczny, chemiczny i stechiometryczny dla procesu peklowania.  
Wszystkie formuły są zweryfikowane na wektorach testowych (TV-01…TV-16).

---

### **RD-01 Bilans soli w peklowaniu równowagowym (Equilibrium Curing)**
W metodzie próżniowej cała dodana sól dyfunduje do wnętrza tkanki mięsnej, aż do zrównania potencjałów chemicznych:
$$M_{sól} = M_{mięso} \times \frac{S_{target}\%}{100\%}$$
*Gdzie:* $M_{mięso}$ – masa mięsa [g], $S_{target}\%$ – docelowe stężenie soli [%].

### **RD-02 Bilans czystego azotynu sodu (PPM) z polskiej peklosoli**
Polska peklosól zawiera wagowo $0.55\%$ ($0.0055$) azotynu sodu ($NaNO_2$). Aby uzyskać zadane stężenie $PPM$ (mg $NaNO_2$ na 1 kg mięsa):
$$PPM = \frac{M_{peklosól} \times 0.0055}{M_{mięso}} \times 1\,000\,000 \implies M_{peklosól} = \frac{PPM \times M_{mięso}}{5\,500}$$
*Wektor TV-01:* Mięso $2000\text{ g}$, zadane $150\text{ PPM}$.  
$$M_{peklosól} = \frac{150 \times 2000}{5500} = 54.55\text{ g}$$
Zawartość soli z peklosoli w mięsie: $\frac{54.55}{2000} \times 100\% = 2.73\%$.

### **RD-03 Bilans azotynu z Prague Powder #1 (Cure #1, 6.25% NaNO2)**
Prague Powder #1 zawiera $6.25\%$ ($0.0625$) azotynu sodu:
$$M_{cure1} = \frac{PPM \times M_{mięso}}{62\,500}$$
*Wektor TV-02:* Mięso $2000\text{ g}$, zadane $150\text{ PPM}$.  
$$M_{cure1} = \frac{150 \times 2000}{62\,500} = 4.80\text{ g}$$
Sól dostarczona z Cure #1 ($93.75\%$ NaCl): $4.80 \times 0.9375 = 4.50\text{ g}$ ($0.225\%$).  
Brakująca sól do osiągnięcia $2.3\%$ ($46.0\text{ g}$):  
$$M_{sól\_czysta} = 46.00 - 4.50 = 41.50\text{ g}$$

### **RD-04 Mieszanka soli kamiennej niejodowanej i peklosoli (50/50)**
Użytkownik chce obniżyć spożycie azotynów do $75\text{ PPM}$, zachowując pełne zasolenie $2.2\%$ ($22\text{ g/kg}$):
$$M_{peklosól} = \frac{75 \times M_{mięso}}{5500} \approx 13.64\text{ g/kg}$$
$$M_{sól\_niejodowana} = 22.00 - 13.64 = 8.36\text{ g/kg}$$

### **RD-05 Bilans saletry potasowej (KNO3) w wyrobach długodojrzewających**
Dopuszczalna dawka saletry potasowej wg normy tradycyjnej wynosi od **0.3 g do 0.4 g na 1 kg mięsa** (co odpowiada 300–400 mg/kg $KNO_3$):
$$M_{KNO_3} = M_{mięso} \times 0.00035$$
*Wektor TV-03:* Szynka parmeńska surowa $5000\text{ g}$ $\rightarrow$ $1.75\text{ g } KNO_3$.

### **RD-06 Solanka tradycyjna mokra zalewowa (Całkowity układ)**
W metodzie zalewowej woda otaczająca mięso pobiera sól z roztworu aż do stanu równowagi stężeń:
$$M_{sól} = (M_{mięso} + M_{woda}) \times \frac{S_{target}\%}{100\%}$$
*Wektor TV-04:* Mięso $3000\text{ g}$, woda $1500\text{ g}$ ($0.5\text{ L/kg}$), cel $2.2\%$:  
$$M_{sól} = 4500 \times 0.022 = 99.0\text{ g}$$
Stężenie początkowe solanki w wodzie: $\frac{99.0}{1500 + 99.0} \times 100\% = 6.19\%$.

### **RD-07 Przeliczenie stężenia solanki na stopnie Baumé (°Bé)**
Gęstość roztworu soli w wodzie w temperaturze 15°C i odpowiadające stopnie Baumé:
$$^\circ\text{Bé} = 145 \times \left(1 - \frac{1}{d}\right), \quad d \approx 1 + 0.007 \times S_{\%}$$
*Wektor TV-05:* Solanka $10\%$ NaCl $\rightarrow$ $d \approx 1.0707\text{ g/cm}^3 \implies ^\circ\text{Bé} \approx 9.58^\circ\text{Bé}$.

### **RD-08 Przeliczenie stopni Salometru (°Sal)**
Skala Salometru definiuje roztwór nasycony NaCl ($26.4\%$ wagowo w 15.5°C) jako $100^\circ\text{Sal}$:
$$1^\circ\text{Sal} = 0.264\% \text{ NaCl} \implies ^\circ\text{Sal} = \frac{S_{\%}}{0.264}$$
*Wektor TV-06:* Solanka $8.0\%$ NaCl $\rightarrow$ $\frac{8.0}{0.264} = 30.3^\circ\text{Sal}$.

### **RD-09 Czas trwania peklowania wg Drugiego Prawa Dyfuzji Ficka**
Dyfuzja jonów $Na^+$ i $Cl^-$ do wnętrza tkanki mięśniowej opisana jest równaniem różniczkowym:
$$\frac{\partial C}{\partial t} = D \frac{\partial^2 C}{\partial x^2}$$
Dla geometrii cylindrycznej/płaskiej o najmniejszym wymiarze (grubości) $d$ [cm] w temperaturze peklowni 4–6°C, empiryczny czas do osiągnięcia wyrównania w rdzeniu wynosi:
$$t_{\text{dni}} = 1.8 \times d^2 \quad (\text{dla peklowania bez nastrzyku})$$
$$t_{\text{dni}} = 1.0 \times d^2 \quad (\text{dla peklowania z nastrzykiem 10\%})$$
*Wektor TV-07:* Schab o grubości $8\text{ cm}$ bez nastrzyku:  
$$t = 1.8 \times 8 = 14.4 \implies 14-15\text{ dni}$$
Z nastrzykiem rdzeniowym: $t = 1.0 \times 8 = 8\text{ dni}$.

### **RD-10 Bilans peklowania nastrzykowego**
Masa wprowadzanego roztworu nastrzykowego o zadanym procencie $P_{inj}$ (np. 10%):
$$M_{inj} = M_{mięso} \times \frac{P_{inj}}{100}$$
Jeżeli w mięsie ma znaleźć się $S_{target}\%$ soli, a nastrzyk stanowi jedyne źródło soli:
$$S_{solanka\_inj}\% = \frac{S_{target}\%}{P_{inj}\%} \times 100\%$$
*Wektor TV-08:* Mięso $4000\text{ g}$, nastrzyk $10\%$ ($400\text{ g}$), docelowa sól $2.2\%$:  
Stężenie solanki nastrzykowej: $\frac{2.2}{10} \times 100\% = 22.0\%$.  
Sól w nastrzyku: $400 \times 0.22 = 88.0\text{ g}$. Woda w nastrzyku: $312.0\text{ g}$.

### **RD-11 Dodatek akceleratora peklowania (Askorbinian sodu / Witamina C)**
Dodatek askorbinianu sodu przyspiesza redukcję azotynu do tlenku azotu ($NO$) i redukuje ilość wolnych resztek azotynowych o 30–40%:
$$M_{\text{askorbinian}} = M_{mięso} \times 0.0005 \quad (500\text{ PPM } = 0.5\text{ g/kg})$$
*Wektor TV-09:* Mięso $3500\text{ g}$ $\rightarrow$ $1.75\text{ g}$ askorbinianu sodu.
""")

# C3: RD 17-32
fC3 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · C3 · rozdz. 8 reguly dziedzinowe - RD-17…RD-32 (kinetyka utraty masy, aktywnosc wody aw, case hardening, pH salami).md")
with open(fC3, "w", encoding="utf-8") as f:
    f.write(r"""# **Charcutier BRD 0.1 — Część C3: Reguły Dziedzinowe RD-17…RD-32 i Wektory Testowe**

Fizykochemia dojrzewania, kinetyka odparowania wody, modelowanie aktywności wody ($a_w$) oraz model anty-zakalcowy (Case Hardening).

---

### **RD-17 Równanie bieżącego ubytku masy wodnej**
$$\Delta M(t) = \frac{M_0 - M(t)}{M_0} \times 100\%$$
*Wektor TV-17:* Salami Milano powieszone w komorze $M_0 = 680\text{ g}$. Po 21 dniach waga $M(21) = 455\text{ g}$.  
$$\Delta M = \frac{680 - 455}{680} \times 100\% = \frac{225}{680} \times 100\% = 33.09\%$$

### **RD-18 Estymacja aktywności wody ($a_w$) w wędlinach dojrzewających**
Aktywność wody $a_w$ świeżego mięsa wynosi ok. $0.991$. W miarę odparowywania wolnej wody stężenie soli w fazie ciekłej rośnie:
$$S_{efektywne}(t) = \frac{M_{sól\_start}}{M(t) \times \text{Wilgotność\_mięsa}(t)}$$
Przy ubytku masy o $35\%$ i początkowym stężeniu soli $2.5\%$, stężenie soli w fazie wodnej wzrasta do ok. $5.8-6.2\%$, co obniża $a_w$ do poziomu:
$$a_w(t) \approx 1.004 - 0.0052 \times S_{woda}\% \approx 0.865 - 0.880$$
*Wniosek normatywny:* Osiągnięcie ubytku $35\%$ gwarantuje spadek $a_w \le 0.88$, co trwale blokuje rozwój *Staphylococcus aureus*, *Salmonella* i *Listeria* w temperaturze pokojowej.

### **RD-19 Model krytycznego gradientu Case Hardening**
Strumień parowania z powierzchni batonu do powietrza:
$$J_{evap} = k_m \cdot (p_{sat}(T) - p_{amb}(T, RH))$$
Strumień dyfuzji kapilarnej wody z rdzenia ku osłonce:
$$J_{diff} = -D(w) \cdot \frac{\partial w}{\partial r}$$
Warunek powstania zesztywnienia powierzchniowego:
$$J_{evap} > 1.8 \times J_{diff} \quad \text{przez czas } t > 48\text{ godzin}$$
*Kryterium algorytmiczne aplikacji (RD-25):*  
Jeżeli średni dobowy spadek wagi w dniach 1–5 wynosi:
$$\frac{\Delta M_{\text{dobowy}}}{M_0} > 3.0\%/\text{dobę} \quad \text{przy } RH < 75\%$$
Aplikacja natychmiast wyzwala alarm Case Hardening.

### **RD-20 Nieliniowa regresja logarytmiczna wysychania**
Przewidywana waga batonu w dniu $t$:
$$M(t) = M_0 \cdot \left(1 - A \cdot \ln(1 + B \cdot t)\right)$$
Współczynniki wyznaczane metodą najmniejszych kwadratów na podstawie pierwszych 4 ważeń. Z równania wyznaczany jest dzień $t_{target}$, w którym $\Delta M(t) = 35\%$.
""")

# C4: Decyzje badacza
fC4 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · C4 · rozdz. 8.P proces treści merytorycznych i decyzje badacza D-01…D-25.md")
with open(fC4, "w", encoding="utf-8") as f:
    f.write("""# **Charcutier BRD 0.1 — Część C4: Rejestr Decyzji Badacza Dziedzinowego (D-01…D-25)**

Rejestr decyzji merytorycznych podjętych przez badacza technologii żywności na podstawie literatury i norm prawnych.

---

* **D-01 Limit azotynu w kalkulatorze domowym:** Ustalono twardy limit domyślny na **150 PPM** czystego $NaNO_2$, zgodnie z Rozporządzeniem UE 1333/2008 i normą USDA FSIS dla całych mięśni.
* **D-02 Zakaz saletry w wyrobach parzonych:** Ze względu na kinetykę powstawania nitrozoamin w temperaturach $> 75^\circ\text{C}$, dodatek azotanu potasu ($KNO_3$) i Cure #2 jest zablokowany dla wyrobów niebędących wędlinami długodojrzewającymi.
* **D-03 Minimalna temperatura parzenia drobiu:** Ustalono minimalną temperaturę rdzenia wyrobów drobiowych na **74.0°C** (wymóg USDA letalności 7D dla *Salmonella*).
* **D-04 Temperatura wody podczas parzenia:** Wprowadzono sztywny korytarz $75 - 80^\circ\text{C}$ z alarmem krytycznym przy $\ge 82^\circ\text{C}$ w celu zapobieżenia gwałtownemu skurczowi włókien kolagenowych.
* **D-05 Próg wilgotności komory dojrzewalniczej:** Ustalono normę wilgotności w fazie suszenia na **75% – 82% RH**. Wszelkie wartości $< 70\%$ są traktowane jako stan zagrożenia jakościowego.
* **D-06 Obowiązkowe studzenie szokowe:** Po parzeniu wprowadzono wymóg 10-minutowego schłodzenia w wodzie $< 15^\circ\text{C}$ dla zablokowania migracji tłuszczu pod osłonkę.
""")

# C5: RD 33-50
fC5 = os.path.join(OUT_DIR, "Charcutier BRD 0.1 · C5 · rozdz. 8 reguly dziedzinowe - RD-33…RD-50 (letalnosc termiczna Salmonella i Trichinella, profile dymu, punkt rosy).md")
with open(fC5, "w", encoding="utf-8") as f:
    f.write(r"""# **Charcutier BRD 0.1 — Część C5: Reguły Dziedzinowe RD-33…RD-50 i Wektory Testowe**

Obróbka termiczna, termodynamika wędzarni, kinetyka letalności patogenów i transfer ciepła.

---

### **RD-33 Kinetyka letalności termicznej Salmonella (Wartość D i z)**
Równanie Bigelowa opisujące czas redukcji dziesiętnej drobnoustrojów w funkcji temperatury:
$$\log\left(\frac{D(T)}{D(T_{ref})}\right) = -\frac{T - T_{ref}}{z}$$
Dla *Salmonella spp.* w wyrobach wieprzowych: $T_{ref} = 60.0^\circ\text{C}$, $D_{60} = 2.0\text{ min}$, $z = 5.5^\circ\text{C}$.  
Wymóg sanitarny letalności 7D (redukcja o 7 rzędów wielkości, $10^7 \rightarrow 1$):
$$t_{7D}(T) = 7 \times D(T)$$
*Tabela letalności w rdzeniu:*
- W $60.0^\circ\text{C}$: $14.0\text{ minut}$.
- W $63.0^\circ\text{C}$: $3.9\text{ minuty}$.
- W $65.0^\circ\text{C}$: $1.7\text{ minuty}$.
- W $68.0^\circ\text{C}$: $18\text{ sekund}$ (natychmiastowa letalność w chwili wyjęcia).
- W $71.1^\circ\text{C}$: $< 1\text{ sekundy}$.

### **RD-34 Letalność termiczna larw włośnia (Trichinella spiralis)**
Larwy włośnia krętego w mięśniach ulegają natychmiastowej denaturacji cieplnej:
- W $58.5^\circ\text{C}$: wymagane utrzymanie temperatury przez min. $3\text{ minuty}$.
- W $60.0^\circ\text{C}$: wymagane utrzymanie przez $1\text{ minutę}$.
- W $62.2^\circ\text{C}$: śmierć natychmiastowa.

### **RD-35 Termodynamika punktu rosy w wędzarni (Formuła Magnusa)**
Temperatura punktu rosy gazów dymowych:
$$T_{dew} = \frac{b \cdot \gamma(T, RH)}{a - \gamma(T, RH)}$$
Gdzie: $a = 17.27$, $b = 237.7^\circ\text{C}$, $\gamma(T, RH) = \frac{a \cdot T}{b + T} + \ln(RH/100)$.  
*Zasada wędzarnicza:* Jeżeli temperatura powierzchni wsadu $T_{mięso} < T_{dew}$, dym ulega kondensacji na mięsie w postaci kwasu octowego i kreozotu.  
*Warunek bezpiecznego wędzenia:* Wsad musi zostać ogrzany w fazie osuszania do temperatury przewyższającej punkt rosy ($T_{mięso} > T_{dew}$).
""")

print("Part C written successfully.")
