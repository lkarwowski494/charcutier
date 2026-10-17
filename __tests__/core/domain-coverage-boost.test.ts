/**
 * CHARCUTIER — Domain Logic 100% Coverage Completeness Test Suite
 * Apps4Brew Studio (BR-TEST-002, BR-TEST-003)
 */

import {
  calculateNitritePpm,
  estimateCuringDays,
  calculateCuringRecipe,
  calculateHamMakerRecipe,
} from '../../src/core/curing-engine';


import {
  validateCustomSmokingProcedure,
} from '../../src/core/custom-equipment';
import {
  diagnoseDefect,
  diagnoseButcheryDefect,
} from '../../src/core/doctor-engine';
import {
  calculateCasingLength,
  balanceMeatFat,
} from '../../src/core/pantry-engine';
import {
  scalePresetToWeight,
  MASTERCLASS_PRESETS,
  MasterPreset,
} from '../../src/core/presets-data';
import {
  validateRecipeSafety,
  decodeRecipe,
  parseShareUrl,
  encodeRecipe,
  ShareableRecipe,
} from '../../src/core/recipe-share';
import {
  sanitizeSensoryProfile,
  calculateRadarCoordinates,
} from '../../src/core/sensory-radar';
import {
  getTargetCoreTemp,
  estimatePoachingMinutes,
} from '../../src/core/smoking-engine';
import {
  calculateWeightLossMetrics,
  calculateDailyLossRate,
  checkCaseHardening,
  estimateReadinessDate,
  checkFermentationSafety,
} from '../../src/core/weight-loss-engine';


describe('domain-coverage-boost: 100% core engine branches & functions', () => {
  describe('curing-engine edges', () => {
    test('calculateNitritePpm handles totalMass <= 0', () => {
      const res = calculateNitritePpm(10, 'peklosol_pl', 0, 0);
      expect(res.ppm).toBe(0);
      expect(res.status).toBe('safe');
      expect(res.maxRecommendedGrams).toBe(0);
    });

    test('estimateCuringDays handles zero meat weight and fallback cure type', () => {
      expect(estimateCuringDays(0, 'eq_dry')).toBe(0);
      const days = estimateCuringDays(2.0, 'unknown_cure' as any);
      expect(days).toBe(7);
    });

    test('calculateCuringRecipe handles saltpeter, wet_injection, and cure_1/cure_2', () => {
      const saltpeterRec = calculateCuringRecipe({
        meatWeightG: 1000,
        cureType: 'eq_dry',
        cureSaltType: 'saltpeter',
      });
      expect(saltpeterRec.cureSaltG).toBe(0.4);

      const wetInjRec = calculateCuringRecipe({
        meatWeightG: 1000,
        cureType: 'wet_injection',
        cureSaltType: 'cure_2',
      });
      expect(wetInjRec.injectionMl).toBe(100);
      expect(wetInjRec.waterMl).toBe(400);

      const cure1Rec = calculateCuringRecipe({
        meatWeightG: 1000,
        cureType: 'eq_dry',
        cureSaltType: 'cure_1',
      });
      expect(cure1Rec.cureSaltG).toBeGreaterThan(0);
    });

    test('calculateHamMakerRecipe handles poultry and pork', () => {
      const poultry = calculateHamMakerRecipe({ capacityKg: 1.5, meatType: 'poultry' });
      expect(poultry.springTension).toBe('light');
      expect(poultry.targetCoreTempC).toBe(74);

      const pork = calculateHamMakerRecipe({ capacityKg: 1.5, meatType: 'pork', saltRatioPct: 2.0, cureSaltRatio: 0.8 });
      expect(pork.springTension).toBe('medium');
      expect(pork.targetCoreTempC).toBe(68);
    });
  });

  describe('custom-equipment edges', () => {
    test('validateCustomSmokingProcedure catches empty phases and zero duration', () => {
      const res = validateCustomSmokingProcedure({
        id: 'proc_empty',
        title: 'Empty Procedure',
        description: 'Test',
        phases: [],
      });
      expect(res.valid).toBe(false);
      expect(res.errors).toContain('Procedure must contain at least one phase');

      const zeroDur = validateCustomSmokingProcedure({
        id: 'proc_zero_dur',
        title: 'Zero Dur',
        description: 'Test',
        phases: [
          { id: 'p1', name: 'Drying', durationMinutes: 0, targetTempC: 50, maxTempC: 60 },
        ],
      });
      expect(zeroDur.errors.some((e) => e.includes('must be positive'))).toBe(true);
    });

    test('validateCustomSmokingProcedure catches unrealistic temperatures and max < target', () => {
      const res = validateCustomSmokingProcedure({
        id: 'proc_bad_temp',
        title: 'Bad Temps',
        description: 'Test',
        phases: [
          {
            id: 'p1',
            name: 'Phase 1',
            durationMinutes: 60,
            targetTempC: 180,
            maxTempC: 150,
          },
          {
            id: 'p2',
            name: 'Phase 2',
            durationMinutes: 30,
            targetTempC: -10,
            maxTempC: 20,
          },
        ],
      });
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes('out of realistic range'))).toBe(true);
      expect(res.errors.some((e) => e.includes('max temperature cannot be lower'))).toBe(true);
    });
  });


  describe('doctor-engine edges', () => {
    test('diagnoseDefect finds defect in catalog and returns undefined for unknown', () => {
      expect(diagnoseDefect('case_hardening')).toBeDefined();
      expect(diagnoseDefect('non_existent_defect_id')).toBeUndefined();
    });

    test('diagnoseButcheryDefect falls back to default when category is unknown', () => {
      const res = diagnoseButcheryDefect({ category: 'unknown_cat' as any });
      expect(res).toBeDefined();
      expect(res.defectKey).toBeDefined();
    });
  });

  describe('pantry-engine edges', () => {
    test('calculateCasingLength uses default casing spec when unknown caliber is provided', () => {
      const res = calculateCasingLength(5, 'unknown_caliber');
      expect(res.exactMeters).toBeGreaterThan(0);
      expect(res.spec.name).toContain('Wieprzowe');
    });


    test('balanceMeatFat handles default fat percentages and non-positive weight', () => {
      const resDefault = balanceMeatFat(5);
      expect(resDefault.backfatKg).toBeGreaterThan(0);
      expect(resDefault.totalBatchKg).toBeGreaterThan(5);

      const resZero = balanceMeatFat(0);
      expect(resZero.backfatKg).toBe(0);
      expect(resZero.totalBatchKg).toBe(0);
    });
  });

  describe('presets-data edges', () => {
    test('scalePresetToWeight handles spices with gPerKg and with/without water', () => {
      const customPreset: MasterPreset = {
        ...MASTERCLASS_PRESETS[0],
        id: 'test_preset',
        waterRatioPct: 10,
        spices: [
          { name: 'Czosnek', gPerKg: 3.5 } as any,
          { name: 'Majeranek', gramsPerKg: 2.0 },
        ],
      };

      const scaled = scalePresetToWeight(customPreset, 2.0);
      expect(scaled.waterVolumeMl).toBe(200);
      expect(scaled.spices).toHaveLength(2);
      expect(scaled.spices[0].totalGrams).toBe(7);

      const noWaterPreset: MasterPreset = {
        ...customPreset,
        waterRatioPct: undefined,
      };
      const scaledNoWater = scalePresetToWeight(noWaterPreset, 2.0);
      expect(scaledNoWater.waterVolumeMl).toBeUndefined();
    });
  });

  describe('recipe-share edges', () => {
    test('validateRecipeSafety warns on low salt (<15), high salt (>45) and invalid peklosolRatio', () => {
      const lowSalt = validateRecipeSafety({
        name: 'Niska sól',
        saltGramsPerKg: 10,
        peklosolRatio: 1.5,
      });
      expect(lowSalt.warnings.some((w) => w.includes('<15 g/kg'))).toBe(true);
      expect(lowSalt.errors.some((e) => e.includes('0.0 - 1.0'))).toBe(true);

      const highSalt = validateRecipeSafety({
        name: 'Wysoka sól',
        saltGramsPerKg: 50,
        peklosolRatio: 0.5,
      });
      expect(highSalt.warnings.some((w) => w.includes('>45 g/kg'))).toBe(true);
    });

    test('validateRecipeSafety warns on low nitrite for dry-cured and target core temp out of range', () => {
      const dryCuredLowPpm = validateRecipeSafety({
        name: 'Dojrzewająca',
        category: 'dry_cured',
        saltGramsPerKg: 20,
        peklosolRatio: 0.1, // low ppm (<80)
        targetCoreTemp: 55, // out of range (<60)
      });
      expect(dryCuredLowPpm.warnings.some((w) => w.includes('Clostridium'))).toBe(true);
      expect(dryCuredLowPpm.warnings.some((w) => w.includes('docelowa temperatura'))).toBe(true);

      const highCoreTemp = validateRecipeSafety({
        name: 'Wysoka temp',
        saltGramsPerKg: 20,
        targetCoreTemp: 95,
      });
      expect(highCoreTemp.warnings.some((w) => w.includes('docelowa temperatura'))).toBe(true);
    });

    test('decodeRecipe and parseShareUrl handle malformed payloads and extra URL parameters', () => {
      const sampleRecipe: ShareableRecipe = {
        version: 1,
        id: 'rec_test',
        name: 'Przepis Testowy',
        category: 'cured_smoked',
        curingMethod: 'dry',
        meatType: 'pork',
        saltGramsPerKg: 20,
        peklosolRatio: 0.5,
        targetLossPercent: 10,
        spices: [],
        createdAt: new Date().toISOString(),
      };

      const encoded = encodeRecipe(sampleRecipe);
      const urlWithExtra = `charcutier://recipe?data=${encoded}&extra=123`;
      const parsedWithExtra = parseShareUrl(urlWithExtra);
      expect(parsedWithExtra.success).toBe(true);
      expect(parsedWithExtra.recipe?.name).toBe('Przepis Testowy');

      const noDataUrl = 'charcutier://recipe?param=none';
      expect(parseShareUrl(noDataUrl).success).toBe(false);

      const badData = parseShareUrl('charcutier://recipe?data=invalid_base64_json!@#$');
      expect(badData.success).toBe(false);

      const malformedJson = decodeRecipe(encodeURIComponent(Buffer.from('{"version":2}').toString('base64')));
      expect(malformedJson.success).toBe(false);

      // Catch error in parseShareUrl
      expect(parseShareUrl(null as any).success).toBe(false);

      // Test fallback when global btoa / atob is bypassed
      const origBtoa = (global as any).btoa;
      const origAtob = (global as any).atob;
      try {
        delete (global as any).btoa;
        delete (global as any).atob;
        const encFallback = encodeRecipe(sampleRecipe);
        expect(typeof encFallback).toBe('string');
        const decFallback = decodeRecipe(encFallback);
        expect(decFallback.success).toBe(true);
      } finally {
        (global as any).btoa = origBtoa;
        (global as any).atob = origAtob;
      }
    });
  });

  describe('sensory-radar edges', () => {
    test('sanitizeSensoryProfile preserves and trims tasting notes', () => {
      const profile = sanitizeSensoryProfile({
        salinity: 4,
        tastingNotes: '  Wyraźny aromat jałowca  ',
      });
      expect(profile.tastingNotes).toBe('Wyraźny aromat jałowca');
    });

    test('calculateRadarCoordinates outputs valid polygon points with axis labels', () => {
      const profile = sanitizeSensoryProfile({
        salinity: 5,
        smokiness: 4,
        acidity: 3,
        spiciness: 2,
        firmness: 4,
        succulence: 5,
      });

      const coords = calculateRadarCoordinates(profile, 100, 100, 80);
      expect(coords).toHaveLength(6);
      coords.forEach((point) => {
        expect(point.x).toBeGreaterThan(0);
        expect(point.y).toBeGreaterThan(0);
        expect(point.label).toBeDefined();
        expect(point.value).toBeGreaterThanOrEqual(1);
        expect(point.value).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('smoking-engine edges', () => {
    test('getTargetCoreTemp falls back to default for unknown meat or cut', () => {
      const defaultTemp = getTargetCoreTemp('nieznany_element_egzotyczny');
      expect(defaultTemp).toBe(70);
    });

    test('estimatePoachingMinutes returns default for non-positive diameter', () => {
      expect(estimatePoachingMinutes(0)).toBe(30);
      expect(estimatePoachingMinutes(-5)).toBe(30);
      expect(estimatePoachingMinutes(60)).toBe(60);
    });
  });

  describe('weight-loss-engine edges', () => {
    test('calculateWeightLossMetrics returns zeroed metrics when initialWeight <= 0', () => {
      const metrics = calculateWeightLossMetrics(0, 0);
      expect(metrics.initialWeightG).toBe(0);
      expect(metrics.lossGrams).toBe(0);
      expect(metrics.progressPct).toBe(0);
    });

    test('calculateDailyLossRate computes correct positive daily rate and handles sub-hour delta', () => {
      const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
      const rate = calculateDailyLossRate(1000, 980, 1000, twoDaysMs);
      expect(rate).toBe(1.0);

      const subHourMs = 30 * 60 * 1000;
      expect(calculateDailyLossRate(1000, 990, 1000, subHourMs)).toBe(0);

      expect(calculateDailyLossRate(1000, 1050, 1000, twoDaysMs)).toBe(0);
    });

    test('checkCaseHardening handles null chamberRhPct', () => {
      const res = checkCaseHardening(3.5, 3);
      expect(res.isCaseHardening).toBe(true);
      expect(res.rhPct).toBeNull();
    });

    test('estimateReadinessDate calculates remaining days based on recent weight logs', () => {
      const now = Date.now();
      const oneDay = 24 * 3600 * 1000;
      const logs = [
        { id: '1', batch_id: 'b', weight_g: 1000, loss_pct: 0, recorded_at: now - 3 * oneDay, daily_loss_rate: 0, case_hardening_flag: 0, temp_c: 12, rh_pct: 75, notes: null },
        { id: '2', batch_id: 'b', weight_g: 970, loss_pct: 3.0, recorded_at: now - 2 * oneDay, daily_loss_rate: 3, case_hardening_flag: 0, temp_c: 12, rh_pct: 75, notes: null },
        { id: '3', batch_id: 'b', weight_g: 940, loss_pct: 6.0, recorded_at: now - 1 * oneDay, daily_loss_rate: 3, case_hardening_flag: 0, temp_c: 12, rh_pct: 75, notes: null },
        { id: '4', batch_id: 'b', weight_g: 910, loss_pct: 9.0, recorded_at: now, daily_loss_rate: 3, case_hardening_flag: 0, temp_c: 12, rh_pct: 75, notes: null },
      ];

      const est = estimateReadinessDate(1000, 35.0, logs, now - 3 * oneDay);
      expect(est.daysRemaining).toBeGreaterThan(0);
      expect(est.estimatedTimestamp).toBeGreaterThan(now);
    });


    test('checkFermentationSafety classifies safe, in_progress, and stalled_danger', () => {
      const safe = checkFermentationSafety(5.1, 24);
      expect(safe.isSafe).toBe(true);
      expect(safe.status).toBe('safe');

      const inProgress = checkFermentationSafety(5.6, 24);
      expect(inProgress.isSafe).toBe(false);
      expect(inProgress.status).toBe('in_progress');

      const stalled = checkFermentationSafety(5.6, 80);
      expect(stalled.isSafe).toBe(false);
      expect(stalled.status).toBe('stalled_danger');
    });
  });
});
