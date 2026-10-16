/**
 * CHARCUTIER — Smoking & Thermal Processing Assistant Unit Tests
 * Apps4Brew Studio
 */

import {
  getTargetCoreTemp,
  validatePhaseTransition,
  checkWaterBathTemp,
  isCoreTempReached,
  estimatePoachingMinutes,
} from '../../src/core/smoking-engine';

describe('smoking-engine: Phase Transitions & Guards', () => {
  test('P0 Parchment Blocker: blocks transition from drying to smoking until parchment surface is confirmed', () => {
    const unconfirmed = validatePhaseTransition('drying', 'smoking', { parchmentConfirmed: false });
    expect(unconfirmed.allowed).toBe(false);
    expect(unconfirmed.errorKey).toBe('smoking.dryingInstruction');

    const confirmed = validatePhaseTransition('drying', 'smoking', { parchmentConfirmed: true });
    expect(confirmed.allowed).toBe(true);
  });

  test('allows transitions between subsequent phases (smoking -> poaching -> cooling)', () => {
    expect(validatePhaseTransition('smoking', 'poaching').allowed).toBe(true);
    expect(validatePhaseTransition('poaching', 'cooling').allowed).toBe(true);
  });
});

describe('smoking-engine: P0 Thermal Safety & Water Bath Guard', () => {
  test('alerts if water bath temperature exceeds 82°C (prevents fat rendering)', () => {
    const safeWater = checkWaterBathTemp(78);
    expect(safeWater.isOverheating).toBe(false);

    const overheatedWater = checkWaterBathTemp(84);
    expect(overheatedWater.isOverheating).toBe(true);
    expect(overheatedWater.alertKey).toBe('smoking.waterTempAlert');
  });

  test('target core temperatures correspond to food safety standards', () => {
    expect(getTargetCoreTemp('pork_ham')).toBe(68);
    expect(getTargetCoreTemp('szynka')).toBe(68);
    expect(getTargetCoreTemp('pork_sausage')).toBe(72);
    expect(getTargetCoreTemp('kiełbasa')).toBe(72);
    expect(getTargetCoreTemp('poultry')).toBe(74);
    expect(getTargetCoreTemp('drób')).toBe(74);
  });

  test('verifies core temperature completion', () => {
    expect(isCoreTempReached(67, 68)).toBe(false);
    expect(isCoreTempReached(68, 68)).toBe(true);
    expect(isCoreTempReached(70, 68)).toBe(true);
  });

  test('estimates poaching duration based on diameter (1 min per 1 mm)', () => {
    expect(estimatePoachingMinutes(60)).toBe(60); // 60 mm = 60 minutes
    expect(estimatePoachingMinutes(32)).toBe(32); // 32 mm sausage = 32 minutes
  });
});
