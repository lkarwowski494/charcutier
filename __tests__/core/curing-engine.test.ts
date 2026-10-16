/**
 * CHARCUTIER — Curing Engine & P0 Safety Guards Unit & Property Tests
 * Apps4Brew Studio
 */

import * as fc from 'fast-check';
import {
  calculateNitritePpm,
  validateThermalSafety,
  calculateBrineDensity,
  estimateCuringDays,
  calculateCuringRecipe,
  calculateHamMakerRecipe,
  CURE_SALT_SPECS,
} from '../../src/core/curing-engine';

describe('curing-engine: PPM Guard & Nitrite Safety', () => {
  test('Polska Peklosól (0.6% NaNO2): 22g on 1000g meat yields 132 PPM (Safe Zone 100-150 PPM)', () => {
    const result = calculateNitritePpm(22, 'peklosol_pl', 1000);
    expect(result.ppm).toBe(132);
    expect(result.status).toBe('safe');
    expect(result.isToxic).toBe(false);
  });

  test('Prague Powder #1 (6.25% NaNO2): 2.16g on 1000g meat yields 135 PPM (Safe Zone)', () => {
    const result = calculateNitritePpm(2.16, 'cure_1', 1000);
    expect(result.ppm).toBe(135);
    expect(result.status).toBe('safe');
    expect(result.isToxic).toBe(false);
  });

  test('CRITICAL HAZARD: Mistaking Cure #1 for Polish Peklosól (22g Cure #1 on 1kg) yields 1375 PPM (>200 PPM Toxic)', () => {
    const result = calculateNitritePpm(22, 'cure_1', 1000);
    expect(result.ppm).toBe(1375);
    expect(result.status).toBe('toxic');
    expect(result.isToxic).toBe(true);
    expect(result.statusKey).toBe('calculator.ppmStatusToxic');
  });

  test('calculates max recommended grams to reach safe limit of 150 PPM', () => {
    const peklosolMax = calculateNitritePpm(0, 'peklosol_pl', 1000).maxRecommendedGrams;
    // 150 mg / 6 mg/g = 25 g
    expect(peklosolMax).toBe(25);

    const cure1Max = calculateNitritePpm(0, 'cure_1', 1000).maxRecommendedGrams;
    // 150 mg / 62.5 mg/g = 2.4 g
    expect(cure1Max).toBe(2.4);
  });
});

describe('curing-engine: P0 Thermal Nitrosamine Blocker', () => {
  test('strictly forbids Cure #2 (Prague Powder #2) in thermal processing above 75°C', () => {
    const safeCheck = validateThermalSafety('cure_2', 18); // raw dry curing
    expect(safeCheck.safe).toBe(true);

    const hotCheck = validateThermalSafety('cure_2', 80); // water poaching / baking
    expect(hotCheck.safe).toBe(false);
    expect(hotCheck.warningKey).toBe('calculator.saltpeterWarmWarning');
  });

  test('strictly forbids pure Saltpeter (KNO3) in thermal processing above 75°C', () => {
    const hotCheck = validateThermalSafety('saltpeter', 78);
    expect(hotCheck.safe).toBe(false);
    expect(hotCheck.warningKey).toBe('calculator.saltpeterWarmWarning');
  });

  test('permits Polish Peklosól and Cure #1 in thermal processing (up to 180°C)', () => {
    expect(validateThermalSafety('peklosol_pl', 80).safe).toBe(true);
    expect(validateThermalSafety('cure_1', 85).safe).toBe(true);
  });
});

describe('curing-engine: Brine Density & Baumé / Salometer', () => {
  test('calculates Baumé and Salometer for 10% brine (100g salt in 900ml water)', () => {
    const result = calculateBrineDensity(100, 900);
    expect(result.salinityPct).toBe(10);
    expect(result.baume).toBeCloseTo(9.7, 0);
    expect(result.salometer).toBeCloseTo(37.9, 0);
  });

  test('handles zero values safely', () => {
    const result = calculateBrineDensity(0, 0);
    expect(result.baume).toBe(0);
    expect(result.salometer).toBe(0);
  });
});

describe('curing-engine: Master Recipe Generator', () => {
  test('generates 1-Tap EQ dry recipe with Polish peklosól', () => {
    const recipe = calculateCuringRecipe({
      meatWeightG: 1500,
      cureType: 'eq_dry',
      cureSaltType: 'peklosol_pl',
      targetSalinityPct: 2.2,
    });

    expect(recipe.totalSaltG).toBe(33); // 1500 * 0.022
    expect(recipe.cureSaltG).toBe(33);
    expect(recipe.pureSaltG).toBe(0);
    expect(recipe.calculatedPpm).toBe(132);
    expect(recipe.ppmStatus).toBe('safe');
    expect(recipe.nitrosamineRisk).toBe(false);
    expect(recipe.estimatedDays).toBeGreaterThanOrEqual(6);
  });

  test('generates recipe with Cure #1 and splits cure salt from pure salt', () => {
    const recipe = calculateCuringRecipe({
      meatWeightG: 2000,
      cureType: 'eq_dry',
      cureSaltType: 'cure_1',
      targetSalinityPct: 2.2,
    });

    expect(recipe.totalSaltG).toBe(44); // 2000 * 0.022
    // needed ~135 PPM: 4.3 g Cure #1
    expect(recipe.cureSaltG).toBeCloseTo(4.3, 1);
    expect(recipe.pureSaltG).toBeCloseTo(40, 0);
    expect(recipe.calculatedPpm).toBeCloseTo(134.4, 1);
    expect(recipe.ppmStatus).toBe('safe');
  });

  test('flags nitrosamineRisk if Cure #2 is chosen with high heat process', () => {
    const recipe = calculateCuringRecipe({
      meatWeightG: 1000,
      cureType: 'eq_dry',
      cureSaltType: 'cure_2',
      plannedMaxTempC: 80, // poaching
    });

    expect(recipe.nitrosamineRisk).toBe(true);
  });

  test('supports 50/50 mix of peklosol and pure non-iodized salt (BR-PEKL-007)', () => {
    const recipe = calculateCuringRecipe({
      meatWeightG: 1000,
      cureType: 'eq_dry',
      cureSaltType: 'peklosol_pl',
      targetSalinityPct: 2.2, // 22g total salt
      cureSaltRatio: 0.5,     // 50% peklosol, 50% pure salt
    });

    expect(recipe.totalSaltG).toBe(22);
    expect(recipe.cureSaltG).toBe(11);
    expect(recipe.pureSaltG).toBe(11);
    expect(recipe.calculatedPpm).toBe(66); // 11g * 0.006 * 1000 = 66 PPM
    expect(recipe.ppmStatus).toBe('safe');
  });

  test('calculates Szynkowar (Ham Maker) poultry recipe with 74°C target and gelatin broth (BR-PEKL-012)', () => {
    const hamMaker = calculateHamMakerRecipe({
      capacityKg: 1.5,
      meatType: 'poultry',
      saltRatioPct: 1.8,
      cureSaltRatio: 0.8,
    });

    expect(hamMaker.capacityKg).toBe(1.5);
    expect(hamMaker.meatWeightG).toBe(1500);
    expect(hamMaker.totalSaltG).toBe(27); // 1500 * 0.018 = 27g
    expect(hamMaker.cureSaltG).toBe(21.6); // 27 * 0.8 = 21.6g
    expect(hamMaker.pureSaltG).toBe(5.4);
    expect(hamMaker.recommendedWaterMl).toBe(60); // 1.5kg * 40ml = 60ml
    expect(hamMaker.springTension).toBe('light');
    expect(hamMaker.targetCoreTempC).toBe(74); // Poultry safety barrier
    expect(hamMaker.waterBathTempC).toBe(78);
  });

  test('calculates wet brine and wet injection recipes with water and injection volumes', () => {
    const wetRecipe = calculateCuringRecipe({
      meatWeightG: 2000,
      cureType: 'wet_injection',
      cureSaltType: 'peklosol_pl',
      waterRatioPct: 40,
      injectionRatioPct: 10,
    });
    expect(wetRecipe.waterMl).toBe(800); // 40% of 2000g
    expect(wetRecipe.injectionMl).toBe(200); // 10% of 2000g
    expect(wetRecipe.estimatedDays).toBeGreaterThan(0);
  });

  test('calculates traditional saltpeter (KNO3) recipe', () => {
    const saltpeterRecipe = calculateCuringRecipe({
      meatWeightG: 1000,
      cureType: 'eq_dry',
      cureSaltType: 'saltpeter',
      targetSalinityPct: 2.2,
    });
    expect(saltpeterRecipe.cureSaltG).toBe(0.4); // 0.35 g/kg rounded
    expect(saltpeterRecipe.pureSaltG).toBe(22);
  });

  test('estimateCuringDays estimates days for wet_brine and wet_injection', () => {
    const brineDays = estimateCuringDays(2000, 'wet_brine', 8);
    const injectionDays = estimateCuringDays(2000, 'wet_injection', 8);
    expect(brineDays).toBeGreaterThan(0);
    expect(injectionDays).toBeGreaterThan(0);
  });
});

describe('curing-engine: Fast-Check Invariants', () => {
  test('PPM is monotonically non-decreasing with cure salt mass', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 50, noNaN: true }),
        fc.double({ min: 1, max: 50, noNaN: true }),
        fc.double({ min: 500, max: 5000, noNaN: true }),
        (salt1, salt2, meat) => {
          const sMin = Math.min(salt1, salt2);
          const sMax = Math.max(salt1, salt2);
          const ppm1 = calculateNitritePpm(sMin, 'peklosol_pl', meat).ppm;
          const ppm2 = calculateNitritePpm(sMax, 'peklosol_pl', meat).ppm;
          return ppm1 <= ppm2;
        }
      )
    );
  });
});
