/**
 * CHARCUTIER — Craft Profile & Onboarding Hook
 * Apps4Craft Studio Standard
 *
 * Manages user persona / ritual focus:
 * - 'traditional': Home Charcuterie & Ham Maker (szynkowar, kielbasy, cooked hams)
 * - 'artisan': Dry-Curing Master (salami, prosciutto, case hardening, cellar kinetics)
 * - 'all_craft': Unrestricted Master Workshop (everything unlocked)
 */

import { useState, useEffect, useCallback } from 'react';
import { CraftProfile } from '../types';
import { getSetting, setSetting } from '../db/database';

let cachedProfile: CraftProfile = 'all_craft';
let cachedOnboardingCompleted: boolean = true;
const listeners = new Set<(profile: CraftProfile, completed: boolean) => void>();

export function useCraftProfile() {
  const [profile, setProfileState] = useState<CraftProfile>(cachedProfile);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(cachedOnboardingCompleted);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const storedProfile = await getSetting('craft_profile');
        const storedOnboarding = await getSetting('onboarding_completed');

        if (storedProfile === 'traditional' || storedProfile === 'artisan' || storedProfile === 'all_craft') {
          cachedProfile = storedProfile;
          setProfileState(storedProfile);
        }

        const isComplete = storedOnboarding === 'true';
        cachedOnboardingCompleted = isComplete;
        setIsOnboardingCompleted(isComplete);
      } catch (err) {
        console.error('Error loading craft profile:', err);
      } finally {
        setLoading(false);
      }
    }

    load();

    const listener = (newProfile: CraftProfile, completed: boolean) => {
      setProfileState(newProfile);
      setIsOnboardingCompleted(completed);
    };
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const selectProfile = useCallback(async (newProfile: CraftProfile) => {
    cachedProfile = newProfile;
    cachedOnboardingCompleted = true;
    await setSetting('craft_profile', newProfile);
    await setSetting('onboarding_completed', 'true');
    listeners.forEach((l) => l(newProfile, true));
  }, []);

  const resetOnboarding = useCallback(async () => {
    cachedOnboardingCompleted = false;
    await setSetting('onboarding_completed', 'false');
    listeners.forEach((l) => l(cachedProfile, false));
  }, []);

  return {
    profile,
    isOnboardingCompleted,
    loading,
    selectProfile,
    resetOnboarding,
  };
}
