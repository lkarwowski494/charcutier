/**
 * CHARCUTIER — Reverse Process Scheduler Unit Tests
 * Apps4Brew Studio
 */

import {
  calculateReverseSchedule,
  PROCESS_BLUEPRINTS,
} from '../../src/core/reverse-scheduler';

describe('reverse-scheduler: Backward Planning from Feast Target Date', () => {
  const targetDate = new Date('2026-12-24T16:00:00Z');

  test('calculates correct backward timeline for traditional smoked ham', () => {
    const schedule = calculateReverseSchedule('smoked_ham', targetDate);

    expect(schedule.processType).toBe('smoked_ham');
    expect(schedule.totalDurationDays).toBeGreaterThanOrEqual(8);
    expect(schedule.targetDate).toEqual(targetDate);

    // Verification of chronology: each step must start before it finishes
    for (const step of schedule.steps) {
      expect(step.startTimestamp).toBeLessThan(step.endTimestamp);
      expect(step.durationMinutes).toBeGreaterThan(0);
      expect(step.stepName).toBeDefined();
    }

    // First step starts at cureStartTimestamp
    expect(schedule.steps[0].startTimestamp).toBe(schedule.cureStartTimestamp);

    // Final step ends at target date timestamp
    const lastStep = schedule.steps[schedule.steps.length - 1];
    expect(lastStep.endTimestamp).toBe(targetDate.getTime());
  });

  test('calculates reverse schedule for dry cured loin (Lonza)', () => {
    const schedule = calculateReverseSchedule('dry_cured_loin', targetDate);

    expect(schedule.processType).toBe('dry_cured_loin');
    expect(schedule.totalDurationDays).toBeGreaterThanOrEqual(30);
    expect(schedule.steps.length).toBe(4);

    const firstStep = schedule.steps[0];
    const lastStep = schedule.steps[schedule.steps.length - 1];
    expect(lastStep.endTimestamp).toBe(targetDate.getTime());
    expect(firstStep.startTimestamp).toBeLessThan(lastStep.startTimestamp);
  });

  test('calculates reverse schedule for kabanos sticks', () => {
    const schedule = calculateReverseSchedule('kabanos', targetDate);

    expect(schedule.processType).toBe('kabanos');
    expect(schedule.totalDurationDays).toBeGreaterThan(0);
    expect(schedule.steps.some((s) => s.id.includes('drying'))).toBe(true);
    expect(schedule.steps.some((s) => s.id.includes('smoking'))).toBe(true);
  });

  test('falls back to default blueprint for unknown process', () => {
    const fallbackSchedule = calculateReverseSchedule('unknown' as any, targetDate);
    expect(fallbackSchedule.steps.length).toBeGreaterThan(0);
  });

  test('all built-in process blueprints have valid steps with positive duration', () => {
    for (const [key, blueprint] of Object.entries(PROCESS_BLUEPRINTS)) {
      expect(blueprint.nameKey).toBeDefined();
      expect(blueprint.stepsReversed.length).toBeGreaterThan(0);
      for (const step of blueprint.stepsReversed) {
        expect(step.durationMinutes).toBeGreaterThan(0);
        expect(step.stepKey).toBeDefined();
        expect(step.instruction).toBeDefined();
      }
    }
  });
});
