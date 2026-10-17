/**
 * Property-Based Tests (fast-check) for Curing Math & Invariants
 * Standards: BR-TEST-006, BR-TEST-008, BR-TEST-009, RD-ENG-01, RD-ENG-02
 */

import fc from 'fast-check';
import {
  calculateNitritePpm,
  calculateCuringRecipe,
  calculateBrineDensity,
  CURE_SALT_SPECS,
} from '../src/core/curing-engine';
import { calculateWeightLossMetrics } from '../src/core/weight-loss-engine';
import { CureSaltType, CureType } from '../src/types';
import { PROP_SEED, PROP_RUNS } from './prop-seed';

describe('BR-TEST-006 & BR-TEST-009: Fast-Check Curing Domain Properties', () => {
  const fcOptions = { seed: PROP_SEED, numRuns: PROP_RUNS };

  test('Invariant 1: Nitrite PPM is strictly non-negative and monotonic with salt dose', () => {
    const stats = { safe: 0, warning: 0, toxic: 0 };
    const saltTypes: CureSaltType[] = ['peklosol_pl', 'cure_1', 'cure_2', 'saltpeter'];

    fc.assert(
      fc.property(
        fc.constantFrom(...saltTypes),
        fc.double({ min: 100, max: 20000, noNaN: true }), // meat weight (g)
        fc.double({ min: 0, max: 200, noNaN: true }),     // cure salt 1 (g)
        fc.double({ min: 0, max: 200, noNaN: true }),     // cure salt 2 (g)
        (saltType, meatG, dose1, dose2) => {
          const res1 = calculateNitritePpm(dose1, saltType, meatG);
          const res2 = calculateNitritePpm(dose2, saltType, meatG);

          expect(res1.ppm).toBeGreaterThanOrEqual(0);
          expect(Number.isFinite(res1.ppm)).toBe(true);

          if (saltType === 'saltpeter') {
            // Saltpeter has 0% NaNO2
            expect(res1.ppm).toBe(0);
          } else {
            if (dose1 < dose2) {
              expect(res1.ppm).toBeLessThanOrEqual(res2.ppm);
            }
          }

          // Invariant: Status matches threshold
          if (res1.ppm > 200) {
            expect(res1.status).toBe('toxic');
            stats.toxic++;
          } else if (res1.ppm > 150) {
            expect(res1.status).toBe('warning');
            stats.warning++;
          } else {
            expect(res1.status).toBe('safe');
            stats.safe++;
          }
        }
      ),
      fcOptions
    );

    // BR-TEST-009: Anti-vacuous truth assertion
    expect(stats.safe).toBeGreaterThan(0);
    expect(stats.toxic).toBeGreaterThan(0);
  });

  test('Invariant 2: Conservation of total salt in Curing Recipe calculation', () => {
    const cureTypes: CureType[] = ['eq_dry', 'traditional_dry', 'wet_brine', 'wet_injection'];
    const cureSaltTypes: CureSaltType[] = ['peklosol_pl', 'cure_1', 'cure_2'];

    fc.assert(
      fc.property(
        fc.double({ min: 200, max: 10000, noNaN: true }),  // meat mass 200g - 10kg
        fc.constantFrom(...cureTypes),
        fc.constantFrom(...cureSaltTypes),
        fc.double({ min: 1.0, max: 3.5, noNaN: true }),    // 1% - 3.5% salinity
        (meatG, cureType, cureSaltType, salinityPct) => {
          const recipe = calculateCuringRecipe({
            meatWeightG: meatG,
            cureType,
            cureSaltType,
            targetSalinityPct: salinityPct,
          });

          // Invariant: Total salt is positive and finite
          expect(recipe.totalSaltG).toBeGreaterThan(0);
          expect(Number.isFinite(recipe.totalSaltG)).toBe(true);
          expect(recipe.cureSaltG).toBeGreaterThanOrEqual(0);
          expect(recipe.pureSaltG).toBeGreaterThanOrEqual(0);

          // For peklosól, cureSaltG + pureSaltG == totalSaltG (with rounding delta <= 0.2g)
          if (cureSaltType === 'peklosol_pl') {
            const sumSalt = recipe.cureSaltG + recipe.pureSaltG;
            expect(Math.abs(sumSalt - recipe.totalSaltG)).toBeLessThanOrEqual(0.2);
          }
        }
      ),
      fcOptions
    );
  });

  test('Invariant 3: Weight loss kinetics monotonic progress and bounds [0, 100%]', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 500, max: 15000, noNaN: true }),  // initial mass
        fc.double({ min: 0.1, max: 0.99, noNaN: true }),   // retention factor (remaining weight)
        fc.double({ min: 20, max: 50, noNaN: true }),      // target loss pct (20% - 50%)
        (initialG, retention, targetPct) => {
          const currentG = initialG * retention;
          const metrics = calculateWeightLossMetrics(initialG, currentG, targetPct);

          expect(metrics.lossPct).toBeGreaterThanOrEqual(0);
          expect(metrics.lossPct).toBeLessThanOrEqual(100);
          expect(metrics.progressPct).toBeGreaterThanOrEqual(0);
          expect(metrics.progressPct).toBeLessThanOrEqual(100);

          if (metrics.lossPct >= targetPct) {
            expect(metrics.isTargetReached).toBe(true);
            expect(metrics.progressPct).toBe(100);
          } else {
            expect(metrics.isTargetReached).toBe(false);
          }
        }
      ),
      fcOptions
    );
  });

  test('Invariant 4: Brine density strictly increases with salt concentration', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 500, max: 5000, noNaN: true }),  // water volume (ml)
        fc.double({ min: 20, max: 200, noNaN: true }),    // salt dose 1 (g)
        fc.double({ min: 230, max: 600, noNaN: true }),   // salt dose 2 (g)
        (waterMl, salt1, salt2) => {
          const brine1 = calculateBrineDensity(salt1, waterMl);
          const brine2 = calculateBrineDensity(salt2, waterMl);

          expect(brine1.baume).toBeGreaterThan(0);
          expect(brine2.baume).toBeGreaterThan(brine1.baume);
          // Salometer is capped at 100 degrees (saturated brine)
          expect(brine2.salometer).toBeGreaterThanOrEqual(brine1.salometer);
          expect(brine2.salinityPct).toBeGreaterThan(brine1.salinityPct);
        }
      ),
      fcOptions
    );
  });

  test('Invariant 5: P0 Nitrosamine safety blocker activates on Cure #2 above 75°C', () => {
    const tempUnder = calculateCuringRecipe({
      meatWeightG: 1000,
      cureType: 'eq_dry',
      cureSaltType: 'cure_2',
      plannedMaxTempC: 65,
    });
    expect(tempUnder.nitrosamineRisk).toBe(false);

    const tempOver = calculateCuringRecipe({
      meatWeightG: 1000,
      cureType: 'eq_dry',
      cureSaltType: 'cure_2',
      plannedMaxTempC: 85,
    });
    expect(tempOver.nitrosamineRisk).toBe(true);
  });
});
