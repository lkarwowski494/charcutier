/**
 * CHARCUTIER — Unit Converter Unit & Property Tests
 * Apps4Brew Studio
 */

import * as fc from 'fast-check';
import {
  gramsToOunces,
  ouncesToGrams,
  gramsToPounds,
  poundsToGrams,
  mlToFluidOunces,
  fluidOuncesToMl,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  formatWeight,
  formatTemperature,
  formatVolume,
  parseWeightToGrams,
  parseTempToCelsius,
  wInKeep,
} from '../../src/utils/unit-converter';

describe('unit-converter: exact formulas', () => {
  test('wInKeep preserves raw input and prevents display drift (BR-TEST-005, RD-ENG-01)', () => {
    // Comma decimal input
    const resComma = wInKeep('12,5', 'kg');
    expect(resComma).toBe(12500);

    // Dot decimal input with prevBase preservation
    const resPreserved = wInKeep('2.8', 'lb', 1.25);
    expect(resPreserved).toBe(1.25);
  });
  test('converts 1000g to ~35.27 oz and ~2.20 lbs', () => {
    const oz = gramsToOunces(1000);
    const lbs = gramsToPounds(1000);
    expect(oz).toBeCloseTo(35.274, 2);
    expect(lbs).toBeCloseTo(2.2046, 2);
  });

  test('converts temperatures correctly (0C = 32F, 100C = 212F, -40C = -40F)', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(-40)).toBe(-40);
    expect(fahrenheitToCelsius(32)).toBe(0);
    expect(fahrenheitToCelsius(212)).toBe(100);
    expect(fahrenheitToCelsius(-40)).toBe(-40);
  });

  test('converts volumes correctly (1000 ml = ~33.81 fl oz)', () => {
    expect(mlToFluidOunces(1000)).toBeCloseTo(33.814, 2);
    expect(fluidOuncesToMl(33.814)).toBeCloseTo(1000, 0);
  });

  test('formats weight based on unit system', () => {
    expect(formatWeight(500, 'metric')).toBe('500.0 g');
    expect(formatWeight(1500, 'metric')).toBe('1.50 kg');
    expect(formatWeight(1500, 'metric', { forceGrams: true })).toBe('1500.0 g');

    // Imperial
    expect(formatWeight(250, 'imperial')).toContain('oz');
    expect(formatWeight(1500, 'imperial')).toContain('lbs');
  });

  test('formats temperature correctly', () => {
    expect(formatTemperature(12.5, 'metric')).toBe('12.5°C');
    expect(formatTemperature(12.5, 'imperial')).toBe('54.5°F');
  });

  test('formats volume correctly', () => {
    expect(formatVolume(500, 'metric')).toBe('500 ml');
    expect(formatVolume(1500, 'metric')).toBe('1.5 L');
    expect(formatVolume(1000, 'imperial')).toContain('fl oz');
  });

  test('parses weight to grams accurately', () => {
    expect(parseWeightToGrams(500, 'g')).toBe(500);
    expect(parseWeightToGrams(2.5, 'kg')).toBe(2500);
    expect(parseWeightToGrams(1, 'oz')).toBeCloseTo(28.35, 2);
    expect(parseWeightToGrams(2, 'lbs')).toBeCloseTo(907.18, 2);
  });

  test('parses temperature to celsius accurately', () => {
    expect(parseTempToCelsius(68, 'C')).toBe(68);
    expect(parseTempToCelsius(154.4, 'F')).toBeCloseTo(68, 1);
  });
});

describe('unit-converter: fast-check property tests (invariants)', () => {
  test('roundtrip: grams -> ounces -> grams is invariant within epsilon', () => {
    fc.assert(
      fc.property(fc.double({ min: 0.1, max: 100000, noNaN: true }), (g) => {
        const roundtrip = ouncesToGrams(gramsToOunces(g));
        return Math.abs(roundtrip - g) < 1e-6;
      })
    );
  });

  test('roundtrip: grams -> pounds -> grams is invariant within epsilon', () => {
    fc.assert(
      fc.property(fc.double({ min: 0.1, max: 100000, noNaN: true }), (g) => {
        const roundtrip = poundsToGrams(gramsToPounds(g));
        return Math.abs(roundtrip - g) < 1e-6;
      })
    );
  });

  test('roundtrip: celsius -> fahrenheit -> celsius is invariant within epsilon', () => {
    fc.assert(
      fc.property(fc.double({ min: -50, max: 200, noNaN: true }), (c) => {
        const roundtrip = fahrenheitToCelsius(celsiusToFahrenheit(c));
        return Math.abs(roundtrip - c) < 1e-6;
      })
    );
  });
});
