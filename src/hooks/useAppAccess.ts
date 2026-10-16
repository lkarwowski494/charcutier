/**
 * CHARCUTIER — Zero-Tolerance Monetization & Access Engine
 * Apps4Brew Studio
 *
 * Rules:
 * - 14-day 100% unlocked trial (zero feature gating, no "Pro" badges)
 * - Post-trial: Read-Only mode (history & exports free forever)
 * - Any creation/mutation blocked by Apps4BrewPassModal
 * - restorePurchases() only restores if SQLite app_settings contains valid purchased_receipt_tier
 * - Reactive listener pattern across all components
 */

import { useState, useEffect, useCallback } from 'react';
import { getSetting, setSetting } from '../db/database';
import { LicenseTier, AccessState } from '../types';

export const TRIAL_DURATION_DAYS = 14;
export const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

// Reactive state & listener registry
type AccessListener = (state: AccessState) => void;
const listeners = new Set<AccessListener>();

let cachedAccessState: AccessState = {
  isUnlocked: true,
  isTrial: true,
  isExpired: false,
  trialDaysLeft: TRIAL_DURATION_DAYS,
  tier: null,
  canMutate: true,
};

let isInitialized = false;

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener({ ...cachedAccessState });
    } catch (err) {
      console.error('Error notifying access listener:', err);
    }
  });
}

/**
 * Calculates current access state from SQLite app_settings
 */
export async function refreshAccessState(): Promise<AccessState> {
  try {
    const tierRaw = await getSetting('purchased_receipt_tier');
    const tier = (tierRaw === 'monthly' || tierRaw === 'yearly' || tierRaw === 'lifetime'
      ? tierRaw
      : null) as LicenseTier;

    const trialStartRaw = await getSetting('trial_start_timestamp');
    const now = Date.now();
    let trialStart = trialStartRaw ? parseInt(trialStartRaw, 10) : now;

    if (!trialStartRaw) {
      await setSetting('trial_start_timestamp', now.toString());
      trialStart = now;
    }

    const lastActiveRaw = await getSetting('last_active_timestamp');
    const lastActive = lastActiveRaw ? parseInt(lastActiveRaw, 10) : 0;
    // Monotonic clock guard: prevent trial rollback exploits by clamping to max recorded timestamp
    const effectiveNow = Math.max(now, lastActive);
    if (now > lastActive) {
      await setSetting('last_active_timestamp', now.toString());
    }

    const trialEnd = trialStart + TRIAL_DURATION_MS;
    const isPurchased = tier !== null;
    const isTrialActive = !isPurchased && effectiveNow < trialEnd;
    const isExpired = !isPurchased && effectiveNow >= trialEnd;
    const trialDaysLeft = isPurchased
      ? 0
      : Math.max(0, Math.ceil((trialEnd - effectiveNow) / (24 * 60 * 60 * 1000)));

    cachedAccessState = {
      isUnlocked: isPurchased || isTrialActive,
      isTrial: isTrialActive,
      isExpired,
      trialDaysLeft,
      tier,
      canMutate: isPurchased || isTrialActive,
    };

    isInitialized = true;
    notifyListeners();
    return cachedAccessState;
  } catch (error) {
    console.warn('Could not read access state from DB (using defaults):', error);
    return cachedAccessState;
  }
}

/**
 * Hook providing reactive access state and gatekeeping helpers
 */
export function useAppAccess() {
  const [access, setAccess] = useState<AccessState>(cachedAccessState);
  const [isPassModalVisible, setIsPassModalVisible] = useState(false);

  useEffect(() => {
    const update = (newState: AccessState) => {
      setAccess(newState);
    };

    listeners.add(update);

    if (!isInitialized) {
      refreshAccessState();
    } else {
      setAccess(cachedAccessState);
    }

    return () => {
      listeners.delete(update);
    };
  }, []);

  /**
   * Safe action runner: executes action if allowed, otherwise displays Apps4BrewPassModal
   */
  const guardAction = useCallback(
    (action: () => void | Promise<void>) => {
      if (access.canMutate) {
        action();
      } else {
        setIsPassModalVisible(true);
      }
    },
    [access.canMutate]
  );

  /**
   * Restores purchase STRICTLY by checking SQLite app_settings.
   * Eliminates the vulnerability where clicking 'Restore' granted free access.
   */
  const restorePurchases = useCallback(async (): Promise<{
    success: boolean;
    tier?: LicenseTier;
    messageKey: string;
  }> => {
    const tierRaw = await getSetting('purchased_receipt_tier');
    const tier = (tierRaw === 'monthly' || tierRaw === 'yearly' || tierRaw === 'lifetime'
      ? tierRaw
      : null) as LicenseTier;

    if (tier) {
      await refreshAccessState();
      return {
        success: true,
        tier,
        messageKey: 'access.restoreSuccess',
      };
    }

    return {
      success: false,
      messageKey: 'access.restoreNotFound',
    };
  }, []);

  /**
   * Applies a purchased license tier, persists to SQLite, and updates listeners
   */
  const applyPurchase = useCallback(async (tier: 'monthly' | 'yearly' | 'lifetime'): Promise<void> => {
    await setSetting('purchased_receipt_tier', tier);
    await refreshAccessState();
    setIsPassModalVisible(false);
  }, []);

  return {
    ...access,
    isPassModalVisible,
    setIsPassModalVisible,
    guardAction,
    restorePurchases,
    applyPurchase,
    refreshAccessState,
  };
}
