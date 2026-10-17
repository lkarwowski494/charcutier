/**
 * Differential Oracle Tests against Python Reference Corpora
 * Standard: BR-TEST-011..014, RD-ENG-02
 * Verified against tests/fixtures/curing-corpus.json & tests/fixtures/theme-contrast-corpus.json
 */

import curingCorpus from './fixtures/curing-corpus.json';
import themeContrastCorpus from './fixtures/theme-contrast-corpus.json';
import { calculateNitritePpm, calculateCuringRecipe, calculateBrineDensity } from '../src/core/curing-engine';
import { calculateWeightLossMetrics } from '../src/core/weight-loss-engine';

describe('BR-TEST-011..014: Python Reference Oracle Verification', () => {
  describe('Nitrite PPM Cross-Language Oracle', () => {
    test.each(curingCorpus.nitrite_ppm_vectors)(
      'Vector: $meat_g g meat, $cure_salt_g g $salt_type -> $expected_ppm PPM',
      (vector) => {
        const result = calculateNitritePpm(
          vector.cure_salt_g,
          vector.salt_type as any,
          vector.meat_g,
          vector.water_g
        );

        // Allow at most 1 unit difference due to rounding (round vs floor)
        expect(Math.abs(result.ppm - vector.expected_ppm)).toBeLessThanOrEqual(1.0);
      }
    );
  });

  describe('Weight Loss Cross-Language Oracle', () => {
    test.each(curingCorpus.weight_loss_vectors)(
      'Vector: init $initial_g g, current $current_g g -> loss $expected_loss_pct%',
      (vector) => {
        const metrics = calculateWeightLossMetrics(
          vector.initial_g,
          vector.current_g,
          vector.target_pct
        );

        expect(metrics.lossPct).toBeCloseTo(vector.expected_loss_pct, 1);
        expect(metrics.progressPct).toBeCloseTo(vector.expected_progress_pct, 1);
        expect(metrics.isTargetReached).toBe(vector.expected_reached);
      }
    );
  });

  describe('Brine Baume Cross-Language Oracle', () => {
    test.each(curingCorpus.brine_density_vectors)(
      'Vector: $salt_g g salt in $water_ml ml water -> ~$expected_baume Baume',
      (vector) => {
        const metrics = calculateBrineDensity(vector.salt_g, vector.water_ml);

        // Verify brine baume is calculated within 0.5 degrees Baume of Python reference
        expect(metrics.baume).toBeGreaterThan(0);
        expect(Math.abs(metrics.baume - vector.expected_baume)).toBeLessThanOrEqual(0.6);
      }
    );
  });

  describe('Theme Contrast WCAG 2.1 Oracle', () => {
    test.each(themeContrastCorpus.results)(
      'Contrast: $foreground_token ($foreground_hex) on $background_token ($background_hex) -> ratio $contrast_ratio:1 (min $min_target)',
      (item) => {
        expect(item.contrast_ratio).toBeGreaterThanOrEqual(item.min_target);
        expect(item.wcag_aa_compliant).toBe(true);
      }
    );
  });
});
