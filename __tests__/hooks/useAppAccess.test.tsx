/**
 * CHARCUTIER — Zero-Tolerance Monetization & Access Engine Tests
 * Apps4Brew Studio (Using react-test-renderer)
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { useAppAccess, refreshAccessState, TRIAL_DURATION_DAYS } from '../../src/hooks/useAppAccess';
import * as database from '../../src/db/database';

jest.mock('../../src/db/database', () => ({
  getSetting: jest.fn(),
  setSetting: jest.fn(),
}));

// Test helper component to consume hook
function AccessConsumer({ onState }: { onState: (state: ReturnType<typeof useAppAccess>) => void }) {
  const access = useAppAccess();
  React.useEffect(() => {
    onState(access);
  }, [access, onState]);
  return null;
}

describe('useAppAccess: monetization & trial rules', () => {
  const mockGetSetting = database.getSetting as jest.Mock;
  const mockSetSetting = database.setSetting as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('trial active (day 3 of 14): 100% unlocked, canMutate = true, zero feature gating', async () => {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    mockGetSetting.mockImplementation(async (key: string) => {
      if (key === 'trial_start_timestamp') return threeDaysAgo.toString();
      if (key === 'purchased_receipt_tier') return null;
      return null;
    });

    let currentState: any;
    await act(async () => {
      await refreshAccessState();
      TestRenderer.create(<AccessConsumer onState={(s) => { currentState = s; }} />);
    });

    expect(currentState.isUnlocked).toBe(true);
    expect(currentState.isTrial).toBe(true);
    expect(currentState.isExpired).toBe(false);
    expect(currentState.canMutate).toBe(true);
    expect(currentState.trialDaysLeft).toBe(11);
    expect(currentState.tier).toBeNull();
  });

  test('trial expired (day 15): enters READ-ONLY mode, canMutate = false', async () => {
    const fifteenDaysAgo = Date.now() - 15 * 24 * 60 * 60 * 1000;
    mockGetSetting.mockImplementation(async (key: string) => {
      if (key === 'trial_start_timestamp') return fifteenDaysAgo.toString();
      if (key === 'purchased_receipt_tier') return null;
      return null;
    });

    let currentState: any;
    await act(async () => {
      await refreshAccessState();
      TestRenderer.create(<AccessConsumer onState={(s) => { currentState = s; }} />);
    });

    expect(currentState.isUnlocked).toBe(false);
    expect(currentState.isTrial).toBe(false);
    expect(currentState.isExpired).toBe(true);
    expect(currentState.canMutate).toBe(false);
    expect(currentState.trialDaysLeft).toBe(0);
  });

  test('guardAction blocks mutation and opens modal when trial expired', async () => {
    const fifteenDaysAgo = Date.now() - 15 * 24 * 60 * 60 * 1000;
    mockGetSetting.mockImplementation(async (key: string) => {
      if (key === 'trial_start_timestamp') return fifteenDaysAgo.toString();
      if (key === 'purchased_receipt_tier') return null;
      return null;
    });

    let currentState: any;
    await act(async () => {
      await refreshAccessState();
      TestRenderer.create(<AccessConsumer onState={(s) => { currentState = s; }} />);
    });

    const actionMock = jest.fn();
    act(() => {
      currentState.guardAction(actionMock);
    });

    expect(actionMock).not.toHaveBeenCalled();
    expect(currentState.isPassModalVisible).toBe(true);
  });

  test('guardAction executes callback freely when trial is active', async () => {
    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
    mockGetSetting.mockImplementation(async (key: string) => {
      if (key === 'trial_start_timestamp') return twoDaysAgo.toString();
      if (key === 'purchased_receipt_tier') return null;
      return null;
    });

    let currentState: any;
    await act(async () => {
      await refreshAccessState();
      TestRenderer.create(<AccessConsumer onState={(s) => { currentState = s; }} />);
    });

    const actionMock = jest.fn();
    act(() => {
      currentState.guardAction(actionMock);
    });

    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(currentState.isPassModalVisible).toBe(false);
  });

  test('restorePurchases fails safely if SQLite has no receipt record (anti-exploit fix)', async () => {
    mockGetSetting.mockImplementation(async (key: string) => {
      if (key === 'purchased_receipt_tier') return null;
      return null;
    });

    let currentState: any;
    await act(async () => {
      TestRenderer.create(<AccessConsumer onState={(s) => { currentState = s; }} />);
    });

    let restoreRes: any;
    await act(async () => {
      restoreRes = await currentState.restorePurchases();
    });

    expect(restoreRes.success).toBe(false);
    expect(restoreRes.messageKey).toBe('access.restoreNotFound');
  });

  test('restorePurchases restores license when SQLite contains purchased_receipt_tier', async () => {
    mockGetSetting.mockImplementation(async (key: string) => {
      if (key === 'purchased_receipt_tier') return 'lifetime';
      return null;
    });

    let currentState: any;
    await act(async () => {
      TestRenderer.create(<AccessConsumer onState={(s) => { currentState = s; }} />);
    });

    let restoreRes: any;
    await act(async () => {
      restoreRes = await currentState.restorePurchases();
    });

    expect(restoreRes.success).toBe(true);
    expect(restoreRes.tier).toBe('lifetime');
    expect(currentState.canMutate).toBe(true);
    expect(currentState.isUnlocked).toBe(true);
  });

  test('applyPurchase updates SQLite and notifies hook immediately', async () => {
    mockGetSetting.mockImplementation(async (key: string) => {
      return null;
    });

    let currentState: any;
    await act(async () => {
      TestRenderer.create(<AccessConsumer onState={(s) => { currentState = s; }} />);
    });

    await act(async () => {
      mockGetSetting.mockImplementation(async (key: string) => {
        if (key === 'purchased_receipt_tier') return 'yearly';
        return null;
      });
      await currentState.applyPurchase('yearly');
    });

    expect(mockSetSetting).toHaveBeenCalledWith('purchased_receipt_tier', 'yearly');
    expect(currentState.tier).toBe('yearly');
    expect(currentState.canMutate).toBe(true);
  });

  test('clock rollback defense: prevents trial extension if system clock is rewound', async () => {
    const sixteenDaysAgo = Date.now() - 16 * 24 * 60 * 60 * 1000;
    const recordedActiveAtDay15 = Date.now() - 1 * 24 * 60 * 60 * 1000; // active yesterday after 15 days of trial
    // User rewinds device clock back by 30 days
    const rewoundClockNow = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const realDateNow = Date.now;
    Date.now = jest.fn(() => rewoundClockNow);

    mockGetSetting.mockImplementation(async (key: string) => {
      if (key === 'trial_start_timestamp') return sixteenDaysAgo.toString();
      if (key === 'last_active_timestamp') return recordedActiveAtDay15.toString();
      if (key === 'purchased_receipt_tier') return null;
      return null;
    });

    let currentState: any;
    await act(async () => {
      await refreshAccessState();
      TestRenderer.create(<AccessConsumer onState={(s) => { currentState = s; }} />);
    });

    Date.now = realDateNow;

    // Even though device now < trialStart, effectiveNow was clamped to last_active_timestamp (day 15)
    // so trial is strictly expired and mutation is blocked
    expect(currentState.isExpired).toBe(true);
    expect(currentState.canMutate).toBe(false);
  });
});
