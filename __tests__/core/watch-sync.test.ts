/**
 * CHARCUTIER — Smartwatch Sync (Apple Watch & Garmin ConnectIQ) Unit Tests
 * Apps4Brew Studio
 */

import {
  createSmokingWatchSnapshot,
  createAgingWatchSnapshot,
  formatGarminSmokingPayload,
  formatGarminAgingPayload,
  formatLiveActivitySmokingPayload,
  handleWatchAction,
} from '../../src/services/watch-sync';

describe('watch-sync: Apple Watch & Garmin Companion Protocol', () => {
  test('creates smoking snapshot with accurate remaining time and alarms', () => {
    const snapshot = createSmokingWatchSnapshot({
      batchId: 'batch_smoke_1',
      batchName: 'Szynka Wędzona #4',
      phase: 'smoking',
      currentChamberTemp: 55,
      targetChamberTemp: 55,
      timerRemainingSeconds: 3600,
      timerTotalSeconds: 7200,
      isPaused: false,
    });

    expect(snapshot.batchId).toBe('batch_smoke_1');
    expect(snapshot.phase).toBe('smoking');
    expect(snapshot.phaseName).toBe('Dymienie');
    expect(snapshot.timerRemainingSeconds).toBe(3600);
    expect(snapshot.isCompleted).toBe(false);
    expect(snapshot.alertActive).toBe(false);
  });

  test('triggers steaming over-temperature alarm when poaching water exceeds 82°C', () => {
    const snapshot = createSmokingWatchSnapshot({
      batchId: 'batch_steam_1',
      batchName: 'Kiełbasa Parzona',
      phase: 'steaming',
      currentChamberTemp: 86,
      targetChamberTemp: 85,
      timerRemainingSeconds: 1200,
      timerTotalSeconds: 1800,
    });

    expect(snapshot.alertActive).toBe(true);
    expect(snapshot.alertMessage).toContain('82°C');
  });

  test('triggers target core temperature reached alarm', () => {
    const snapshot = createSmokingWatchSnapshot({
      batchId: 'batch_core_1',
      batchName: 'Boczek Parzony',
      phase: 'steaming',
      currentCoreTemp: 72,
      targetCoreTemp: 70,
      timerRemainingSeconds: 500,
      timerTotalSeconds: 1800,
    });

    expect(snapshot.alertActive).toBe(true);
    expect(snapshot.alertMessage).toContain('CEL OSIĄGNIĘTY');
  });

  test('formats Garmin ConnectIQ payload for smoking session', () => {
    const snapshot = createSmokingWatchSnapshot({
      batchId: 'batch_garmin_1',
      batchName: 'Polędwica Ciepła',
      phase: 'smoking',
      timerRemainingSeconds: 90, // 1:30
      timerTotalSeconds: 180,
    });

    const garmin = formatGarminSmokingPayload(snapshot);
    expect(garmin.app).toBe('CHARCUTIER');
    expect(garmin.mode).toBe('SMOKING');
    expect(garmin.title).toBe('Polędwica Ciepła');
    expect(garmin.primaryVal).toBe('1:30');
    expect(garmin.progressPercent).toBe(50);
  });

  test('creates aging snapshot and flags Case Hardening risk if daily loss > 3%/day', () => {
    const agingSnapshot = createAgingWatchSnapshot({
      batchId: 'batch_lonza_1',
      batchName: 'Lonza Dojrzewająca',
      curingType: 'dry',
      initialWeightGrams: 1000,
      currentWeightGrams: 850,
      targetLossPercent: 35,
      daysElapsed: 5,
      dailyLossRatePercent: 3.5, // > 3.0%/day
    });

    expect(agingSnapshot.currentLossPercent).toBe(15.0);
    expect(agingSnapshot.caseHardeningRisk).toBe('critical');

    const garminAging = formatGarminAgingPayload(agingSnapshot);
    expect(garminAging.mode).toBe('AGING');
    expect(garminAging.status).toBe('CASE HARDENING!');
    expect(garminAging.hasAlert).toBe(true);
  });

  test('handles watch-initiated actions (timers, snooze, phase change)', () => {
    const resultToggle = handleWatchAction({
      type: 'TOGGLE_TIMER',
      batchId: 'batch_1',
      timestamp: Date.now(),
    });
    expect(resultToggle.success).toBe(true);

    const resultTemp = handleWatchAction({
      type: 'LOG_CORE_TEMP',
      batchId: 'batch_1',
      timestamp: Date.now(),
      payload: { coreTemp: 68 },
    });
    expect(resultTemp.success).toBe(true);
    expect(resultTemp.message).toContain('68°C');
  });

  test('formats iOS 18 ActivityKit / Dynamic Island payload for Live Activity (BR-ZEG-004)', () => {
    const snapshot = createSmokingWatchSnapshot({
      batchId: 'batch_live_1',
      batchName: 'Szynka Staropolska',
      phase: 'smoking',
      currentChamberTemp: 55,
      currentCoreTemp: 62,
      targetCoreTemp: 68,
      timerRemainingSeconds: 2400,
      timerTotalSeconds: 7200,
      isPaused: false,
    });

    const liveActivity = formatLiveActivitySmokingPayload(snapshot, 'alder');
    expect(liveActivity.attributes.batchId).toBe('batch_live_1');
    expect(liveActivity.attributes.batchName).toBe('Szynka Staropolska');
    expect(liveActivity.attributes.woodType).toBe('alder');
    expect(liveActivity.attributes.targetCoreTempC).toBe(68);

    expect(liveActivity.contentState.phase).toBe('smoking');
    expect(liveActivity.contentState.currentChamberTempC).toBe(55);
    expect(liveActivity.contentState.currentCoreTempC).toBe(62);
    expect(liveActivity.contentState.timerRemainingSeconds).toBe(2400);
    expect(liveActivity.contentState.isPaused).toBe(false);
  });
});
