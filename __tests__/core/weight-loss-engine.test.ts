/**
 * CHARCUTIER — Weight Loss & Case Hardening Unit Tests
 * Apps4Brew Studio
 */

import {
  calculateWeightLossMetrics,
  calculateDailyLossRate,
  checkCaseHardening,
  estimateReadinessDate,
  checkFermentationSafety,
} from '../../src/core/weight-loss-engine';
import { WeightLog } from '../../src/types';

describe('weight-loss-engine: Water Loss & Progress', () => {
  test('calculates 35% target loss on 1000g initial weight', () => {
    // Current weight 650g -> 350g lost = 35.0%
    const metrics = calculateWeightLossMetrics(1000, 650, 35.0);
    expect(metrics.lossGrams).toBe(350);
    expect(metrics.lossPct).toBe(35.0);
    expect(metrics.remainingLossPct).toBe(0);
    expect(metrics.progressPct).toBe(100);
    expect(metrics.isTargetReached).toBe(true);
  });

  test('calculates partial progress (15% lost of 30% goal)', () => {
    const metrics = calculateWeightLossMetrics(2000, 1700, 30.0);
    expect(metrics.lossGrams).toBe(300);
    expect(metrics.lossPct).toBe(15.0);
    expect(metrics.remainingLossPct).toBe(15.0);
    expect(metrics.progressPct).toBe(50.0);
    expect(metrics.isTargetReached).toBe(false);
  });
});

describe('weight-loss-engine: P0 Case Hardening Detector (RD-25)', () => {
  test('triggers CRITICAL ALARM if loss rate > 3.0%/day on Day 2 with low RH (65%)', () => {
    const result = checkCaseHardening(3.6, 2, 65);
    expect(result.isCaseHardening).toBe(true);
    expect(result.warningKey).toBe('batches.caseHardeningAlert');
  });

  test('does NOT trigger alarm if RH is high (80%), even if rate is slightly above 3.0%', () => {
    const result = checkCaseHardening(3.2, 2, 80);
    expect(result.isCaseHardening).toBe(false);
  });

  test('does NOT trigger alarm if past Day 5 (e.g. Day 10)', () => {
    const result = checkCaseHardening(3.2, 10, 65);
    expect(result.isCaseHardening).toBe(false);
  });

  test('does NOT trigger alarm if daily rate is safe (e.g. 1.5%/day)', () => {
    const result = checkCaseHardening(1.5, 3, 70);
    expect(result.isCaseHardening).toBe(false);
  });
});

describe('weight-loss-engine: Readiness Date Projection', () => {
  test('projects completion date with chronological logs', () => {
    const now = Date.now();
    const dayMs = 24 * 3600 * 1000;

    const mockLogs: WeightLog[] = [
      {
        id: '1',
        batch_id: 'b1',
        weight_g: 1000,
        loss_pct: 0,
        daily_loss_rate: 0,
        case_hardening_flag: 0,
        temp_c: 12,
        rh_pct: 80,
        recorded_at: now - 10 * dayMs,
        notes: null,
      },
      {
        id: '2',
        batch_id: 'b1',
        weight_g: 900,
        loss_pct: 10,
        daily_loss_rate: 2.0,
        case_hardening_flag: 0,
        temp_c: 12,
        rh_pct: 80,
        recorded_at: now - 5 * dayMs,
        notes: null,
      },
      {
        id: '3',
        batch_id: 'b1',
        weight_g: 800,
        loss_pct: 20,
        daily_loss_rate: 2.0,
        case_hardening_flag: 0,
        temp_c: 12,
        rh_pct: 80,
        recorded_at: now,
        notes: null,
      },
    ];

    const result = estimateReadinessDate(1000, 35, mockLogs, now - 10 * dayMs);
    expect(result.daysRemaining).toBeGreaterThan(0);
    expect(result.estimatedTimestamp).toBeGreaterThan(now);
  });
});

describe('weight-loss-engine: Salami Fermentation & pH Barrier (BR-WAGA-006 / RD-27)', () => {
  test('confirms safety when pH reaches <= 5.3 (Staphylococcus aureus toxin block)', () => {
    const res = checkFermentationSafety(5.1, 36);
    expect(res.isSafe).toBe(true);
    expect(res.status).toBe('safe');
    expect(res.statusKey).toBe('batches.fermentationSafe');
  });

  test('reports in_progress when pH > 5.3 within early 48h fermentation window', () => {
    const res = checkFermentationSafety(5.6, 24);
    expect(res.isSafe).toBe(false);
    expect(res.status).toBe('in_progress');
    expect(res.statusKey).toBe('batches.fermentationInProgress');
  });

  test('alerts stalled_danger if pH > 5.3 after 72 hours of incubation', () => {
    const res = checkFermentationSafety(5.5, 76);
    expect(res.isSafe).toBe(false);
    expect(res.status).toBe('stalled_danger');
    expect(res.statusKey).toBe('batches.fermentationDanger');
  });
});
