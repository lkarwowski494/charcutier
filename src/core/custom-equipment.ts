/**
 * CHARCUTIER — Custom Equipment & Artisanal Procedures Engine
 * Apps4Craft Studio Standard
 *
 * Grants complete craftsman freedom:
 * - Define custom vessels / ham cookers of any capacity (e.g. 1.2 kg, 2.5 kg)
 * - Define custom multi-phase thermal processing & smoking procedures
 */

export interface CustomVessel {
  id: string;
  name: string;
  capacityKg: number;
  shape?: 'cylindrical' | 'rectangular' | 'oval';
  wallThicknessMm?: number;
  notes?: string;
}

export interface CustomSmokePhase {
  id: string;
  name: string;
  targetTempC: number;
  maxTempC: number;
  durationMinutes: number;
  woodType?: string;
  smokeDensity?: 'none' | 'light' | 'dense';
  description?: string;
}

export interface CustomSmokingProcedure {
  id: string;
  title: string;
  description: string;
  phases: CustomSmokePhase[];
}

/**
 * Calculates optimal water and cure salt requirements for any custom vessel
 */
export function calculateCustomVesselRecipe(
  vessel: CustomVessel,
  meatType: 'pork' | 'poultry' | 'beef' = 'pork',
  cureSaltRatio: number = 0.8
) {
  if (vessel.capacityKg <= 0) {
    throw new Error('Vessel capacity must be greater than zero');
  }

  // Recommended meat fill is 95% of vessel capacity
  const meatWeightG = Math.round(vessel.capacityKg * 1000 * 0.95);
  // Water needed for compression and thermal conduction in vessel: ~80 ml per kg
  const recommendedWaterMl = Math.round(vessel.capacityKg * 80);

  // Target salinity based on meat type
  const targetSalinityPct = meatType === 'poultry' ? 1.8 : 2.0;
  const totalSaltG = Math.round(((meatWeightG * targetSalinityPct) / 100) * 10) / 10;

  const cureSaltG = Math.round(totalSaltG * cureSaltRatio * 10) / 10;
  const pureSaltG = Math.round((totalSaltG - cureSaltG) * 10) / 10;

  return {
    vesselId: vessel.id,
    meatWeightG,
    recommendedWaterMl,
    totalSaltG,
    cureSaltG,
    pureSaltG,
    targetSalinityPct,
  };
}

/**
 * Validates custom artisanal procedure ensuring biological and thermal safety
 */
export function validateCustomSmokingProcedure(procedure: CustomSmokingProcedure): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!procedure.title || procedure.title.trim().length === 0) {
    errors.push('Procedure must have a title');
  }

  if (!procedure.phases || procedure.phases.length === 0) {
    errors.push('Procedure must contain at least one phase');
  } else {
    procedure.phases.forEach((phase, index) => {
      if (phase.durationMinutes <= 0) {
        errors.push(`Phase ${index + 1} (${phase.name || 'unnamed'}): duration must be positive`);
      }
      if (phase.targetTempC < 0 || phase.targetTempC > 150) {
        errors.push(`Phase ${index + 1}: temperature ${phase.targetTempC}°C out of realistic range (0-150°C)`);
      }
      if (phase.maxTempC < phase.targetTempC) {
        errors.push(`Phase ${index + 1}: max temperature cannot be lower than target temperature`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Default preset vessels in the craftsman workshop
 */
export const DEFAULT_WORKSHOP_VESSELS: CustomVessel[] = [
  { id: 'vessel_biowin_15', name: 'Szynkowar Klasyczny 1.5 kg', capacityKg: 1.5, shape: 'cylindrical' },
  { id: 'vessel_biowin_30', name: 'Praska Rzemieślnicza 3.0 kg', capacityKg: 3.0, shape: 'rectangular' },
  { id: 'vessel_compact_08', name: 'Szynkowar Mini 0.8 kg', capacityKg: 0.8, shape: 'cylindrical' },
];
