/**
 * CHARCUTIER — Curated Masterclass Presets Unit Tests
 * Apps4Brew Studio (Conforming to BR-RECP-001)
 */

import {
  MASTERCLASS_PRESETS,
  getPresetById,
  getPresetsByCategory,
  scalePresetToWeight,
} from '../../src/core/presets-data';

describe('presets-data: Curated Charcuterie Master Recipes', () => {
  test('contains all 12 canonical masterclass presets defined in BR-RECP-001', () => {
    expect(MASTERCLASS_PRESETS.length).toBeGreaterThanOrEqual(12);

    const required12Ids = [
      'krakowska_sucha',
      'salami_milano',
      'poledwica_lososiowa',
      'szynka_tradycyjna',
      'boczek_wedzony',
      'kabanosy_staropolskie',
      'bresaola_wolowa',
      'pancetta_arrotolata',
      'szynkowar_drob',
      'lonzino_dojrzewajace',
      'biala_kielbasa',
      'baleron_wedzony',
    ];

    for (const reqId of required12Ids) {
      const found = getPresetById(reqId);
      expect(found).toBeDefined();
      expect(found!.id).toBe(reqId);
    }
  });

  test('retrieves preset by ID', () => {
    const ham = getPresetById('szynka_tradycyjna');
    expect(ham).toBeDefined();
    expect(ham!.name).toBe('Szynka Tradycyjna z Wędzarni');
    expect(ham!.curingMethod).toBe('wet');
    expect(ham!.targetCoreTemp).toBe(68);
  });

  test('salami milano contains T-SPX starter and pH guidelines', () => {
    const salami = getPresetById('salami_milano')!;
    expect(salami).toBeDefined();
    expect(salami.category).toBe('dry_cured');
    expect(salami.targetLossPct).toBe(35);
    expect(salami.spices.some((s) => s.name.includes('T-SPX'))).toBe(true);
    expect(salami.techniqueNotes).toContain('pH ≤ 5.3');
  });

  test('biala kielbasa uses pure non-iodized salt without nitrite (peklosolRatio = 0)', () => {
    const biala = getPresetById('biala_kielbasa')!;
    expect(biala).toBeDefined();
    expect(biala.peklosolRatio).toBe(0.0);
    expect(biala.targetCoreTemp).toBe(68);

    const scaled = scalePresetToWeight(biala, 5.0);
    expect(scaled.cureSaltGrams).toBe(0);
    expect(scaled.pureSaltGrams).toBe(95); // 19g * 5kg
  });

  test('szynkowar poultry ham enforces 74°C thermal biological safety', () => {
    const szynkowar = getPresetById('szynkowar_drob')!;
    expect(szynkowar).toBeDefined();
    expect(szynkowar.meatType).toBe('poultry');
    expect(szynkowar.targetCoreTemp).toBe(74);
  });

  test('filters presets by category', () => {
    const dryCured = getPresetsByCategory('dry_cured');
    expect(dryCured.length).toBeGreaterThan(0);
    expect(dryCured.every((p) => p.category === 'dry_cured')).toBe(true);

    const smoked = getPresetsByCategory('cured_smoked');
    expect(smoked.length).toBeGreaterThan(0);
  });

  test('scales recipe ingredients accurately to any meat weight', () => {
    const lonza = getPresetById('lonza_wieprzowa')!;
    // lonza base is 1kg: salt 28g/kg, peklosol 100% (28g)
    const scaled3kg = scalePresetToWeight(lonza, 3.0);

    expect(scaled3kg.meatWeightKg).toBe(3.0);
    expect(scaled3kg.totalSaltGrams).toBe(84); // 28 * 3
    expect(scaled3kg.pureSaltGrams).toBe(0);
    expect(scaled3kg.cureSaltGrams).toBe(84);

    // Spices scaling
    for (let i = 0; i < lonza.spices.length; i++) {
      expect(scaled3kg.spices[i].totalGrams).toBe(Number((lonza.spices[i].gramsPerKg * 3.0).toFixed(2)));
    }
  });

  test('all presets follow safe biological parameters (salinity and temperature)', () => {
    for (const preset of MASTERCLASS_PRESETS) {
      expect(preset.saltGramsPerKg).toBeGreaterThanOrEqual(16);
      expect(preset.saltGramsPerKg).toBeLessThanOrEqual(40);
      expect(preset.peklosolRatio).toBeGreaterThanOrEqual(0);
      expect(preset.peklosolRatio).toBeLessThanOrEqual(1);

      if (preset.category === 'cured_smoked' || preset.category === 'steamed') {
        expect(preset.targetCoreTemp).toBeDefined();
        expect(preset.targetCoreTemp).toBeGreaterThanOrEqual(65);
        expect(preset.targetCoreTemp).toBeLessThanOrEqual(95);
      }
    }
  });
});
