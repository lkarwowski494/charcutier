/**
 * CHARCUTIER — Pantry, Casing & Game Safety Unit Tests
 * Apps4Brew Studio
 */

import {
  calculateCasingLength,
  validateGameSafety,
  balanceMeatFat,
  CASING_SPECS,
} from '../../src/core/pantry-engine';

describe('pantry-engine: Casing Length Calculations', () => {
  test('calculates exact and +15% recommended length for 5kg pork in 28/30 mm hog casing', () => {
    // 28/30 mm casing: ~1.72 m / kg -> 5 * 1.72 = 8.6 m
    const result = calculateCasingLength(5, 'pork_28_30');
    expect(result.exactMeters).toBeCloseTo(8.6, 1);
    expect(result.recommendedMeters).toBeCloseTo(9.9, 1);
  });

  test('calculates casing length for sheep 20/22 mm (kabanosy): ~3.45 m / kg', () => {
    const result = calculateCasingLength(2, 'sheep_20_22');
    expect(result.exactMeters).toBeCloseTo(6.9, 1);
    expect(result.recommendedMeters).toBeCloseTo(7.9, 1);
  });

  test('calculates fibrous 55 mm for thick salami: ~0.48 m / kg', () => {
    const result = calculateCasingLength(10, 'collagen_55');
    expect(result.exactMeters).toBeCloseTo(4.8, 1);
  });
});

describe('pantry-engine: P0 Game & Trichinella Verification', () => {
  test('strictly blocks wild boar without verified veterinary testing', () => {
    const untested = validateGameSafety('wild_boar', false);
    expect(untested.allowed).toBe(false);
    expect(untested.errorKey).toBe('calculator.trichinellaWarning');

    const tested = validateGameSafety('wild_boar', true);
    expect(tested.allowed).toBe(true);
  });

  test('allows regular farm meat without special wild game testing block', () => {
    expect(validateGameSafety('pork', false).allowed).toBe(true);
    expect(validateGameSafety('beef', false).allowed).toBe(true);
  });
});

describe('pantry-engine: Fat Balancing Calculator for Wild Boar', () => {
  test('calculates required pork backfat (słonina) to reach 25% fat with lean game (10% fat)', () => {
    // 5 kg wild boar (10% fat) + backfat (90% fat) -> target 25% fat
    // backfat = 5 * (25 - 10) / (90 - 25) = 5 * 15 / 65 = 1.15 kg
    const balance = balanceMeatFat(5, 10, 25);
    expect(balance.backfatKg).toBeCloseTo(1.15, 2);
    expect(balance.totalBatchKg).toBeCloseTo(6.15, 2);
  });

  test('handles zero and negative edge cases safely', () => {
    expect(calculateCasingLength(0, 'pork_28_30')).toEqual({
      meatWeightKg: 0,
      caliberKey: 'pork_28_30',
      spec: CASING_SPECS.pork_28_30,
      exactMeters: 0,
      recommendedMeters: 0,
    });

    expect(balanceMeatFat(0, 10, 25)).toEqual({ backfatKg: 0, totalBatchKg: 0 });
    // When meat already has more fat than target, no backfat needed
    expect(balanceMeatFat(5, 30, 20)).toEqual({ backfatKg: 0, totalBatchKg: 5 });
  });
});
