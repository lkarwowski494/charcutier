/**
 * CHARCUTIER — Butchery Doctor & Emergency Recovery Engine
 * Apps4Brew Studio (Adapted from Piekarz Doktor & Słoik Ratownik)
 *
 * Diagnostic decision tree and step-by-step emergency recovery protocols
 * for charcuterie and cured meat problems.
 */

export type DefectCategory =
  | 'oversalted'       // Przesolenie po peklowaniu
  | 'case_hardening'  // Zesztywnienie powierzchniowe (twardy pancerz, miękki rdzeń)
  | 'white_coating'   // Biały nalot na batonie (kryształy soli vs pleśń szlachetna vs toksyczna)
  | 'green_black_mold'// Zielona, czarna lub żółta pleśń toksyczna
  | 'fat_rendering'   // Wytopiony tłuszcz pod osłonką / podciek galaretowy
  | 'sour_creosote'   // Kwaśny, smolisty smak dymu
  | 'spongy_texture'; // Puste przestrzenie w kiełbasie / gąbczasty farsz

export interface DiagnosisResult {
  id?: string;
  defectKey: DefectCategory;
  title: string;
  symptom?: string;
  cause?: string;
  severity: 'low' | 'medium' | 'critical' | 'minor' | 'moderate';
  rootCause: string;
  immediateAction?: string;
  recoveryProcedure: string[];
  recoverySteps: string[];
  preventiveRule: string;
  prevention?: string;
  isSalvageable: boolean;
  salvageInstructions?: {
    soakTimeHours?: number;
    vacuumEquilibrationDays?: number;
    targetChamberRh?: number;
  };
}

export interface DesaltingBathResult {
  meatWeightKg: number;
  currentSaltGramsPerKg: number;
  targetSaltGramsPerKg: number;
  excessSaltGramsPerKg: number;
  waterVolumeLiters: number;
  soakTimeHours: number;
  waterTempMaxCelsius: number;
  instructions: string[];
}

/**
 * Oblicza parametry kąpieli odsalającej mięso
 */
export function calculateDesaltingBath(
  meatWeightKg: number,
  currentSaltGramsPerKg: number,
  targetSaltGramsPerKg: number
): DesaltingBathResult {
  const excess = Math.max(0, currentSaltGramsPerKg - targetSaltGramsPerKg);
  const waterVolumeLiters = Number((meatWeightKg * 3.0).toFixed(1));
  const soakTimeHours = Number((excess * 0.5).toFixed(1));

  return {
    meatWeightKg,
    currentSaltGramsPerKg,
    targetSaltGramsPerKg,
    excessSaltGramsPerKg: excess,
    waterVolumeLiters,
    soakTimeHours,
    waterTempMaxCelsius: 4,
    instructions: [
      `Zanurz mięso w ${waterVolumeLiters} l schłodzonej wody (temp. maks. 4°C).`,
      `Czas moczenia: ${soakTimeHours} godz. Wymieniaj wodę na świeżą co 60 minut.`,
      'Po zakończeniu kąpieli osusz wyrób i odwieś w chłodzie na min. 12 godzin do wyrównania gradientu soli.',
    ],
  };
}

/**
 * Calculates water soaking time to desalt an oversalted cured meat cut
 */
export function calculateDesaltingHours(meatWeightG: number, thicknessCm: number = 6): number {
  if (meatWeightG <= 0) return 0;
  const byWeight = (meatWeightG / 1000) * 1.5;
  const byThickness = thicknessCm * 0.4;
  return Math.round(Math.max(1, Math.max(byWeight, byThickness)) * 10) / 10;
}

export const BUTCHERY_DEFECTS_CATALOG: DiagnosisResult[] = [
  {
    id: 'case_hardening',
    defectKey: 'case_hardening',
    title: 'Case Hardening (Zesztywnienie Powierzchniowe)',
    symptom: 'Twarda skorupa na zewnątrz batonu, surowy/miękki środek',
    cause: 'Zbyt szybki spadek wilgotności (RH < 75%) i zbyt silny ruch powietrza w pierwszych dniach.',
    severity: 'moderate',
    rootCause: 'Zbyt gwałtowny spadek wilgotności (RH < 75%) i silny nawiew w pierwszych 5 dobach suszenia. Skurczone białka zablokowały parowanie z rdzenia.',
    immediateAction: 'Przenieś wyrób natychmiast do worka próżniowego!',
    recoveryProcedure: [
      'NATYCHMIAST wyjmij wyrób z komory dojrzewalniczej.',
      'Zapakuj baton szczelnie w woreczek próżniowy (moletowany) i zgrzej próżniowo.',
      'Umieść zapakowany wyrób w lodówce (temp. 4–6°C) na 7 do 14 dni.',
      'W warunkach próżniowych wilgoć z mokrego rdzenia przedyfunduje do twardej skórki, zmiękczając ją i wyrównując wilgotność.',
      'Po 14 dniach wyjmij wyrób, osusz papierem i powieś z powrotem w komorze z podwyższoną wilgotnością (82–85% RH).',
    ],
    recoverySteps: [
      'Zapakuj baton szczelnie próżniowo w worek moletowany.',
      'Przechowuj w chłodziarce 4°C przez 10-14 dni dla redystrybucji wilgoci.',
      'Wznów dojrzewanie przy podwyższonej wilgotności 82-84% RH.',
    ],
    preventiveRule: 'Nigdy nie przekraczaj ubytku 3.0%/dobę w pierwszych 5 dobach procesu.',
    prevention: 'Utrzymuj 80-85% RH i minimalną cyrkulację powietrza w pierwszych 7 dniach.',
    isSalvageable: true,
    salvageInstructions: {
      vacuumEquilibrationDays: 10,
      targetChamberRh: 84,
    },
  },
  {
    id: 'too_salty',
    defectKey: 'oversalted',
    title: 'Przesolenie po peklowaniu',
    symptom: 'Wyrób jest zbyt słony po wyjęciu z peklowania',
    cause: 'Zbyt wysokie stężenie solanki lub za długi czas peklowania bez bilansu wagowego.',
    severity: 'minor',
    rootCause: 'Zbyt wysokie stężenie solanki lub przetrzymanie mięsa w soli bez nastrzyku wyrównawczego.',
    immediateAction: 'Kąpiel w zimnej wodzie odsalającej (<4°C).',
    recoveryProcedure: [
      'Wymocz mięso w dużej ilości zimnej wody (<10°C).',
      'Wymieniaj wodę na świeżą co 45 minut.',
      'Po wymoczeniu odetnij cienki plasterek i zrób próbę smażenia na patelni.',
      'Odwieś mięso w chłodzie na 12 godzin (osadzanie) do wyrównania stężenia soli.',
    ],
    recoverySteps: [
      'Kąpiel w zimnej wodzie z lodem (3L wody na 1kg mięsa).',
      'Wymiana wody co 60 minut.',
      'Próba smażenia przed dalszą obróbką cieplną.',
    ],
    preventiveRule: 'Stosuj metodę próżniową EQ Dry (dokładnie 2.0–2.2% soli na wagę mięsa).',
    prevention: 'Stosuj peklowanie równowagowe EQ ze ściśle odmierzoną solą.',
    isSalvageable: true,
  },
  {
    id: 'green_black_mold',
    defectKey: 'green_black_mold',
    title: 'Groźna Obca Pleśń (Zielona / Czarna / Żółta)',
    symptom: 'Zielone, czarne lub jaskrawożółte kłaczki na powierzchni wędliny',
    cause: 'Skażenie komory dzikimi zarodnikami Aspergillus / Penicillium przy braku flory ochronnej.',
    severity: 'critical',
    rootCause: 'Skażenie zarodnikami dzikich pleśni przy zbyt wysokiej wilgotności (>90% RH) i braku cyrkulacji.',
    immediateAction: 'BEZWZGLĘDNA DYSKWALIFIKACJA I UTYLIZACJA WYROBU!',
    recoveryProcedure: [
      'Wyrób należy BEZWZGLĘDNIE ZUTYLIZOWAĆ.',
      'Mykotoksyny wnikają w głąb struktury mięsa na kilka centymetrów.',
      'Nie odkrawaj spleśniałych kawałków!',
      'Zdezynfekuj komorę alkoholem 70%.',
    ],
    recoverySteps: [
      'Natychmiast wyrzuć spleśniały wyrób do utylizacji.',
      'Dokładnie zdezynfekuj całą komorę i haki 70% alkoholem izopropylowym.',
    ],
    preventiveRule: 'Zaszczepiaj wędliny czystą kulturą Penicillium nalgiovense.',
    prevention: 'Stosuj szczepienie kulturami starterowymi Bactoferm M-EK-4.',
    isSalvageable: false,
  },
  {
    id: 'white_mold_doubt',
    defectKey: 'white_coating',
    title: 'Biały Nalot (Pleśń Szlachetna vs Sól)',
    symptom: 'Biały pyłek lub suchy nalot na osłonce',
    cause: 'Wytrącanie soli mineralnych lub rozwój dobroczynnej pleśni Bactoferm.',
    severity: 'minor',
    rootCause: 'Wytrącanie się kryształków soli/mleczanów lub rozwój pożądanej pleśni ochronnej.',
    immediateAction: 'Wykonaj test wilgotnej szmatki.',
    recoveryProcedure: [
      'Przetrzyj powierzchnię wilgotną szmatką: jeśli nalot natychmiast znika — to sól.',
      'Jeśli nalot jest śnieżnobiały, aksamitny o zapachu leśnych grzybów — to szlachetna pleśń ochronna.',
    ],
    recoverySteps: [
      'Sprawdź czy nalot znika po przetarciu wodą (sól) czy pozostaje aksamitny (Bactoferm).',
    ],
    preventiveRule: 'Utrzymuj stabilną wilgotność 75–80% RH.',
    prevention: 'Zapobiegaj nagłym skokom wilgotności komory.',
    isSalvageable: true,
  },
  {
    id: 'fat_rendering',
    defectKey: 'fat_rendering',
    title: 'Wytopiony Tłuszcz (Podciek Tłuszczowy)',
    symptom: 'Zbiorniki płynnego lub zastygłego żółtego tłuszczu pod osłonką',
    cause: 'Przegrzanie farszu podczas parzenia (>82°C) lub tępe noże wilka.',
    severity: 'moderate',
    rootCause: 'Przekroczenie temperatury 82°C podczas parzenia lub miażdżenie słoniny tępymi sitkami w wilku.',
    immediateAction: 'Zanurz wyrób w lodowatej wodzie (<10°C).',
    recoveryProcedure: [
      'Zanurz natychmiast wyrób w zimnej wodzie z lodem, aby zastudzić tłuszcz.',
      'Wyrób jest w 100% bezpieczny do spożycia po podsmażeniu lub w zupie.',
    ],
    recoverySteps: [
      'Schłodź wyrób szokowo w lodzie.',
      'Przeznacz kiełbasę do podsmażania lub gotowania (np. żurek).',
    ],
    preventiveRule: 'Nigdy nie przekraczaj 80°C wody parzenia!',
    prevention: 'Używaj ostrych sit w wilku i kontroluj temperaturę parzenia termometrem rdzeniowym.',
    isSalvageable: true,
  },
  {
    id: 'creosote_bitter',
    defectKey: 'sour_creosote',
    title: 'Kwaśny Posmak i Kreozot (Smolisty Nalot)',
    symptom: 'Gorzki, gryzący w gardło smak i ciemnobrązowe zacieki sadzy',
    cause: 'Wędzenie wilgotnego mięsa bez osuszenia do pergaminu lub palenie mokrego drewna.',
    severity: 'moderate',
    rootCause: 'Wędzenie wilgotnego mięsa bez wcześniejszego osuszenia do stanu pergaminu lub wędzenie mokrym drewnem przy zduszonym dopływie powietrza.',
    immediateAction: 'Zmyj osłonkę roztworem ciepłej wody z sodą oczyszczoną.',
    recoveryProcedure: [
      'Umyj osłonkę w ciepłej wodzie z dodatkiem sody oczyszczonej.',
      'Odwieś wyrób w ciepłym, suchym i przewiewnym pomieszczeniu na 24–48 godzin.',
      'Przed podaniem zdejmij osłonkę przed krojeniem plastrów.',
    ],
    recoverySteps: [
      'Zmyj osad sadzy gąbką z ciepłą wodą i sodą oczyszczoną.',
      'Przewietrz wyrób przez 24 godziny.',
    ],
    preventiveRule: 'Zawsze osuszaj mięso w wędzarni bez dymu do pergaminu!',
    prevention: 'Doprowadzaj powierzchnię do absolutnej suchości przed podaniem dymu.',
    isSalvageable: true,
  },
  {
    id: 'sour_ferment',
    defectKey: 'sour_creosote',
    title: 'Niepożądane Zakwaszenie Farszu',
    symptom: 'Nieprzyjemny, octowy lub zjełczały zapach',
    cause: 'Rozwój dzikich bakterii kwaszących przy zbyt powolnym dosuszaniu lub nieświeżym mięsie.',
    severity: 'critical',
    rootCause: 'Niewłaściwa temperatura fermentacji lub surowiec o podwyższonym pH.',
    immediateAction: 'Sprawdź zapach i strukturę pod kątem zepsucia gnilnego.',
    recoveryProcedure: [
      'Jeśli zapach jest gnilny lub nieprzyjemny — wyrób nie nadaje się do spożycia.',
    ],
    recoverySteps: [
      'Oceń zapach rdzenia wyrobu.',
    ],
    preventiveRule: 'Używaj wyłącznie świeżego mięsa ze sprawdzonego źródła.',
    prevention: 'Kontroluj temperaturę peklowania poniżej 6°C.',
    isSalvageable: false,
  },
];

/**
 * Zwraca diagnozę i procedurę ratunkową na podstawie identyfikatora wady.
 */
export function diagnoseDefect(defectId: string): DiagnosisResult | undefined {
  const found = BUTCHERY_DEFECTS_CATALOG.find((d) => d.id === defectId);
  if (found) return found;

  if (defectId === 'case_hardening' || defectId === 'too_salty' || defectId === 'white_mold_doubt') {
    return BUTCHERY_DEFECTS_CATALOG.find((d) => d.id === defectId);
  }
  return undefined;
}

/**
 * Evaluates symptoms and provides exact recovery procedure
 */
export function diagnoseButcheryDefect(params: {
  category: DefectCategory;
  meatWeightG?: number;
  thicknessCm?: number;
  isMoldFuzzyOrColored?: boolean;
}): DiagnosisResult {
  const { category, meatWeightG = 1500, thicknessCm = 6, isMoldFuzzyOrColored = false } = params;
  const match = BUTCHERY_DEFECTS_CATALOG.find((d) => d.defectKey === category) || BUTCHERY_DEFECTS_CATALOG[0];
  return match;
}
