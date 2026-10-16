# **Charcutier BRD 0.1 — Część D1: Wymagania Niefunkcjonalne (NFR) i Zgodność z Apple**

Rozdziały 9–10 BRD. Wymagania niefunkcjonalne gwarantujące stabilność, bezpieczeństwo, dostępność i zgodność z wytycznymi App Store Review Guidelines.

---

### **1. NFR-OFF: Standard 100% Offline-First**
* **NFR-OFF-001:** Wszystkie funkcje kalkulatora peklowania, trackera utraty wagi, asystenta wędzenia, bazy receptur i druku etykiet działają bez dostępu do sieci komórkowej i Wi-Fi.
* **NFR-OFF-002:** Aplikacja nigdy nie blokuje UI z powodu braku połączenia internetowego, ani nie wyświetla monitów o logowanie czy łączenie z chmurą.

### **2. NFR-I18N: Wielojęzyczność i lokalizacja**
* **NFR-I18N-001:** Architektura przygotowana do obsługi 35 języków. Wersja 1.0 startuje z pełną parzystością słowników w językach: Polski (`pl`) oraz Angielski (`en`).
* **NFR-I18N-002:** Automatyczna bramka CI `check-i18n.mjs` blokuje build, jeśli jakikolwiek klucz obecny w słowniku polskim nie istnieje w angielskim (i odwrotnie).

### **3. NFR-DOST: Dostępność cyfrowa i ergonomia brudnych rąk**
* **NFR-DOST-001:** 100% pokrycia VoiceOver: każda etykieta, suwak, przycisk i wykres wektorowy posiada czytelny `accessibilityLabel` i `accessibilityHint`.
* **NFR-DOST-002:** Wsparcie dla Dynamic Type: tekst skaluje się płynnie do największych rozmiarów systemowych Accessibility bez nakładania się na sąsiednie elementy.
* **NFR-DOST-003:** Minimalny rozmiar celu dotykowego wynosi **48x48 pt**, a w strefach akcji kuchennych/wędzarniczych **64x64 pt**, co umożliwia obsługę nadgarstkiem lub palcem w rękawicy nitrylowej.

### **4. NFR-WYG: System wzorniczy i interakcja**
* **NFR-WYG-001:** Paleta kolorystyczna *Smoked Amber & Slate*: Tło głęboka czerń wędzarnicza `#1C1917`, akcenty bursztynowe `#F59E0B`, mahoń `#78350F`, pergamin `#FEF3C7`.
* **NFR-WYG-002:** Każde okno modalne i wysuwane z dołu posiada widoczny, spójny przycisk „Anuluj” po lewej stronie nagłówka (wzorce interakcji Apps4Brew).

### **5. NFR-WYD: Wydajność i responsywność**
* **NFR-WYD-001:** Czas zimnego startu aplikacji (Cold Start) poniżej **400 ms** na iPhone 13 i nowszych.
* **NFR-WYD-002:** Wykres wektorowy SVG ubytku masy renderuje się w stałych 60/120 FPS bez zacięć animacji.

### **6. NFR-BEZP: Prywatność „Data Not Collected”**
* **NFR-BEZP-001:** Aplikacja nie zawiera żadnych zewnętrznych SDK analitycznych, reklamowych ani telemetrycznych (zero Google, Meta, Mixpanel). W deklaracji prywatności App Store widnieje czyste: *Data Not Collected*.

### **7. Zgodność z wytycznymi Apple App Store Review Guidelines**
* **Obrona przed wytyczną 4.3(b) („Prosty kalkulator”):** Aplikacja to kompletny system rzemieślniczy: wielotygodniowy tracker utraty wagi z detekcją Case Hardening, 4-fazowy stoper wędzarniczy z obsługą sond, generator etykiet PDF, integracja z Apple Watch i baza edukacyjna.
* **Zgodność z wytyczną 3.1.2 (Subskrypcje):** Jasna prezentacja cen, pełny 14-dniowy trial bez ukrytych opłat, tryb historii Read-Only po wygaśnięciu.
