/**
 * CHARCUTIER — Reactive Unit System Hook Tests
 * Apps4Brew Studio (Using react-test-renderer)
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { useUnitSystem, refreshUnitSystem, setUnitSystemPreference } from '../../src/hooks/useUnitSystem';
import * as database from '../../src/db/database';

jest.mock('../../src/db/database', () => ({
  getSetting: jest.fn(),
  setSetting: jest.fn(),
}));

function UnitConsumer({ onState }: { onState: (state: ReturnType<typeof useUnitSystem>) => void }) {
  const units = useUnitSystem();
  React.useEffect(() => {
    onState(units);
  }, [units, onState]);
  return null;
}

describe('useUnitSystem: reactive unit conversion and preference tests', () => {
  const mockGetSetting = database.getSetting as jest.Mock;
  const mockSetSetting = database.setSetting as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('defaults to metric and formats weight/temp/volume accordingly', async () => {
    mockGetSetting.mockResolvedValue('metric');

    let state: any;
    await act(async () => {
      await refreshUnitSystem();
      TestRenderer.create(<UnitConsumer onState={(s) => { state = s; }} />);
    });

    expect(state.unitSystem).toBe('metric');
    expect(state.formatWeight(1500)).toBe('1.50 kg');
    expect(state.formatWeight(500)).toBe('500.0 g');
    expect(state.formatTemperature(78)).toBe('78.0°C');
    expect(state.formatVolume(1000)).toBe('1.0 L');
    expect(state.formatVolume(250)).toBe('250 ml');
  });

  test('switches reactively to imperial and persists to SQLite', async () => {
    mockGetSetting.mockResolvedValue('metric');

    let state: any;
    await act(async () => {
      await refreshUnitSystem();
      TestRenderer.create(<UnitConsumer onState={(s) => { state = s; }} />);
    });

    await act(async () => {
      await state.setUnitSystem('imperial');
    });

    expect(mockSetSetting).toHaveBeenCalledWith('unit_system', 'imperial');
    expect(state.unitSystem).toBe('imperial');
    expect(state.formatWeight(1500)).toContain('lbs');
    expect(state.formatTemperature(78)).toContain('°F');
    expect(state.formatVolume(500)).toContain('fl oz');
  });
});
