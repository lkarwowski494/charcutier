/**
 * CHARCUTIER — Batch Cost & Yield Calculator Unit Tests
 * Apps4Brew Studio
 */

import * as fc from 'fast-check';
import { calculateBatchCost } from '../../src/core/cost-calculator';

describe('cost-calculator: Batch Production Economics', () => {
  test('calculates accurate batch cost, shrinkage and yield cost for 5kg smoked ham', () => {
    const result = calculateBatchCost({
      rawMeatWeightKg: 5.0,
      rawMeatPricePerKg: 25, // 125 PLN
      cureAndSpicesCost: 15,
      casingsCost: 10,
      smokingWoodEnergyCost: 20,
      targetLossPct: 15, // 15% shrinkage -> 4.25 kg yield
      artisanalMarketPricePerKg: 75,
    });

    expect(result.totalBatchCost).toBe(170); // 125 + 15 + 10 + 20
    expect(result.waterLossWeightKg).toBe(0.75);
    expect(result.finalYieldWeightKg).toBe(4.25);
    expect(result.trueCostPerKgFinished).toBe(40.0); // 170 / 4.25
    expect(result.costPer100gSlice).toBe(4.0);

    // Market equivalent value: 4.25kg * 75 zł = 318.75 zł
    // Savings: 318.75 - 170 = 148.75 zł
    expect(result.marketBenchmarkTotal).toBe(318.75);
    expect(result.estimatedSavings).toBe(148.75);
    expect(result.savingsPercentage).toBe(47); // Math.round((148.75 / 318.75) * 100)
  });

  test('handles zero shrinkage (targetLossPct = 0)', () => {
    const result = calculateBatchCost({
      rawMeatWeightKg: 4.0,
      rawMeatPricePerKg: 25,
      cureAndSpicesCost: 0,
      casingsCost: 0,
      smokingWoodEnergyCost: 0,
      targetLossPct: 0,
    });

    expect(result.totalBatchCost).toBe(100);
    expect(result.waterLossWeightKg).toBe(0);
    expect(result.finalYieldWeightKg).toBe(4.0);
    expect(result.trueCostPerKgFinished).toBe(25);
  });

  test('handles zero weight edge case', () => {
    const result = calculateBatchCost({
      rawMeatWeightKg: 0,
      rawMeatPricePerKg: 30,
      cureAndSpicesCost: 0,
      casingsCost: 0,
      smokingWoodEnergyCost: 0,
      targetLossPct: 20,
    });

    expect(result.totalBatchCost).toBe(0);
    expect(result.finalYieldWeightKg).toBe(0);
  });

  test('property test: totalBatchCost is always the exact sum of components', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 1, max: 20, noNaN: true }),
        fc.float({ min: 1, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 50, noNaN: true }),
        fc.float({ min: 0, max: 50, noNaN: true }),
        fc.float({ min: 0, max: 50, noNaN: true }),
        (weight, price, spices, casings, energy) => {
          const res = calculateBatchCost({
            rawMeatWeightKg: weight,
            rawMeatPricePerKg: price,
            cureAndSpicesCost: spices,
            casingsCost: casings,
            smokingWoodEnergyCost: energy,
            targetLossPct: 20,
          });

          const expectedSum = Number((weight * price + spices + casings + energy).toFixed(2));
          expect(Math.abs(res.totalBatchCost - expectedSum)).toBeLessThanOrEqual(0.02);
          expect(res.trueCostPerKgFinished).toBeGreaterThanOrEqual(price);
        }
      )
    );
  });
});
