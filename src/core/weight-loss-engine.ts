/**
 * CHARCUTIER — Weight Loss & Case Hardening Kinetics Engine
 * Apps4Brew Studio
 *
 * Implements:
 * - Precise percentage water loss calculation
 * - Daily rate calculation: ΔM / day
 * - P0 Case Hardening Detector (RD-25): Alert on > 3.0%/day loss in first 5 days with low RH
 * - Logarithmic drying curve projection to target readiness
 */

import { WeightLog } from '../types';

export const CASE_HARDENING_THRESHOLD_DAILY_RATE = 3.0; // 3.0% / day
export const CASE_HARDENING_WINDOW_DAYS = 5;            // first 5 days of drying
export const CASE_HARDENING_CRITICAL_RH = 75;           // relative humidity below 75%

export interface WeightLossMetrics {
  currentWeightG: number;
  initialWeightG: number;
  lossPct: number;
  lossGrams: number;
  targetLossPct: number;
  remainingLossPct: number;
  progressPct: number; // 0% to 100% of target
  isTargetReached: boolean;
}

export interface CaseHardeningCheckResult {
  isCaseHardening: boolean;
  dailyRatePct: number;
  daysElapsed: number;
  rhPct: number | null;
  warningKey?: string;
  recommendationKey?: string;
}

/**
 * Calculates current weight loss percentages and progress toward goal
 */
export function calculateWeightLossMetrics(
  initialWeightG: number,
  currentWeightG: number,
  targetLossPct: number = 35.0
): WeightLossMetrics {
  if (initialWeightG <= 0) {
    return {
      currentWeightG: 0,
      initialWeightG: 0,
      lossPct: 0,
      lossGrams: 0,
      targetLossPct,
      remainingLossPct: targetLossPct,
      progressPct: 0,
      isTargetReached: false,
    };
  }

  const lossGrams = Math.max(0, initialWeightG - currentWeightG);
  const lossPct = Math.round((lossGrams / initialWeightG) * 100 * 10) / 10;
  const remainingLossPct = Math.max(0, Math.round((targetLossPct - lossPct) * 10) / 10);
  const progressPct = Math.min(100, Math.round((lossPct / targetLossPct) * 100 * 10) / 10);

  return {
    currentWeightG,
    initialWeightG,
    lossPct,
    lossGrams: Math.round(lossGrams * 10) / 10,
    targetLossPct,
    remainingLossPct,
    progressPct,
    isTargetReached: lossPct >= targetLossPct,
  };
}

/**
 * Calculates daily loss rate between two successive weighings
 */
export function calculateDailyLossRate(
  prevWeightG: number,
  currentWeightG: number,
  initialWeightG: number,
  deltaMillis: number
): number {
  if (initialWeightG <= 0 || deltaMillis <= 0) return 0;
  const deltaDays = deltaMillis / (1000 * 60 * 60 * 24);
  if (deltaDays < 0.04) {
    // Under 1 hour interval, avoid noisy division
    return 0;
  }

  const weightDropG = prevWeightG - currentWeightG;
  if (weightDropG <= 0) return 0;

  const dropPctOfInitial = (weightDropG / initialWeightG) * 100;
  const dailyRate = dropPctOfInitial / deltaDays;
  return Math.round(dailyRate * 100) / 100;
}

/**
 * P0 Invariant (RD-25): Detects Case Hardening hazard
 * If daily drying rate exceeds 3.0%/day during the first 5 days under RH < 75%,
 * surface proteins collapse into an impermeable barrier, trapping water inside
 * and causing internal putrefaction.
 */
export function checkCaseHardening(
  dailyRatePct: number,
  daysElapsed: number,
  chamberRhPct: number | null = null
): CaseHardeningCheckResult {
  const isEarlyPhase = daysElapsed <= CASE_HARDENING_WINDOW_DAYS;
  const isTooFast = dailyRatePct > CASE_HARDENING_THRESHOLD_DAILY_RATE;
  const isLowRh = chamberRhPct === null || chamberRhPct < CASE_HARDENING_CRITICAL_RH;

  const isCaseHardening = isEarlyPhase && isTooFast && isLowRh;

  return {
    isCaseHardening,
    dailyRatePct,
    daysElapsed: Math.round(daysElapsed * 10) / 10,
    rhPct: chamberRhPct,
    warningKey: isCaseHardening ? 'batches.caseHardeningAlert' : undefined,
  };
}

/**
 * Projects estimated completion timestamp using logarithmic moisture dissipation model
 * In drying charcuterie, drying rate decelerates over time as water activity (aw) decreases.
 */
export function estimateReadinessDate(
  initialWeightG: number,
  targetLossPct: number,
  logs: WeightLog[],
  createdTimestamp: number
): { estimatedTimestamp: number | null; daysRemaining: number | null } {
  if (initialWeightG <= 0 || logs.length === 0) {
    return { estimatedTimestamp: null, daysRemaining: null };
  }

  const latestLog = logs[logs.length - 1];
  const currentLoss = latestLog.loss_pct;

  if (currentLoss >= targetLossPct) {
    return { estimatedTimestamp: latestLog.recorded_at, daysRemaining: 0 };
  }

  // Need at least 2 points for a trend
  if (logs.length === 1) {
    const elapsedDays = Math.max(0.5, (latestLog.recorded_at - createdTimestamp) / (24 * 3600 * 1000));
    const avgDailyRate = Math.max(0.4, currentLoss / elapsedDays);
    const neededLoss = targetLossPct - currentLoss;
    const daysRemaining = Math.ceil(neededLoss / avgDailyRate);
    return {
      estimatedTimestamp: latestLog.recorded_at + daysRemaining * 24 * 3600 * 1000,
      daysRemaining,
    };
  }

  // Calculate moving average of recent daily rates
  const recentLogs = logs.slice(-5);
  let totalRate = 0;
  let count = 0;

  for (let i = 1; i < recentLogs.length; i++) {
    const prev = recentLogs[i - 1];
    const curr = recentLogs[i];
    const dt = (curr.recorded_at - prev.recorded_at) / (24 * 3600 * 1000);
    if (dt > 0.1) {
      const rate = ((prev.weight_g - curr.weight_g) / initialWeightG) * 100 / dt;
      if (rate > 0) {
        totalRate += rate;
        count++;
      }
    }
  }

  const effectiveRate = count > 0 ? totalRate / count : 0.6; // fallback 0.6%/day
  // Factor in deceleration (deceleration factor ~ 0.85 as water bound increases)
  const adjustedRate = Math.max(0.2, effectiveRate * 0.85);
  const neededLossPct = targetLossPct - currentLoss;
  const daysRemaining = Math.max(1, Math.ceil(neededLossPct / adjustedRate));

  return {
    estimatedTimestamp: latestLog.recorded_at + daysRemaining * 24 * 3600 * 1000,
    daysRemaining,
  };
}
