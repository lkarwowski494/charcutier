/**
 * CHARCUTIER — Custom Equipment & Procedures Tests
 * Apps4Craft Studio Standard
 */

import {
  calculateCustomVesselRecipe,
  validateCustomSmokingProcedure,
  DEFAULT_WORKSHOP_VESSELS,
  CustomVessel,
  CustomSmokingProcedure,
} from '../../src/core/custom-equipment';

describe('custom-equipment engine', () => {
  test('calculateCustomVesselRecipe calculates correctly for custom 1.2 kg vessel', () => {
    const customVessel: CustomVessel = {
      id: 'custom_1',
      name: 'Niestandardowa Praska 1.2 kg',
      capacityKg: 1.2,
    };

    const recipe = calculateCustomVesselRecipe(customVessel, 'pork', 0.8);
    expect(recipe.meatWeightG).toBe(1140); // 1.2 * 1000 * 0.95
    expect(recipe.recommendedWaterMl).toBe(96); // 1.2 * 80
    expect(recipe.totalSaltG).toBe(22.8); // 1140 * 2.0%
    expect(recipe.cureSaltG).toBe(18.2); // 22.8 * 0.8
    expect(recipe.pureSaltG).toBe(4.6);
  });

  test('calculateCustomVesselRecipe handles poultry with lower salinity (1.8%)', () => {
    const customVessel: CustomVessel = {
      id: 'custom_poultry',
      name: 'Praska do Drobiu 2.0 kg',
      capacityKg: 2.0,
    };

    const recipe = calculateCustomVesselRecipe(customVessel, 'poultry', 0.8);
    expect(recipe.meatWeightG).toBe(1900);
    expect(recipe.targetSalinityPct).toBe(1.8);
    expect(recipe.totalSaltG).toBe(34.2);
  });

  test('calculateCustomVesselRecipe throws on non-positive capacity', () => {
    expect(() => {
      calculateCustomVesselRecipe({ id: 'err', name: 'Zero', capacityKg: 0 });
    }).toThrow('Vessel capacity must be greater than zero');
  });

  test('validateCustomSmokingProcedure validates valid custom procedure', () => {
    const procedure: CustomSmokingProcedure = {
      id: 'proc_1',
      title: 'Kiełbasa Krakowska Sucha — 3 Dni',
      description: 'Zimne dymienie olchowo-jałowcowe',
      phases: [
        {
          id: 'p1',
          name: 'Osuszanie',
          targetTempC: 35,
          maxTempC: 45,
          durationMinutes: 120,
          smokeDensity: 'none',
        },
        {
          id: 'p2',
          name: 'Dymienie zimne',
          targetTempC: 18,
          maxTempC: 22,
          durationMinutes: 360,
          woodType: 'juniper',
          smokeDensity: 'dense',
        },
      ],
    };

    const res = validateCustomSmokingProcedure(procedure);
    expect(res.valid).toBe(true);
    expect(res.errors.length).toBe(0);
  });

  test('validateCustomSmokingProcedure rejects empty title or invalid phases', () => {
    const invalidProcedure: CustomSmokingProcedure = {
      id: 'bad',
      title: '',
      description: 'Bad',
      phases: [
        {
          id: 'p1',
          name: 'Błąd temperatury',
          targetTempC: 90,
          maxTempC: 70, // max < target
          durationMinutes: -10, // negative duration
        },
      ],
    };

    const res = validateCustomSmokingProcedure(invalidProcedure);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThanOrEqual(2);
  });

  test('has default workshop vessels available', () => {
    expect(DEFAULT_WORKSHOP_VESSELS.length).toBeGreaterThanOrEqual(3);
    expect(DEFAULT_WORKSHOP_VESSELS.some((v) => v.capacityKg === 1.5)).toBe(true);
  });
});
