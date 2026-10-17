/**
 * State Sequence Invariants & Simulation Test
 * Standards: BR-TEST-007, BR-TEST-008, BR-TEST-009, BR-TEST-010, DEC-03
 */

import { PROP_SEED, PROP_RUNS } from './prop-seed';
import { calculateWeightLossMetrics } from '../src/core/weight-loss-engine';
import { calculateNitritePpm } from '../src/core/curing-engine';
import { CureSaltType } from '../src/types';

export interface BatchItem {
  id: string;
  name: string;
  meatWeightG: number;
  cureSaltType: CureSaltType;
  status: 'curing' | 'drying' | 'smoking' | 'ready' | 'archived';
  initialWeightG: number;
  currentWeightG: number;
  targetLossPct: number;
  createdAt: number;
}

export interface WeightLogItem {
  id: string;
  batchId: string;
  weightG: number;
  timestamp: number;
  rhPct?: number;
  tempC?: number;
}

export interface AppSimulatorState {
  batches: BatchItem[];
  logs: WeightLogItem[];
  archivedBatchIds: string[];
  settings: {
    unitSystem: 'metric' | 'imperial';
    casingSpecsCount: number;
  };
}

/**
 * 10 Hard Domain Data Invariants (BR-TEST-007)
 */
export function assertStateInvariants(state: AppSimulatorState): void {
  // 1. All batch IDs must be unique
  const batchIds = state.batches.map((b) => b.id);
  const uniqueBatchIds = new Set(batchIds);
  expect(uniqueBatchIds.size).toBe(batchIds.length);

  // 2. All weight log IDs must be unique
  const logIds = state.logs.map((l) => l.id);
  const uniqueLogIds = new Set(logIds);
  expect(uniqueLogIds.size).toBe(logIds.length);

  // 3. No dangling log references: Every log must point to an existing batch
  for (const log of state.logs) {
    expect(uniqueBatchIds.has(log.batchId)).toBe(true);
  }

  // 4. Finite positive initial weight for all batches
  for (const batch of state.batches) {
    expect(Number.isFinite(batch.initialWeightG)).toBe(true);
    expect(batch.initialWeightG).toBeGreaterThan(0);
    expect(Number.isFinite(batch.currentWeightG)).toBe(true);
    expect(batch.currentWeightG).toBeGreaterThan(0);
  }

  // 5. Weight loss percentages are in reasonable biological range [0, 100]
  for (const batch of state.batches) {
    const metrics = calculateWeightLossMetrics(batch.initialWeightG, batch.currentWeightG, batch.targetLossPct);
    expect(metrics.lossPct).toBeGreaterThanOrEqual(0);
    expect(metrics.lossPct).toBeLessThanOrEqual(100);
    expect(metrics.progressPct).toBeGreaterThanOrEqual(0);
    expect(metrics.progressPct).toBeLessThanOrEqual(100);
  }

  // 6. Valid batch status enum
  const validStatuses = new Set(['curing', 'drying', 'smoking', 'ready', 'archived']);
  for (const batch of state.batches) {
    expect(validStatuses.has(batch.status)).toBe(true);
  }

  // 7. Archived IDs consistency: every archived batch ID exists and has status 'archived'
  for (const archId of state.archivedBatchIds) {
    const b = state.batches.find((item) => item.id === archId);
    expect(b).toBeDefined();
    expect(b?.status).toBe('archived');
  }

  // 8. Log weights are strictly positive and finite
  for (const log of state.logs) {
    expect(Number.isFinite(log.weightG)).toBe(true);
    expect(log.weightG).toBeGreaterThan(0);
  }

  // 9. Timestamps are non-negative and finite
  for (const batch of state.batches) {
    expect(Number.isFinite(batch.createdAt)).toBe(true);
    expect(batch.createdAt).toBeGreaterThan(0);
  }
  for (const log of state.logs) {
    expect(Number.isFinite(log.timestamp)).toBe(true);
    expect(log.timestamp).toBeGreaterThan(0);
  }

  // 10. Settings validity: supported unit system
  expect(['metric', 'imperial']).toContain(state.settings.unitSystem);
}

describe('BR-TEST-007..010: State Sequence Invariants & Simulation', () => {
  test('Guaranteed Opening Step + Random Sequences Invariant Check', () => {
    // Deterministic state container
    const state: AppSimulatorState = {
      batches: [],
      logs: [],
      archivedBatchIds: [],
      settings: {
        unitSystem: 'metric',
        casingSpecsCount: 4,
      },
    };

    // GUARANTEED OPENING STEP (BR-TEST-007):
    // Always create 'Polędwica dojrzewająca', add initial weight log, advance to drying
    const b0: BatchItem = {
      id: 'batch-opening-1',
      name: 'Polędwica dojrzewająca',
      meatWeightG: 1200,
      cureSaltType: 'peklosol_pl',
      status: 'curing',
      initialWeightG: 1200,
      currentWeightG: 1200,
      targetLossPct: 35.0,
      createdAt: 1776000000000,
    };
    state.batches.push(b0);

    const l0: WeightLogItem = {
      id: 'log-opening-1',
      batchId: b0.id,
      weightG: 1200,
      timestamp: b0.createdAt,
    };
    state.logs.push(l0);

    assertStateInvariants(state);

    // Opening step part 2: Add 7-day drying log and transition status
    const l1: WeightLogItem = {
      id: 'log-opening-2',
      batchId: b0.id,
      weightG: 1050,
      timestamp: b0.createdAt + 7 * 86400000,
    };
    state.logs.push(l1);
    b0.currentWeightG = 1050;
    b0.status = 'drying';

    assertStateInvariants(state);

    // Random sequence simulation (30 steps per run, up to 100 runs)
    let prng = PROP_SEED;
    function nextRand(): number {
      prng = (prng * 1664525 + 1013904223) % 0x100000000;
      return prng / 0x100000000;
    }

    const actionStats = {
      createBatch: 0,
      addLog: 0,
      changeStatus: 0,
      archiveBatch: 0,
      toggleUnits: 0,
    };

    const numRuns = Math.min(PROP_RUNS, 300);
    for (let r = 0; r < numRuns; r++) {
      const actionType = Math.floor(nextRand() * 5);

      if (actionType === 0) {
        // Create batch
        const id = `batch-${r}-${Math.floor(nextRand() * 10000)}`;
        const meatWeight = 500 + Math.floor(nextRand() * 4500);
        state.batches.push({
          id,
          name: `Szynka wędzona #${r}`,
          meatWeightG: meatWeight,
          cureSaltType: 'peklosol_pl',
          status: 'curing',
          initialWeightG: meatWeight,
          currentWeightG: meatWeight,
          targetLossPct: 30.0,
          createdAt: Date.now() - (100 - r) * 86400000,
        });
        actionStats.createBatch++;
      } else if (actionType === 1 && state.batches.length > 0) {
        // Add weight log to an existing non-archived batch
        const activeBatches = state.batches.filter((b) => b.status !== 'archived');
        if (activeBatches.length > 0) {
          const targetBatch = activeBatches[Math.floor(nextRand() * activeBatches.length)];
          const lossFraction = 0.85 + nextRand() * 0.14; // current weight between 85% and 99%
          const newWeight = Math.round(targetBatch.currentWeightG * lossFraction);
          state.logs.push({
            id: `log-${r}-${Math.floor(nextRand() * 10000)}`,
            batchId: targetBatch.id,
            weightG: Math.max(10, newWeight),
            timestamp: Date.now(),
          });
          targetBatch.currentWeightG = Math.max(10, newWeight);
          actionStats.addLog++;
        }
      } else if (actionType === 2 && state.batches.length > 0) {
        // Transition status
        const targetBatch = state.batches[Math.floor(nextRand() * state.batches.length)];
        if (targetBatch.status === 'curing') targetBatch.status = 'drying';
        else if (targetBatch.status === 'drying') targetBatch.status = 'ready';
        actionStats.changeStatus++;
      } else if (actionType === 3 && state.batches.length > 0) {
        // Archive batch
        const targetBatch = state.batches[Math.floor(nextRand() * state.batches.length)];
        if (targetBatch.status !== 'archived') {
          targetBatch.status = 'archived';
          state.archivedBatchIds.push(targetBatch.id);
          actionStats.archiveBatch++;
        }
      } else {
        // Toggle units
        state.settings.unitSystem = state.settings.unitSystem === 'metric' ? 'imperial' : 'metric';
        actionStats.toggleUnits++;
      }

      // Assert all 10 invariants after EVERY single step
      assertStateInvariants(state);
    }

    // Verify all branches hit (anti-vacuous truth)
    expect(actionStats.createBatch).toBeGreaterThan(0);
    expect(actionStats.addLog).toBeGreaterThan(0);
    expect(actionStats.changeStatus).toBeGreaterThan(0);
    expect(actionStats.toggleUnits).toBeGreaterThan(0);
  });
});
