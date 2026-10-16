/**
 * CHARCUTIER — Reactive Unit System Hook
 * Apps4Brew Studio (Strict Metric & Imperial Conversions)
 *
 * Implements:
 * - Persistent unit preference in SQLite app_settings ('metric' | 'imperial')
 * - Reactive listener pattern across all components
 * - Direct formatters for weight, temperature, and volume
 */

import { useState, useEffect, useCallback } from 'react';
import { getSetting, setSetting } from '../db/database';
import { UnitSystem } from '../types';
import {
  formatWeight as formatWeightUtil,
  formatTemperature as formatTempUtil,
  formatVolume as formatVolUtil,
} from '../utils/unit-converter';

let currentUnitSystem: UnitSystem = 'metric';
let isUnitInitialized = false;
const unitListeners = new Set<(unit: UnitSystem) => void>();

export async function refreshUnitSystem(): Promise<UnitSystem> {
  try {
    const raw = await getSetting('unit_system');
    if (raw === 'imperial' || raw === 'metric') {
      currentUnitSystem = raw;
    }
  } catch (err) {
    console.warn('Failed to read unit_system from DB:', err);
  } finally {
    isUnitInitialized = true;
    unitListeners.forEach((l) => {
      try {
        l(currentUnitSystem);
      } catch (e) {
        console.error('Error in unit listener:', e);
      }
    });
  }
  return currentUnitSystem;
}

export async function setUnitSystemPreference(unit: UnitSystem): Promise<void> {
  if (unit !== 'metric' && unit !== 'imperial') return;
  currentUnitSystem = unit;
  unitListeners.forEach((l) => {
    try {
      l(unit);
    } catch (e) {
      console.error('Error in unit listener:', e);
    }
  });
  try {
    await setSetting('unit_system', unit);
  } catch (err) {
    console.warn('Failed to save unit_system to DB:', err);
  }
}

export function useUnitSystem() {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(currentUnitSystem);

  useEffect(() => {
    const listener = (newUnit: UnitSystem) => {
      setUnitSystemState(newUnit);
    };
    unitListeners.add(listener);

    if (!isUnitInitialized) {
      refreshUnitSystem();
    } else {
      setUnitSystemState(currentUnitSystem);
    }

    return () => {
      unitListeners.delete(listener);
    };
  }, []);

  const setUnit = useCallback(async (newUnit: UnitSystem) => {
    await setUnitSystemPreference(newUnit);
  }, []);

  const formatWeight = useCallback(
    (grams: number, options?: { forceGrams?: boolean; precision?: number }) => {
      return formatWeightUtil(grams, unitSystem, options);
    },
    [unitSystem]
  );

  const formatTemperature = useCallback(
    (celsius: number, precision: number = 1) => {
      return formatTempUtil(celsius, unitSystem, precision);
    },
    [unitSystem]
  );

  const formatVolume = useCallback(
    (ml: number, precision: number = 1) => {
      return formatVolUtil(ml, unitSystem, precision);
    },
    [unitSystem]
  );

  return {
    unitSystem,
    setUnitSystem: setUnit,
    formatWeight,
    formatTemperature,
    formatVolume,
  };
}
