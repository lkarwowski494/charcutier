/**
 * CHARCUTIER — Precision Unit Converter
 * Apps4Brew Studio (Strict Metric & Imperial Conversions)
 */

import { UnitSystem } from '../types';

// Constants
export const GRAMS_PER_OZ = 28.349523125;
export const GRAMS_PER_LB = 453.59237;
export const ML_PER_FL_OZ = 29.5735295625;
export const ML_PER_GALLON = 3785.411784;

/**
 * Converts grams to ounces
 */
export function gramsToOunces(grams: number): number {
  return grams / GRAMS_PER_OZ;
}

/**
 * Converts ounces to grams
 */
export function ouncesToGrams(ounces: number): number {
  return ounces * GRAMS_PER_OZ;
}

/**
 * Converts grams to pounds
 */
export function gramsToPounds(grams: number): number {
  return grams / GRAMS_PER_LB;
}

/**
 * Converts pounds to grams
 */
export function poundsToGrams(pounds: number): number {
  return pounds * GRAMS_PER_LB;
}

/**
 * Converts milliliters to US fluid ounces
 */
export function mlToFluidOunces(ml: number): number {
  return ml / ML_PER_FL_OZ;
}

/**
 * Converts US fluid ounces to milliliters
 */
export function fluidOuncesToMl(flOz: number): number {
  return flOz * ML_PER_FL_OZ;
}

/**
 * Converts Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Converts Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Formats weight for display based on user preference
 * If metric: grams (e.g. "1500 g" or "1.50 kg" if >= 1000g)
 * If imperial: lbs and oz (e.g. "3.31 lbs" or "12.5 oz")
 */
export function formatWeight(
  grams: number,
  system: UnitSystem,
  options?: { forceGrams?: boolean; precision?: number }
): string {
  const precision = options?.precision ?? 1;

  if (system === 'metric') {
    if (options?.forceGrams || grams < 1000) {
      return `${grams.toFixed(precision === 0 ? 0 : 1)} g`;
    }
    return `${(grams / 1000).toFixed(2)} kg`;
  }

  // Imperial
  if (grams < 453.59) {
    const oz = gramsToOunces(grams);
    return `${oz.toFixed(precision)} oz`;
  }
  const lbs = gramsToPounds(grams);
  return `${lbs.toFixed(2)} lbs`;
}

/**
 * Formats temperature for display
 */
export function formatTemperature(
  celsius: number,
  system: UnitSystem,
  precision: number = 1
): string {
  if (system === 'metric') {
    return `${celsius.toFixed(precision)}°C`;
  }
  const fahrenheit = celsiusToFahrenheit(celsius);
  return `${fahrenheit.toFixed(precision)}°F`;
}

/**
 * Formats liquid volume
 */
export function formatVolume(
  ml: number,
  system: UnitSystem,
  precision: number = 1
): string {
  if (system === 'metric') {
    if (ml >= 1000) {
      return `${(ml / 1000).toFixed(precision)} L`;
    }
    return `${Math.round(ml)} ml`;
  }
  const flOz = mlToFluidOunces(ml);
  return `${flOz.toFixed(precision)} fl oz`;
}

/**
 * Converts user input to grams according to selected unit
 */
export function parseWeightToGrams(
  value: number,
  unit: 'g' | 'kg' | 'oz' | 'lbs'
): number {
  switch (unit) {
    case 'g':
      return value;
    case 'kg':
      return value * 1000;
    case 'oz':
      return ouncesToGrams(value);
    case 'lbs':
      return poundsToGrams(value);
    default:
      return value;
  }
}

/**
 * Converts temperature input to Celsius
 */
export function parseTempToCelsius(
  value: number,
  unit: 'C' | 'F'
): number {
  return unit === 'C' ? value : fahrenheitToCelsius(value);
}

export function roundTo(val: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * RD-ENG-01 & BR-TEST-005: Konwersja wejściowa bez dryfu zaokrągleń (wInKeep)
 * Zachowuje dokładną wartość bazową prevBase, jeżeli sformatowana liczba w jednostce wyświetlania
 * zgadza się po zaokrągleniu do 0.1 z liczbą wpisaną przez użytkownika.
 */
export function wInKeep(txt: string, unit: string, prevBase?: number): number {
  if (typeof txt !== 'string') return prevBase ?? 0;
  const normalized = txt.replace(',', '.').trim();
  const xIn = parseFloat(normalized);
  if (isNaN(xIn) || !isFinite(xIn)) {
    return prevBase ?? 0;
  }

  const u = unit.toLowerCase().trim();
  let cu = 1;
  const isFahrenheit = u === '°f' || u === 'f';

  if (u === 'lb' || u === 'lbs') {
    cu = 2.20462262185;
  } else if (u === 'oz') {
    cu = 0.03527396195;
  } else if (u === 'fl oz' || u === 'floz') {
    cu = 0.0338140227;
  } else if (u === 'kg') {
    cu = 0.001;
  } else {
    cu = 1;
  }

  if (prevBase !== undefined && prevBase > 0) {
    if (isFahrenheit) {
      const fPrev = roundTo((prevBase * 9) / 5 + 32, 1);
      if (roundTo(xIn, 1) === fPrev) {
        return prevBase;
      }
      return roundTo(((xIn - 32) * 5) / 9, 2);
    } else {
      const fPrev = roundTo(prevBase * cu, 1);
      if (roundTo(xIn, 1) === fPrev) {
        return prevBase;
      }
      return roundTo(xIn / cu, 2);
    }
  }

  if (isFahrenheit) {
    return roundTo(((xIn - 32) * 5) / 9, 2);
  }
  return roundTo(xIn / cu, 2);
}

