/**
 * CHARCUTIER — Serwis Synchronizacji Zegarków (Apple Watch & Garmin ConnectIQ)
 * Obsługuje kontrakty przesyłu danych dla watchOS (WatchConnectivity/WCSession)
 * oraz Garmin ConnectIQ JSON API podczas wędzenia, parzenia i kontroli dojrzewania.
 */

export interface WatchSmokingPhaseSnapshot {
  batchId: string;
  batchName: string;
  phase: 'drying' | 'smoking' | 'steaming' | 'cooling' | 'idle';
  phaseName: string;
  currentChamberTemp?: number;
  targetChamberTemp?: number;
  currentCoreTemp?: number;
  targetCoreTemp?: number;
  timerRemainingSeconds: number;
  timerTotalSeconds: number;
  isPaused: boolean;
  isCompleted: boolean;
  alertActive: boolean;
  alertMessage?: string;
  lastUpdatedTimestamp: number;
}

export interface WatchAgingSnapshot {
  batchId: string;
  batchName: string;
  curingType: 'wet' | 'dry' | 'equilibrium';
  daysElapsed: number;
  targetDays?: number;
  currentWeightGrams?: number;
  initialWeightGrams?: number;
  currentLossPercent: number;
  targetLossPercent: number;
  dailyLossRatePercent?: number;
  caseHardeningRisk: 'none' | 'warning' | 'critical';
  nextActionDate?: string;
  nextActionLabel?: string;
  lastUpdatedTimestamp: number;
}

export interface GarminCharcutierPayload {
  app: 'CHARCUTIER';
  v: 1;
  ts: number;
  mode: 'SMOKING' | 'AGING' | 'IDLE';
  title: string;
  status: string;
  primaryVal: string;
  secondaryVal?: string;
  progressPercent: number;
  hasAlert: boolean;
  alertText?: string;
}

export type WatchActionType =
  | 'TOGGLE_TIMER'
  | 'NEXT_PHASE'
  | 'SNOOZE_ALERT'
  | 'LOG_CORE_TEMP'
  | 'REFRESH_REQUEST';

export interface WatchIncomingAction {
  type: WatchActionType;
  batchId: string;
  timestamp: number;
  payload?: {
    coreTemp?: number;
    chamberTemp?: number;
  };
}

export interface WatchActionResult {
  success: boolean;
  action: WatchActionType;
  batchId: string;
  handledAt: number;
  message?: string;
}

/**
 * Tworzy zrzut stanu wędzenia/parzenia dla Apple Watch.
 */
export function createSmokingWatchSnapshot(params: {
  batchId: string;
  batchName: string;
  phase: 'drying' | 'smoking' | 'steaming' | 'cooling' | 'idle';
  currentChamberTemp?: number;
  targetChamberTemp?: number;
  currentCoreTemp?: number;
  targetCoreTemp?: number;
  timerRemainingSeconds: number;
  timerTotalSeconds: number;
  isPaused?: boolean;
}): WatchSmokingPhaseSnapshot {
  const isCompleted = params.timerRemainingSeconds <= 0 && params.timerTotalSeconds > 0;
  let alertActive = false;
  let alertMessage: string | undefined;

  // Sprawdzenie krytycznych alertów
  if (params.phase === 'steaming' && params.targetChamberTemp && params.targetChamberTemp > 82) {
    alertActive = true;
    alertMessage = 'ALARM: Woda > 82°C! Ryzyko wytopienia tłuszczu!';
  } else if (params.currentCoreTemp && params.targetCoreTemp && params.currentCoreTemp >= params.targetCoreTemp) {
    alertActive = true;
    alertMessage = `CEL OSIĄGNIĘTY: Temp. rdzenia ${params.currentCoreTemp}°C! Wyjmij wędlinę!`;
  }

  const phaseNames: Record<string, string> = {
    drying: 'Osuszanie',
    smoking: 'Dymienie',
    steaming: 'Parzenie',
    cooling: 'Studzenie',
    idle: 'Oczekiwanie',
  };

  return {
    batchId: params.batchId,
    batchName: params.batchName,
    phase: params.phase,
    phaseName: phaseNames[params.phase] || params.phase,
    currentChamberTemp: params.currentChamberTemp,
    targetChamberTemp: params.targetChamberTemp,
    currentCoreTemp: params.currentCoreTemp,
    targetCoreTemp: params.targetCoreTemp,
    timerRemainingSeconds: Math.max(0, params.timerRemainingSeconds),
    timerTotalSeconds: params.timerTotalSeconds,
    isPaused: params.isPaused ?? false,
    isCompleted,
    alertActive,
    alertMessage,
    lastUpdatedTimestamp: Date.now(),
  };
}

/**
 * Tworzy zrzut stanu dojrzewania i utraty wagi dla Apple Watch.
 */
export function createAgingWatchSnapshot(params: {
  batchId: string;
  batchName: string;
  curingType: 'wet' | 'dry' | 'equilibrium';
  initialWeightGrams: number;
  currentWeightGrams: number;
  targetLossPercent: number;
  daysElapsed: number;
  targetDays?: number;
  dailyLossRatePercent?: number;
  nextActionDate?: string;
  nextActionLabel?: string;
}): WatchAgingSnapshot {
  const weightDiff = params.initialWeightGrams - params.currentWeightGrams;
  const currentLossPercent =
    params.initialWeightGrams > 0
      ? Number(((weightDiff / params.initialWeightGrams) * 100).toFixed(1))
      : 0;

  let caseHardeningRisk: 'none' | 'warning' | 'critical' = 'none';
  if (params.dailyLossRatePercent !== undefined) {
    if (params.dailyLossRatePercent > 3.0) {
      caseHardeningRisk = 'critical';
    } else if (params.dailyLossRatePercent > 2.0) {
      caseHardeningRisk = 'warning';
    }
  }

  return {
    batchId: params.batchId,
    batchName: params.batchName,
    curingType: params.curingType,
    daysElapsed: params.daysElapsed,
    targetDays: params.targetDays,
    currentWeightGrams: params.currentWeightGrams,
    initialWeightGrams: params.initialWeightGrams,
    currentLossPercent,
    targetLossPercent: params.targetLossPercent,
    dailyLossRatePercent: params.dailyLossRatePercent,
    caseHardeningRisk,
    nextActionDate: params.nextActionDate,
    nextActionLabel: params.nextActionLabel,
    lastUpdatedTimestamp: Date.now(),
  };
}

/**
 * Konwertuje stan wędzenia na lekki format Garmin ConnectIQ JSON.
 */
export function formatGarminSmokingPayload(snapshot: WatchSmokingPhaseSnapshot): GarminCharcutierPayload {
  const mins = Math.floor(snapshot.timerRemainingSeconds / 60);
  const secs = snapshot.timerRemainingSeconds % 60;
  const timerStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  let progress = 0;
  if (snapshot.timerTotalSeconds > 0) {
    progress = Math.min(100, Math.round(((snapshot.timerTotalSeconds - snapshot.timerRemainingSeconds) / snapshot.timerTotalSeconds) * 100));
  }

  const primary = snapshot.currentCoreTemp !== undefined
    ? `${snapshot.currentCoreTemp}°C / ${snapshot.targetCoreTemp ?? '--'}°C`
    : timerStr;

  const secondary = snapshot.currentChamberTemp !== undefined
    ? `Komora: ${snapshot.currentChamberTemp}°C`
    : `Etap: ${snapshot.phaseName}`;

  return {
    app: 'CHARCUTIER',
    v: 1,
    ts: snapshot.lastUpdatedTimestamp,
    mode: 'SMOKING',
    title: snapshot.batchName,
    status: snapshot.phaseName.toUpperCase(),
    primaryVal: primary,
    secondaryVal: secondary,
    progressPercent: progress,
    hasAlert: snapshot.alertActive,
    alertText: snapshot.alertMessage,
  };
}

/**
 * Konwertuje stan dojrzewania na format Garmin ConnectIQ.
 */
export function formatGarminAgingPayload(snapshot: WatchAgingSnapshot): GarminCharcutierPayload {
  const progress = Math.min(100, Math.round((snapshot.currentLossPercent / snapshot.targetLossPercent) * 100));
  const primary = `-${snapshot.currentLossPercent}% / -${snapshot.targetLossPercent}%`;
  const secondary = `Dzień ${snapshot.daysElapsed}${snapshot.targetDays ? `/${snapshot.targetDays}` : ''}`;

  return {
    app: 'CHARCUTIER',
    v: 1,
    ts: snapshot.lastUpdatedTimestamp,
    mode: 'AGING',
    title: snapshot.batchName,
    status: snapshot.caseHardeningRisk === 'critical' ? 'CASE HARDENING!' : 'DOJRZEWANIE',
    primaryVal: primary,
    secondaryVal: secondary,
    progressPercent: progress,
    hasAlert: snapshot.caseHardeningRisk !== 'none',
    alertText: snapshot.caseHardeningRisk === 'critical'
      ? 'ALARM: Zbyt szybki spadek wagi! Zwiększ wilgotność!'
      : undefined,
  };
}

/**
 * Przetwarza zdarzenie odebrane z zegarka (Apple Watch / Garmin).
 */
export function handleWatchAction(action: WatchIncomingAction): WatchActionResult {
  const ts = Date.now();

  switch (action.type) {
    case 'TOGGLE_TIMER':
      return {
        success: true,
        action: action.type,
        batchId: action.batchId,
        handledAt: ts,
        message: 'Timer wędzenia przełączony z zegarka.',
      };
    case 'NEXT_PHASE':
      return {
        success: true,
        action: action.type,
        batchId: action.batchId,
        handledAt: ts,
        message: 'Przejście do kolejnego etapu obróbki cieplnej zatwierdzone z zegarka.',
      };
    case 'SNOOZE_ALERT':
      return {
        success: true,
        action: action.type,
        batchId: action.batchId,
        handledAt: ts,
        message: 'Alert wyciszony na 10 minut.',
      };
    case 'LOG_CORE_TEMP':
      return {
        success: true,
        action: action.type,
        batchId: action.batchId,
        handledAt: ts,
        message: `Zarejestrowano odczyt temperatury rdzenia: ${action.payload?.coreTemp}°C`,
      };
    case 'REFRESH_REQUEST':
    default:
      return {
        success: true,
        action: action.type,
        batchId: action.batchId,
        handledAt: ts,
        message: 'Odświeżono dane zegarka.',
      };
  }
}

export interface ActivityKitSmokingAttributes {
  batchId: string;
  batchName: string;
  woodType?: string;
  targetCoreTempC?: number;
  createdAt: number;
}

export interface ActivityKitSmokingContentState {
  phase: 'drying' | 'smoking' | 'steaming' | 'cooling' | 'idle';
  phaseName: string;
  currentChamberTempC?: number;
  currentCoreTempC?: number;
  timerRemainingSeconds: number;
  timerTotalSeconds: number;
  isPaused: boolean;
  alertActive: boolean;
  alertMessage?: string;
  updatedAt: number;
}

export interface LiveActivitySmokingPayload {
  attributes: ActivityKitSmokingAttributes;
  contentState: ActivityKitSmokingContentState;
}

/**
 * Generates an iOS 18 ActivityKit / Dynamic Island payload for live smoking sessions (BR-ZEG-004)
 */
export function formatLiveActivitySmokingPayload(
  snapshot: WatchSmokingPhaseSnapshot,
  woodType?: string
): LiveActivitySmokingPayload {
  return {
    attributes: {
      batchId: snapshot.batchId,
      batchName: snapshot.batchName,
      woodType,
      targetCoreTempC: snapshot.targetCoreTemp,
      createdAt: snapshot.lastUpdatedTimestamp,
    },
    contentState: {
      phase: snapshot.phase,
      phaseName: snapshot.phaseName,
      currentChamberTempC: snapshot.currentChamberTemp,
      currentCoreTempC: snapshot.currentCoreTemp,
      timerRemainingSeconds: snapshot.timerRemainingSeconds,
      timerTotalSeconds: snapshot.timerTotalSeconds,
      isPaused: snapshot.isPaused,
      alertActive: snapshot.alertActive,
      alertMessage: snapshot.alertMessage,
      updatedAt: snapshot.lastUpdatedTimestamp,
    },
  };
}
