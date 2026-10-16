# **Charcutier BRD 0.1 — Część C2: Reguły Dziedzinowe RD-01…RD-16 i Wektory Testowe**

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
