/**
 * CHARCUTIER — Pantry & Casing Assistant Engine
 * Apps4Brew Studio
 *
 * Implements:
 * - Precise sausage casing length calculator based on meat mass and caliber
 * - P0 Game & Trichinella verification protocol
 * - Fat balancing calculator for wild boar and lean cuts
 */

import { MeatType } from '../types';

export interface CasingCaliberSpec {
  caliberKey: string;
  name: string;
  avgDiameterMm: number;
  kgPerMeter: number;     // Typical filling weight per 1 linear meter
  metersPerKg: number;    // Linear meters required per 1 kg of meat filling
  bestFor: string;
}

export const CASING_SPECS: Record<string, CasingCaliberSpec> = {
  sheep_20_22: {
    caliberKey: 'sheep_20_22',
    name: 'Baranie 20/22 mm',
    avgDiameterMm: 21,
    kgPerMeter: 0.29,
    metersPerKg: 3.45,
    bestFor: 'Kabanosy, parówki, frankfurterki',
  },
  pork_28_30: {
    caliberKey: 'pork_28_30',
    name: 'Wieprzowe 28/30 mm',
    avgDiameterMm: 29,
    kgPerMeter: 0.58,
    metersPerKg: 1.72,
    bestFor: 'Kiełbasa polska, śląska, biała, jałowcowa',
  },
  pork_32_34: {
    caliberKey: 'pork_32_34',
    name: 'Wieprzowe 32/34 mm',
    avgDiameterMm: 33,
    kgPerMeter: 0.72,
    metersPerKg: 1.39,
    bestFor: 'Grube kiełbasy wędzone, wiejska, swojska',
  },
  beef_40_45: {
    caliberKey: 'beef_40_45',
    name: 'Wołowe wiankowe 40/45 mm',
    avgDiameterMm: 42.5,
    kgPerMeter: 1.20,
    metersPerKg: 0.83,
    bestFor: 'Krakowska sucha, żywiecka, czosnkowa',
  },
  collagen_55: {
    caliberKey: 'collagen_55',
    name: 'Białkowe / kolagenowe 55 mm',
    avgDiameterMm: 55,
    kgPerMeter: 2.10,
    metersPerKg: 0.48,
    bestFor: 'Szynkowa, krakowska, salami',
  },
};

export interface CasingCalculationResult {
  meatWeightKg: number;
  caliberKey: string;
  spec: CasingCaliberSpec;
  exactMeters: number;
  recommendedMeters: number; // +15% reserve for tying, twisting, ends
}

/**
 * Calculates necessary casing length in meters based on meat mass and caliber
 */
export function calculateCasingLength(
  meatWeightKg: number,
  caliberKey: string
): CasingCalculationResult {
  const spec = CASING_SPECS[caliberKey] || CASING_SPECS.pork_28_30;
  if (meatWeightKg <= 0) {
    return {
      meatWeightKg: 0,
      caliberKey,
      spec,
      exactMeters: 0,
      recommendedMeters: 0,
    };
  }

  const exactMeters = Math.round(meatWeightKg * spec.metersPerKg * 10) / 10;
  // +15% butchery reserve for ends, knotting, and segmenting
  const recommendedMeters = Math.round(exactMeters * 1.15 * 10) / 10;

  return {
    meatWeightKg,
    caliberKey,
    spec,
    exactMeters,
    recommendedMeters,
  };
}

/**
 * P0 Invariant: Game & Trichinella verification guard
 * Wild boar meat strictly requires official veterinary inspection (artificial digestion method)
 * to prevent trichinosis. Home freezing does NOT kill cold-resistant Trichinella britovi/nativa!
 */
export function validateGameSafety(
  meatType: MeatType,
  isVeterinaryTested: boolean
): { allowed: boolean; errorKey?: string } {
  if (meatType === 'wild_boar' && !isVeterinaryTested) {
    return {
      allowed: false,
      errorKey: 'calculator.trichinellaWarning',
    };
  }
  return { allowed: true };
}

/**
 * Calculates fat balancing (słonina addition) for lean game meat
 * To achieve desired target fat % (typically 25-30% for cured sausages)
 */
export function balanceMeatFat(
  leanMeatKg: number,
  leanMeatFatPct: number = 10,   // wild boar typically ~10% fat
  targetFatPct: number = 25       // target sausage fat %
): { backfatKg: number; totalBatchKg: number } {
  if (leanMeatKg <= 0) return { backfatKg: 0, totalBatchKg: 0 };
  const backfatFatPct = 90;       // pork backfat (słonina) is ~90% pure fat

  // Mass balance: (leanMeatKg * f_lean + backfatKg * f_fat) = (leanMeatKg + backfatKg) * f_target
  // backfatKg * (f_fat - f_target) = leanMeatKg * (f_target - f_lean)
  const numerator = leanMeatKg * (targetFatPct - leanMeatFatPct);
  const denominator = backfatFatPct - targetFatPct;

  if (denominator <= 0 || numerator <= 0) {
    return { backfatKg: 0, totalBatchKg: leanMeatKg };
  }

  const backfatKg = Math.round((numerator / denominator) * 100) / 100;
  const totalBatchKg = Math.round((leanMeatKg + backfatKg) * 100) / 100;

  return {
    backfatKg,
    totalBatchKg,
  };
}
