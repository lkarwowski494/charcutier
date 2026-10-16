/**
 * CHARCUTIER — Curing & Nitrite Safety Engine
 * Apps4Brew Studio
 *
 * Implements:
 * - Equilibrium Dry Curing (EQ Dry)
 * - Wet Immersion Brining & Injection Math (Baumé & Salometer)
 * - P0 PPM Guard: Strict verification of NaNO2 in parts-per-million (USDA FSIS / EU 1333/2008)
 * - P0 Thermal Nitrosamine Blocker: Hard ban on Saltpeter (KNO3 / Cure #2) above 75°C
 * - Fick's Law diffusion estimation
 */

import { CureSaltType, CureType } from '../types';

/**
 * Standard Nitrite / Nitrate Mass Fractions
 */
export const CURE_SALT_SPECS: Record<
  CureSaltType,
  {
    name: string;
    nano2Ratio: number;   // Sodium Nitrite fraction
    kno3Ratio: number;    // Potassium Nitrate fraction
    naclRatio: number;    // Pure salt fraction
    maxSafeTempC: number; // Max thermal processing temp allowed
  }
> = {
  peklosol_pl: {
    name: 'Polska Peklosól (0.6% NaNO2)',
    nano2Ratio: 0.006,    // 0.6% NaNO2 (6,000 mg/kg)
    kno3Ratio: 0.0,
    naclRatio: 0.994,     // 99.4% NaCl
    maxSafeTempC: 180,    // Safe for cooking/poaching/baking
  },
  cure_1: {
    name: 'Prague Powder #1 / InstaCure #1 (6.25% NaNO2)',
    nano2Ratio: 0.0625,   // 6.25% NaNO2 (62,500 mg/kg)
    kno3Ratio: 0.0,
    naclRatio: 0.9375,    // 93.75% NaCl
    maxSafeTempC: 180,
  },
  cure_2: {
    name: 'Prague Powder #2 (6.25% NaNO2 + 4.0% KNO3)',
    nano2Ratio: 0.0625,
    kno3Ratio: 0.04,      // 4.0% KNO3
    naclRatio: 0.8975,
    maxSafeTempC: 75,     // Hard limit: NEVER heat above 75°C (nitrosamines NDMA)
  },
  saltpeter: {
    name: 'Saletra Potasowa (KNO3 czysta)',
    nano2Ratio: 0.0,
    kno3Ratio: 1.0,       // 100% KNO3
    naclRatio: 0.0,
    maxSafeTempC: 75,     // Hard limit: NEVER heat above 75°C
  },
};

export interface PpmCalculationResult {
  ppm: number;
  status: 'safe' | 'warning' | 'toxic';
  statusKey: string;
  maxRecommendedGrams: number;
  isToxic: boolean;
}

export interface CuringRecipeResult {
  meatWeightG: number;
  cureType: CureType;
  cureSaltType: CureSaltType;
  targetSalinityPct: number;
  totalSaltG: number;
  cureSaltG: number;
  pureSaltG: number;
  sugarG: number;
  waterMl: number;
  injectionMl: number;
  calculatedPpm: number;
  ppmStatus: 'safe' | 'warning' | 'toxic';
  brineBaume: number;
  brineSalometer: number;
  estimatedDays: number;
  nitrosamineRisk: boolean;
}

/**
 * P0 PPM Guard: Calculates active NaNO2 concentration in Parts Per Million (mg/kg)
 *
 * Formula: PPM = (cureSaltGrams * nano2Ratio * 1,000,000) / totalBatchMassGrams
 * Target USDA / EU safety range: 100 - 150 PPM.
 * Warning range: 151 - 200 PPM.
 * Toxic hazard: > 200 PPM.
 */
export function calculateNitritePpm(
  cureSaltGrams: number,
  cureSaltType: CureSaltType,
  meatGrams: number,
  waterGrams: number = 0
): PpmCalculationResult {
  const totalMassGrams = meatGrams + waterGrams;
  if (totalMassGrams <= 0) {
    return {
      ppm: 0,
      status: 'safe',
      statusKey: 'calculator.ppmStatusSafe',
      maxRecommendedGrams: 0,
      isToxic: false,
    };
  }

  const spec = CURE_SALT_SPECS[cureSaltType];
  const totalMassKg = totalMassGrams / 1000;

  // Calculate max safe grams to reach exactly 150 PPM
  const maxSafeNano2Mg = 150 * totalMassKg;
  const maxSafeNano2G = maxSafeNano2Mg / 1000;
  const maxRecommendedGrams =
    spec.nano2Ratio > 0 ? Math.round((maxSafeNano2G / spec.nano2Ratio) * 10) / 10 : 0;

  if (cureSaltGrams <= 0) {
    return {
      ppm: 0,
      status: 'safe',
      statusKey: 'calculator.ppmStatusSafe',
      maxRecommendedGrams,
      isToxic: false,
    };
  }

  const nano2Grams = cureSaltGrams * spec.nano2Ratio;
  const nano2Mg = nano2Grams * 1000;
  const ppm = Math.round((nano2Mg / totalMassKg) * 10) / 10;

  let status: 'safe' | 'warning' | 'toxic' = 'safe';
  let statusKey = 'calculator.ppmStatusSafe';

  if (ppm > 200) {
    status = 'toxic';
    statusKey = 'calculator.ppmStatusToxic';
  } else if (ppm > 150) {
    status = 'warning';
    statusKey = 'calculator.ppmStatusWarning';
  }

  return {
    ppm,
    status,
    statusKey,
    maxRecommendedGrams,
    isToxic: status === 'toxic',
  };
}

/**
 * P0 Invariant: Validates whether a curing salt can be safely used with given thermal process
 * Prevents carcinogenic nitrosamines (NDMA) from Potassium Nitrate (KNO3) above 75°C
 */
export function validateThermalSafety(
  cureSaltType: CureSaltType,
  maxProcessTempC: number
): { safe: boolean; warningKey?: string } {
  const spec = CURE_SALT_SPECS[cureSaltType];
  if (maxProcessTempC > spec.maxSafeTempC) {
    return {
      safe: false,
      warningKey: 'calculator.saltpeterWarmWarning',
    };
  }
  return { safe: true };
}

/**
 * Calculates Baumé degrees and Salometer degrees for wet immersion brine
 */
export function calculateBrineDensity(
  saltGrams: number,
  waterMl: number
): { baume: number; salometer: number; salinityPct: number } {
  if (waterMl <= 0 || saltGrams <= 0) {
    return { baume: 0, salometer: 0, salinityPct: 0 };
  }

  const totalBrineGrams = waterMl + saltGrams;
  const salinityPct = (saltGrams / totalBrineGrams) * 100;

  // Approximate specific gravity (density) of brine at 15.5°C
  const specificGravity = 1 + 0.0072 * salinityPct;

  // Baumé degrees: °Bé = 145 * (1 - 1 / specificGravity)
  const baume = Math.round(145 * (1 - 1 / specificGravity) * 10) / 10;

  // Salometer degrees: 100° Sal = 26.4% salinity (saturated NaCl at 15.5°C)
  const salometer = Math.round((salinityPct / 26.39) * 100 * 10) / 10;

  return {
    baume: Math.max(0, baume),
    salometer: Math.max(0, Math.min(100, salometer)),
    salinityPct: Math.round(salinityPct * 10) / 10,
  };
}

/**
 * Estimates curing duration based on Fick's Second Law of Diffusion and meat thickness
 */
export function estimateCuringDays(
  meatWeightG: number,
  cureType: CureType,
  thicknessCm: number = 6
): number {
  if (meatWeightG <= 0) return 0;
  const weightKg = meatWeightG / 1000;

  switch (cureType) {
    case 'eq_dry':
    case 'traditional_dry': {
      const radiusCm = Math.max(2, thicknessCm / 2);
      return Math.max(5, Math.ceil(radiusCm * 1.5 + 2));
    }
    case 'wet_injection': {
      return Math.max(3, Math.ceil(1 + weightKg * 1.2));
    }
    case 'wet_brine': {
      return Math.max(4, Math.ceil(2 + weightKg * 2.0));
    }
    default:
      return 7;
  }
}

/**
 * Master Curing Calculator (Unified 1-Tap & Pro engine)
 */
export function calculateCuringRecipe(options: {
  meatWeightG: number;
  cureType: CureType;
  cureSaltType: CureSaltType;
  targetSalinityPct?: number; // e.g. 2.2 for 2.2%
  sugarRatioPct?: number;     // e.g. 0.4 for 0.4%
  waterRatioPct?: number;     // e.g. 40 for 40% water in wet brine
  injectionRatioPct?: number; // e.g. 10 for 10% injection
  plannedMaxTempC?: number;   // e.g. 80 for poaching, 20 for dry-cured
  thicknessCm?: number;
}): CuringRecipeResult {
  const {
    meatWeightG,
    cureType,
    cureSaltType,
    targetSalinityPct = 2.2,
    sugarRatioPct = 0.4,
    waterRatioPct = 40,
    injectionRatioPct = 10,
    plannedMaxTempC = 20,
    thicknessCm = 6,
  } = options;

  const totalSaltG = Math.round((meatWeightG * (targetSalinityPct / 100)) * 10) / 10;
  const sugarG = Math.round((meatWeightG * (sugarRatioPct / 100)) * 10) / 10;

  let waterMl = 0;
  let injectionMl = 0;

  if (cureType === 'wet_brine' || cureType === 'wet_injection') {
    waterMl = Math.round(meatWeightG * (waterRatioPct / 100));
    if (cureType === 'wet_injection') {
      injectionMl = Math.round(meatWeightG * (injectionRatioPct / 100));
    }
  }

  let cureSaltG = 0;
  let pureSaltG = 0;

  if (cureSaltType === 'peklosol_pl') {
    cureSaltG = totalSaltG;
    pureSaltG = 0;
  } else if (cureSaltType === 'cure_1' || cureSaltType === 'cure_2') {
    const targetPpm = 135;
    const spec = CURE_SALT_SPECS[cureSaltType];
    const totalMassKg = (meatWeightG + waterMl) / 1000;
    const neededNano2Mg = targetPpm * totalMassKg;
    cureSaltG = Math.round((neededNano2Mg / (spec.nano2Ratio * 1000)) * 10) / 10;

    const naclFromCure = cureSaltG * spec.naclRatio;
    pureSaltG = Math.max(0, Math.round((totalSaltG - naclFromCure) * 10) / 10);
  } else if (cureSaltType === 'saltpeter') {
    cureSaltG = Math.round((meatWeightG / 1000) * 0.35 * 10) / 10;
    pureSaltG = totalSaltG;
  }

  const ppmResult = calculateNitritePpm(cureSaltG, cureSaltType, meatWeightG, waterMl);
  const brineMetrics = calculateBrineDensity(totalSaltG, waterMl);
  const estimatedDays = estimateCuringDays(meatWeightG, cureType, thicknessCm);
  const thermalSafety = validateThermalSafety(cureSaltType, plannedMaxTempC);

  return {
    meatWeightG,
    cureType,
    cureSaltType,
    targetSalinityPct,
    totalSaltG,
    cureSaltG,
    pureSaltG,
    sugarG,
    waterMl,
    injectionMl,
    calculatedPpm: ppmResult.ppm,
    ppmStatus: ppmResult.status,
    brineBaume: brineMetrics.baume,
    brineSalometer: brineMetrics.salometer,
    estimatedDays,
    nitrosamineRisk: !thermalSafety.safe,
  };
}
