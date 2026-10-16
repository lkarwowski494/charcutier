# Wdrażanie CHARCUTIER na TestFlight Bez Expo (Zero EAS / Zero Cloud) 🍏✈️

> **Standard Studia Apps4Brew:** Zgodnie z architekturą zero-dependency i brakiem opłat chmurowych, **nie używamy serwerów EAS (Expo Application Services)**. Wszystkie buildy produkcyjne oraz paczki na TestFlight są generowane bezpośrednio za pomocą oficjalnych narzędzi Apple (`xcodebuild`, `altool`, App Store Connect API).

---

## 🚀 Metoda 1: 1-Klik z GitHub Actions (Zalecana)

W repozytorium skonfigurowany jest dedykowany workflow:  
[`.github/workflows/testflight.yml`](../../.github/workflows/testflight.yml)

### Krok 1: Weryfikacja sekretów w GitHub
Jeśli Twoja organizacja / konto GitHub ma już skonfigurowane klucze dla innych aplikacji studia (*Piekarz*, *Napar*), sekrety mogą być już odziedziczone. Jeśli nie, upewnij się, że w **Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions** znajdują się:

| Nazwa Sekretu | Opis | Gdzie znaleźć w App Store Connect |
| :--- | :--- | :--- |
| `ASC_KEY_ID` | Identyfikator klucza API (10 znaków, np. `2X9R4HXF34`) | *Users and Access* $\rightarrow$ *Integrations* $\rightarrow$ *App Store Connect API* |
| `ASC_ISSUER_ID` | Identyfikator wystawcy (UUID, np. `69a6de70-XXXX-XXXX-...`) | Nad tabelą kluczy w zakładce *Integrations* |
| `ASC_KEY_P8` | Pełna zawartość pliku `AuthKey_XXXX.p8` | Pobrany jednorazowo plik klucza z Apple (wraz z nagłówkami `-----BEGIN PRIVATE KEY-----` i `-----END PRIVATE KEY-----`) |

### Krok 2: Uruchomienie wysyłki
1. Wejdź do zakładki **Actions** w repozytorium GitHub:  
   `https://github.com/lkarwowski494/charcutier/actions`
2. Z lewego menu wybierz workflow **`TestFlight (Charcutier)`**.
3. Kliknij przycisk **Run workflow** na gałęzi `master`.
4. GitHub uruchomi maszynę z macOS, która:
   - Przeprowadzi weryfikację jakościową (`npm run verify` – testy, i18n, TypeScript).
   - Wygeneruje natywny kod iOS (`npx expo prebuild --platform ios --no-install --clean`).
   - Zainstaluje CocoaPods (`pod install`).
   - Zbuduje i zarchiwizuje aplikację w Release (`xcodebuild archive`).
   - Podpisze i wyśle paczkę `.ipa` bezpośrednio do App Store Connect z automatycznym provisioningiem.
   - Po 10–25 minutach Apple zakończy przetwarzanie i build pojawi się u wszystkich testerów w aplikacji **TestFlight** na iPhone i iPad!

---

## 💻 Metoda 2: Lokalny build na Macu (w Xcode lub z terminala)

Jeśli pracujesz na komputerze Mac, możesz wykonać cały proces lokalnie bez żadnych zewnętrznych serwisów:

### 1. Wygenerowanie projektu Xcode
W terminalu w katalogu projektu:
```bash
npx expo prebuild --platform ios --clean
cd ios
pod install
```

### 2. Otwarcie projektu w Xcode
```bash
open Charcutier.xcworkspace
```

### 3. Weryfikacja konta Apple Developer w Xcode
1. W Xcode wejdź w **Settings $\rightarrow$ Accounts** i dodaj swój Apple ID powiązany z Teamem `8NQ9GHY8GF` (Apps4Brew).
2. W głównym projekcie zaznacz target **Charcutier** $\rightarrow$ zakładka **Signing & Capabilities**.
3. Upewnij się, że zaznaczone jest **Automatically manage signing**, a Team to `8NQ9GHY8GF`.

### 4. Archiwizacja i wysyłka
1. Jako urządzenie docelowe w górnym pasku Xcode wybierz **Any iOS Device (arm64)**.
2. W menu wybierz **Product $\rightarrow$ Archive**.
3. Po zakończeniu kompilacji w oknie *Organizer* kliknij **Distribute App** $\rightarrow$ **Custom** $\rightarrow$ **TestFlight & App Store** $\rightarrow$ **Upload**.
4. Xcode automatycznie zweryfikuje certyfikaty i wyśle binarkę bezpośrednio do TestFlight.
