# **Charcutier BRD 0.1 — Część C3: Reguły Dziedzinowe RD-17…RD-32 i Wektory Testowe**

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
