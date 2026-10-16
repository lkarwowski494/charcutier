/**
 * CHARCUTIER — Craft Profile & Onboarding Hook Tests
 * Apps4Craft Studio Standard
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { useCraftProfile } from '../../src/hooks/useCraftProfile';
import * as database from '../../src/db/database';

jest.mock('../../src/db/database', () => ({
  getSetting: jest.fn(),
  setSetting: jest.fn(),
}));

function ProfileConsumer({
  onState,
}: {
  onState: (state: ReturnType<typeof useCraftProfile>) => void;
}) {
  const profileState = useCraftProfile();
  React.useEffect(() => {
    onState(profileState);
  }, [profileState, onState]);
  return null;
}

describe('useCraftProfile hook', () => {
  const mockGetSetting = database.getSetting as jest.Mock;
  const mockSetSetting = database.setSetting as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads initial craft profile and onboarding status from SQLite', async () => {
    mockGetSetting.mockImplementation(async (key: string) => {
      if (key === 'craft_profile') return 'traditional';
      if (key === 'onboarding_completed') return 'true';
      return null;
    });

    let state: any;
    await act(async () => {
      TestRenderer.create(<ProfileConsumer onState={(s) => { state = s; }} />);
    });

    expect(state.profile).toBe('traditional');
    expect(state.isOnboardingCompleted).toBe(true);
    expect(state.loading).toBe(false);
  });

  test('selectProfile updates SQLite and local state', async () => {
    mockGetSetting.mockResolvedValue(null);
    mockSetSetting.mockResolvedValue(undefined);

    let state: any;
    await act(async () => {
      TestRenderer.create(<ProfileConsumer onState={(s) => { state = s; }} />);
    });

    await act(async () => {
      await state.selectProfile('artisan');
    });

    expect(mockSetSetting).toHaveBeenCalledWith('craft_profile', 'artisan');
    expect(mockSetSetting).toHaveBeenCalledWith('onboarding_completed', 'true');
    expect(state.profile).toBe('artisan');
    expect(state.isOnboardingCompleted).toBe(true);
  });

  test('resetOnboarding resets onboarding status to false in SQLite', async () => {
    mockGetSetting.mockImplementation(async (key: string) => {
      if (key === 'onboarding_completed') return 'true';
      return null;
    });
    mockSetSetting.mockResolvedValue(undefined);

    let state: any;
    await act(async () => {
      TestRenderer.create(<ProfileConsumer onState={(s) => { state = s; }} />);
    });

    await act(async () => {
      await state.resetOnboarding();
    });

    expect(mockSetSetting).toHaveBeenCalledWith('onboarding_completed', 'false');
    expect(state.isOnboardingCompleted).toBe(false);
  });
});
