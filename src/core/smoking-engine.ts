/**
 * CHARCUTIER — 4-Phase Smoking & Thermal Processing Assistant Engine
 * Apps4Brew Studio
 *
 * Implements:
 * - 4-Phase State Machine: 1. Drying (No smoke) -> 2. Smoking -> 3. Poaching/Baking -> 4. Shock Cooling
 * - P0 Parchment Blocker: Hard gate prohibiting smoke application until meat surface is dry
 * - P0 Fat Rendering Guard: Alert if poaching water exceeds 82°C (180°F)
 * - Target core temperature matrix by meat species
 */

import { SmokePhase, MeatType } from '../types';

export const MAX_SAFE_POACHING_WATER_TEMP_C = 82; // Above 82°C fat melts out, causing gelatin pockets
export const RECOMMENDED_POACHING_WATER_TEMP_C = 78;

export interface CoreTempTarget {
  species: MeatType | string;
  targetCoreTempC: number;
  descriptionKey: string;
}

export const TARGET_CORE_TEMPERATURES: Record<string, number> = {
  pork_ham: 68,       // Szynka, baleron (68°C)
  szynka: 68,
  baleron: 68,
  pork_sausage: 72,   // Kiełbasa parzona (70-72°C)
  kiełbasa: 72,
  kielbasa: 72,
  pork_loin: 64,      // Polędwica parzona (62-64°C, succulent)
  schab: 64,
  polędwica: 64,
  poledwica: 64,
  poultry: 74,        // Drób (74°C USDA requirement)
  drób: 74,
  drob: 74,
  beef: 62,           // Wołowina (60-62°C medium rare)
  wołowina: 62,
  wolowina: 62,
  wild_boar: 72,      // Dzik (72°C safe thermal threshold)
  dzik: 72,
  default: 70,
};

export const SMOKE_WOOD_PROFILES: Record<
  string,
  {
    nameKey: string;
    flavor: 'mild' | 'medium' | 'strong';
    colorKey: string;
    bestFor: MeatType[];
  }
> = {
  alder: {
    nameKey: 'smoking.woods.alder',
    flavor: 'medium',
    colorKey: 'złocisty do jasnobrązowego',
    bestFor: ['pork', 'poultry', 'beef', 'wild_boar'],
  },
  beech: {
    nameKey: 'smoking.woods.beech',
    flavor: 'mild',
    colorKey: 'jasnobrązowy',
    bestFor: ['pork', 'poultry', 'lamb'],
  },
  oak: {
    nameKey: 'smoking.woods.oak',
    flavor: 'strong',
    colorKey: 'ciemnobrązowy, głęboki',
    bestFor: ['beef', 'wild_boar', 'pork'],
  },
  cherry: {
    nameKey: 'smoking.woods.cherry',
    flavor: 'mild',
    colorKey: 'czerwonawo-mahoniowy',
    bestFor: ['pork', 'poultry'],
  },
  apple: {
    nameKey: 'smoking.woods.apple',
    flavor: 'mild',
    colorKey: 'złotobrązowy, słodkawy aromat',
    bestFor: ['pork', 'poultry'],
  },
  hickory: {
    nameKey: 'smoking.woods.hickory',
    flavor: 'strong',
    colorKey: 'intensywny dymny aromat',
    bestFor: ['beef', 'pork', 'wild_boar'],
  },
};

/**
 * Returns target internal core temperature based on cut or meat type
 */
export function getTargetCoreTemp(cutOrMeat: string): number {
  const normalized = cutOrMeat.toLowerCase().trim();
  for (const [key, temp] of Object.entries(TARGET_CORE_TEMPERATURES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return temp;
    }
  }
  return TARGET_CORE_TEMPERATURES.default;
}

/**
 * P0 Invariant: Validates transition between smoking phases.
 * Specifically blocks transition from 'drying' to 'smoking' unless parchment dry is confirmed!
 */
export function validatePhaseTransition(
  currentPhase: SmokePhase,
  nextPhase: SmokePhase,
  options: { parchmentConfirmed?: boolean } = {}
): { allowed: boolean; errorKey?: string } {
  if (currentPhase === 'drying' && nextPhase === 'smoking') {
    if (!options.parchmentConfirmed) {
      return {
        allowed: false,
        errorKey: 'smoking.dryingInstruction',
      };
    }
  }
  return { allowed: true };
}

/**
 * P0 Invariant: Checks poaching water temperature
 * Alerts if water temperature exceeds 82°C to prevent fat melting out and skin bursting
 */
export function checkWaterBathTemp(waterTempC: number): {
  isOverheating: boolean;
  alertKey?: string;
  currentTempC: number;
} {
  const isOverheating = waterTempC > MAX_SAFE_POACHING_WATER_TEMP_C;
  return {
    isOverheating,
    alertKey: isOverheating ? 'smoking.waterTempAlert' : undefined,
    currentTempC: waterTempC,
  };
}

/**
 * Checks whether product has reached safe internal core temperature
 */
export function isCoreTempReached(
  currentCoreTempC: number,
  targetCoreTempC: number
): boolean {
  return currentCoreTempC >= targetCoreTempC;
}

/**
 * Calculates required poaching time estimate based on product thickness (rule: 1 min per 1 mm diameter at 75-80°C)
 */
export function estimatePoachingMinutes(diameterMm: number): number {
  if (diameterMm <= 0) return 30;
  return Math.ceil(diameterMm * 1.0);
}
