# **Charcutier BRD 0.1 — Część C5: Reguły Dziedzinowe RD-33…RD-50 i Wektory Testowe**

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
