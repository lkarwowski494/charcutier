# **Charcutier BRD 0.1 — Część A3c: Nakład Pracy Agentów i Warianty Wdrożeniowe**

---

## **6.3 Nakład pracy agentów AI (Estymacja zadaniowa)**

Szacunki podano w roboczodniach pracy autonomicznych agentów (z uwzględnieniem pracy równoległej zespołów badawczych, deweloperskich i testowych), zgodnie ze standardem studia Apps4Brew.

| Moduł / Obszar prac | Zadania kluczowe | Dni pracy agentów |
| :--- | :--- | :---: |
| **Fundament & Baza danych** | Schemat SQLite WAL, migracje, ochrona `/Library/SQLite`, 10 kopii zapasowych, model relacyjny. | 2–3 dni |
| **Silnik matematyczny (Peklowanie)** | Formuły stechiometryczne, kalkulator EQ, zalewowy, nastrzyki, strażnik PPM Guard, testy TV-01…16. | 3–4 dni |
| **Silnik dojrzelniczy (Tracker Wagi)** | Model dyfuzji Ficka, detektor Case Hardening, estymator daty, wykres wektorowy SVG, testy TV-17…32. | 3–4 dni |
| **Asystent wędzenia i obróbki cieplnej** | Maszyna stanów stopera 4-fazowego, alerty progowe sond, logika parzenia/studzenia, testy TV-33…50. | 3–4 dni |
| **UI/UX aplikacji mobilnej** | Ekran główny, kalkulator peklowania, tracker wagi, asystent wędzenia, spiżarnia, design system *Smoked Amber & Slate*. | 5–6 dni |
| **Apple Watch & Live Activity** | Natywny target watchOS, obsługa Digital Crown, haptyka Taptic Engine, widżet Live Activity, Dynamic Island. | 4–5 dni |
| **Etykiety PDF & Skaner QR** | Generator arkuszy etykiet przez `expo-print`, integracja skanera `expo-camera`, obsługa offline. | 2–3 dni |
| **Monetyzacja & StoreKit** | Integracja StoreKit 2, paywall, 14-dniowy trial, blokada tworzenia nowych partii z trybem Read-Only. | 2–3 dni |
| **Dostępność, i18n & Testy weryfikacyjne** | VoiceOver, Dynamic Type, testy regresji, testy kontraktowe, skrypt `check-i18n`, bramka CI `verify`. | 3–4 dni |
| **RAZEM (Wariant b+ MUST + 6 akceleratorów)** | — | **27–36 dni agentów** (kalendarzowo: 3–4 tyg.) |

---

## **6.4 Sześć kluczowych akceleratorów wariantu (b+)**

Wariant rekomendowany (b+) rozszerza czysty zbiór MUST o 6 tanich w implementacji funkcji o krytycznym znaczeniu rynkowym:
1. **Wibracja haptyczna Apple Watch dla temperatury rdzenia (BR-ZEG-003):** Umożliwia natychmiastową reakcję masarza bez patrzenia na telefon.
2. **Live Activity na ekranie blokady (BR-ZEG-008):** Podgląd czasu i temperatury wędzarni bez odblokowywania telefonu brudną dłonią.
3. **PPM Guard w kalkulatorze (BR-PEKL-004):** Blokada błędnych dawek azotynu budująca bezwzględne zaufanie użytkownika.
4. **Wykres ubytku masy z detektorem Case Hardening (BR-WAGA-006):** Główny wizualny wyróżnik produktu chroniący wędliny przed zepsuciem.
5. **Konfiguracja 14-dniowego Trialu (BR-ZAK-003):** Niezbędna do wysokiej konwersji przy starcie.
6. **Family Sharing (BR-ZAK-005):** Umożliwia współdzielenie licencji w ramach gospodarstwa domowego.
