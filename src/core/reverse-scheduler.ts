/**
 * CHARCUTIER — Reverse Process Scheduler Engine
 * Apps4Brew Studio (Adapted from Piekarz Reverse Scheduler)
 *
 * Answers the essential butcher question:
 * "I need my smoked/cooked ham or sausage ready on Sunday at 13:00.
 *  When exactly do I need to start curing, rinsing, hanging, drying, smoking and poaching?"
 */

export type ButcheryProcessType =
  | 'smoked_ham'           // Szynka wędzona i parzona (peklowanie mokre 8 dni + osadzanie + wędzenie + parzenie)
  | 'smoked_sausage'       // Kiełbasa swojska (peklowanie 2 dni + osadzanie + wędzenie + parzenie)
  | 'dry_cured_loin'       // Polędwica dojrzewająca (peklowanie EQ 10 dni + ociekanie + dojrzewanie 4-6 tyg.)
  | 'pastrami'             // Pastrami wołowe (peklowanie 7 dni + wędzenie + parowanie)
  | 'kabanos';             // Kabanosy (peklowanie 2 dni + osadzanie + wędzenie + pieczenie + suszenie)

export interface ScheduleStep {
  id: string;
  stepName: string;
  stepNameKey: string;
  startTimestamp: number;
  endTimestamp: number;
  durationMinutes: number;
  targetTempC?: number;
  instruction: string;
  instructionKey: string;
  isActionRequired: boolean;
}

export interface ReverseScheduleResult {
  targetDate: Date;
  processType: ButcheryProcessType;
  totalDurationDays: number;
  cureStartTimestamp: number;
  steps: ScheduleStep[];
}

/**
 * Standard durations and temperatures for butcher processes
 */
export const PROCESS_BLUEPRINTS: Record<
  ButcheryProcessType,
  {
    nameKey: string;
    stepsReversed: Array<{
      stepKey: string;
      stepName: string;
      durationMinutes: number;
      targetTempC?: number;
      instructionKey: string;
      instruction: string;
      isActionRequired: boolean;
    }>;
  }
> = {
  smoked_ham: {
    nameKey: 'scheduler.smokedHam',
    stepsReversed: [
      {
        stepKey: 'shock_cooling',
        stepName: 'Studzenie szokowe',
        durationMinutes: 15,
        targetTempC: 12,
        instructionKey: 'scheduler.instCooling',
        instruction: 'Kąpiel w lodowatej wodzie (<15°C) przez 15 min. Zapobiega marszczeniu i zamyka pory.',
        isActionRequired: true,
      },
      {
        stepKey: 'poaching',
        stepName: 'Parzenie w wodzie',
        durationMinutes: 100, // ~100 min to reach 68°C in core
        targetTempC: 78,
        instructionKey: 'scheduler.instPoaching',
        instruction: 'Woda 75–80°C (maks. 82°C!). Parz do osiągnięcia 68°C w rdzeniu wyrobu.',
        isActionRequired: true,
      },
      {
        stepKey: 'smoking_hot',
        stepName: 'Wędzenie dymem',
        durationMinutes: 180, // 3 hours
        targetTempC: 55,
        instructionKey: 'scheduler.instSmoking',
        instruction: 'Dymienie drewnem olchowym/bukowym w temp. 50–60°C do uzyskania pożądanej barwy.',
        isActionRequired: true,
      },
      {
        stepKey: 'drying',
        stepName: 'Osuszanie w wędzarni bez dymu',
        durationMinutes: 90, // 1.5 hour
        targetTempC: 50,
        instructionKey: 'scheduler.instDrying',
        instruction: 'Ciepłe powietrze z pełnym przewiewem. Powierzchnia musi być sucha jak pergamin!',
        isActionRequired: true,
      },
      {
        stepKey: 'hanging_osadzanie',
        stepName: 'Osadzanie i ociekanie w chłodzie',
        durationMinutes: 14 * 60, // 14 hours
        targetTempC: 6,
        instructionKey: 'scheduler.instHanging',
        instruction: 'Odwieś mięso w chłodnym, przewiewnym miejscu (4–8°C) na noc do osuszenia i wyrównania soli.',
        isActionRequired: false,
      },
      {
        stepKey: 'rinsing',
        stepName: 'Płukanie i moczenie z zalewy',
        durationMinutes: 90,
        targetTempC: 15,
        instructionKey: 'scheduler.instRinsing',
        instruction: 'Wyjmij szynkę z solanki, opłucz pod zimną wodą i wymocz przez 1-1.5 h w świeżej wodzie.',
        isActionRequired: true,
      },
      {
        stepKey: 'curing_wet',
        stepName: 'Peklowanie mokre z nastrzykiem',
        durationMinutes: 8 * 24 * 60, // 8 days
        targetTempC: 5,
        instructionKey: 'scheduler.instCuring',
        instruction: 'Zalewa peklująca w chłodzie (4–6°C). Nastrzyk domięśniowy 10% masy.',
        isActionRequired: true,
      },
    ],
  },
  smoked_sausage: {
    nameKey: 'scheduler.smokedSausage',
    stepsReversed: [
      {
        stepKey: 'shock_cooling',
        stepName: 'Studzenie szokowe',
        durationMinutes: 10,
        targetTempC: 12,
        instructionKey: 'scheduler.instCooling',
        instruction: 'Przelej kiełbasę zimną wodą i odwieś w przewiewnym miejscu do oschnięcia.',
        isActionRequired: true,
      },
      {
        stepKey: 'poaching',
        stepName: 'Parzenie kiełbasy',
        durationMinutes: 25,
        targetTempC: 75,
        instructionKey: 'scheduler.instPoaching',
        instruction: 'Parzenie w temp. 72–75°C przez 20–25 minut do osiągnięcia 72°C w rdzeniu.',
        isActionRequired: true,
      },
      {
        stepKey: 'smoking_hot',
        stepName: 'Wędzenie dymem ciepłym/gorącym',
        durationMinutes: 120, // 2 hours
        targetTempC: 55,
        instructionKey: 'scheduler.instSmoking',
        instruction: 'Dymienie w temp. 50–60°C do uzyskania złocisto-brązowej barwy.',
        isActionRequired: true,
      },
      {
        stepKey: 'drying',
        stepName: 'Osuszanie powierzchniowe',
        durationMinutes: 60,
        targetTempC: 45,
        instructionKey: 'scheduler.instDrying',
        instruction: 'Osuszanie w wędzarni z dużym przepływem powietrza bez dymu do pergaminu.',
        isActionRequired: true,
      },
      {
        stepKey: 'stuffing_osadzanie',
        stepName: 'Nadziewanie w jelita i osadzanie',
        durationMinutes: 4 * 60, // 4 hours
        targetTempC: 12,
        instructionKey: 'scheduler.instStuffing',
        instruction: 'Napełnij jelita wieprzowe 28/30 mm, odwieś kije w chłodzie na 3–5 godzin.',
        isActionRequired: true,
      },
      {
        stepKey: 'curing_meat',
        stepName: 'Peklowanie mięsa krojonego',
        durationMinutes: 48 * 60, // 48 hours (2 days)
        targetTempC: 5,
        instructionKey: 'scheduler.instCuringMeat',
        instruction: 'Pokrój mięso na kawałki 3-4 cm, wymieszaj z peklosolą i trzymaj 48h w 4–6°C.',
        isActionRequired: true,
      },
    ],
  },
  dry_cured_loin: {
    nameKey: 'scheduler.dryCuredLoin',
    stepsReversed: [
      {
        stepKey: 'ready',
        stepName: 'Degustacja i pakowanie',
        durationMinutes: 10,
        instructionKey: 'scheduler.instReady',
        instruction: 'Wyrób osiągnął 35% ubytku wagi. Gotowy do krojenia na cieniutkie plastry!',
        isActionRequired: true,
      },
      {
        stepKey: 'maturing_chamber',
        stepName: 'Dojrzewanie w komorze (cel 35% ubytku)',
        durationMinutes: 28 * 24 * 60, // 28 days (~4 weeks)
        targetTempC: 12,
        instructionKey: 'scheduler.instMaturing',
        instruction: 'Komora dojrzewalnicza: 11–13°C, 75–82% RH. Regularne ważenie i kontrola ubytku.',
        isActionRequired: false,
      },
      {
        stepKey: 'surface_drying',
        stepName: 'Ociekanie i obsuszanie powierzchni',
        durationMinutes: 24 * 60, // 24 hours
        targetTempC: 8,
        instructionKey: 'scheduler.instSurfaceDrying',
        instruction: 'Wyjmij z woreczka próżniowego, opłucz, natrzyj przyprawami i powieś do oschnięcia.',
        isActionRequired: true,
      },
      {
        stepKey: 'eq_vacuum_cure',
        stepName: 'Peklowanie równowagowe w próżni (EQ)',
        durationMinutes: 10 * 24 * 60, // 10 days
        targetTempC: 4,
        instructionKey: 'scheduler.instEqCure',
        instruction: 'Zgrzany woreczek z 2.2% soli/peklosoli w lodówce. Obracaj co 2 dni.',
        isActionRequired: true,
      },
    ],
  },
  pastrami: {
    nameKey: 'scheduler.pastrami',
    stepsReversed: [
      {
        stepKey: 'steaming',
        stepName: 'Parowanie do miękkości',
        durationMinutes: 180, // 3 hours
        targetTempC: 95,
        instructionKey: 'scheduler.instSteaming',
        instruction: 'Gotuj na parze w garnku lub piecu do 93°C w rdzeniu (rozpuszczenie kolagenu).',
        isActionRequired: true,
      },
      {
        stepKey: 'smoking_crust',
        stepName: 'Wędzenie w dymie dębowym/hickory',
        durationMinutes: 300, // 5 hours
        targetTempC: 110,
        instructionKey: 'scheduler.instPastramiSmoke',
        instruction: 'Wędzenie gorące w 105–115°C do wytworzenia chrupiącego barku (do ~70°C w rdzeniu).',
        isActionRequired: true,
      },
      {
        stepKey: 'rubbing_crust',
        stepName: 'Gruba posypka przyprawowa (Rub)',
        durationMinutes: 60,
        instructionKey: 'scheduler.instPastramiRub',
        instruction: 'Grubo mielony czarny pieprz, prażona kolendra, czosnek i brązowy cukier.',
        isActionRequired: true,
      },
      {
        stepKey: 'desalting',
        stepName: 'Odsalanie w wodzie',
        durationMinutes: 180,
        instructionKey: 'scheduler.instDesalting',
        instruction: 'Wymocz mostek w zimnej wodzie przez 3 godziny, wymieniając wodę co godzinę.',
        isActionRequired: true,
      },
      {
        stepKey: 'curing_beef',
        stepName: 'Peklowanie zalewowe mostka wołowego',
        durationMinutes: 7 * 24 * 60, // 7 days
        targetTempC: 4,
        instructionKey: 'scheduler.instBeefCure',
        instruction: 'Mostek wołowy z nastrzykiem w zalewie peklującej przez 7 dni w chłodzie.',
        isActionRequired: true,
      },
    ],
  },
  kabanos: {
    nameKey: 'scheduler.kabanos',
    stepsReversed: [
      {
        stepKey: 'drying_ambient',
        stepName: 'Podsuszanie w temperaturze pokojowej',
        durationMinutes: 72 * 60, // 3 days
        targetTempC: 16,
        instructionKey: 'scheduler.instKabanosDry',
        instruction: 'Podsuszanie w 14–18°C i 65–75% RH do osiągnięcia kruchości i charakterystycznego trzasku.',
        isActionRequired: false,
      },
      {
        stepKey: 'baking_in_smoker',
        stepName: 'Dopieczenie w wędzarni',
        durationMinutes: 45,
        targetTempC: 85,
        instructionKey: 'scheduler.instKabanosBake',
        instruction: 'Podniesienie temperatury wędzarni do 85–90°C bez dymu do osiągnięcia 75°C w wyrobie.',
        isActionRequired: true,
      },
      {
        stepKey: 'smoking_warm',
        stepName: 'Wędzenie dymem ciepłym',
        durationMinutes: 150,
        targetTempC: 50,
        instructionKey: 'scheduler.instKabanosSmoke',
        instruction: 'Wędzenie dymem olchowo-bukowym w temp. 45–55°C do ciemnoczerwonego koloru.',
        isActionRequired: true,
      },
      {
        stepKey: 'drying_sheep',
        stepName: 'Osuszanie w wędzarni',
        durationMinutes: 45,
        targetTempC: 45,
        instructionKey: 'scheduler.instDrying',
        instruction: 'Osuszanie cienkich kabanosów w pełnym przewiewie do suchości.',
        isActionRequired: true,
      },
      {
        stepKey: 'stuffing_sheep',
        stepName: 'Nadziewanie w jelita baranie 20/22 mm',
        durationMinutes: 180,
        targetTempC: 12,
        instructionKey: 'scheduler.instStuffingSheep',
        instruction: 'Napełnianie delikatnych jelit baranich, podwieszanie na kijach.',
        isActionRequired: true,
      },
      {
        stepKey: 'curing_meat',
        stepName: 'Peklowanie farszu wieprzowego',
        durationMinutes: 48 * 60, // 2 days
        targetTempC: 5,
        instructionKey: 'scheduler.instCuringMeat',
        instruction: 'Peklowanie krojonego mięsa z pieprzem, kminkiem i gałką w chłodzie.',
        isActionRequired: true,
      },
    ],
  },
};

/**
 * Calculates complete timeline backwards from user's target completion date
 */
export function calculateReverseSchedule(
  processType: ButcheryProcessType,
  targetDate: Date
): ReverseScheduleResult {
  const blueprint = PROCESS_BLUEPRINTS[processType] || PROCESS_BLUEPRINTS.smoked_ham;
  const targetMs = targetDate.getTime();

  let currentEndMs = targetMs;
  const chronologicalSteps: ScheduleStep[] = [];

  for (const stepDef of blueprint.stepsReversed) {
    const durationMs = stepDef.durationMinutes * 60 * 1000;
    const startMs = currentEndMs - durationMs;

    chronologicalSteps.unshift({
      id: `${stepDef.stepKey}_${startMs}`,
      stepName: stepDef.stepName,
      stepNameKey: `scheduler.steps.${stepDef.stepKey}`,
      startTimestamp: startMs,
      endTimestamp: currentEndMs,
      durationMinutes: stepDef.durationMinutes,
      targetTempC: stepDef.targetTempC,
      instruction: stepDef.instruction,
      instructionKey: stepDef.instructionKey,
      isActionRequired: stepDef.isActionRequired,
    });

    currentEndMs = startMs;
  }

  const cureStartTimestamp = chronologicalSteps[0].startTimestamp;
  const totalDurationDays =
    Math.round(((targetMs - cureStartTimestamp) / (24 * 3600 * 1000)) * 10) / 10;

  return {
    targetDate,
    processType,
    totalDurationDays,
    cureStartTimestamp,
    steps: chronologicalSteps,
  };
}
