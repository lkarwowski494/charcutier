/**
 * CHARCUTIER — Apps4BrewPassModal Component Tests
 * Apps4Brew Studio
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { Apps4BrewPassModal } from '../../src/components/Apps4BrewPassModal';
import { TouchableOpacity, Alert } from 'react-native';

const mockRestorePurchases = jest.fn();
const mockApplyPurchase = jest.fn();

jest.mock('../../src/hooks/useAppAccess', () => ({
  useAppAccess: () => ({
    restorePurchases: mockRestorePurchases,
    applyPurchase: mockApplyPurchase,
  }),
}));

describe('Apps4BrewPassModal component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  test('renders when visible=true and calls onClose on cancel button click', () => {
    const onCloseMock = jest.fn();
    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <Apps4BrewPassModal visible={true} onClose={onCloseMock} />
      );
    });

    const buttons = tr.root.findAllByType(TouchableOpacity);
    expect(buttons.length).toBeGreaterThan(0);

    // Cancel button is the first touchable
    act(() => {
      buttons[0].props.onPress();
    });
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('calls applyPurchase when subscription tier button is pressed', async () => {
    const onCloseMock = jest.fn();
    mockApplyPurchase.mockResolvedValue(true);

    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <Apps4BrewPassModal visible={true} onClose={onCloseMock} />
      );
    });

    const buttons = tr.root.findAllByType(TouchableOpacity);
    // Find the monthly tier card (second touchable)
    await act(async () => {
      buttons[1].props.onPress();
    });

    expect(mockApplyPurchase).toHaveBeenCalledWith('monthly');
  });

  test('calls restorePurchases when restore button is pressed', async () => {
    mockRestorePurchases.mockResolvedValue({ success: true, messageKey: 'access.restoreSuccess' });

    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <Apps4BrewPassModal visible={true} onClose={() => {}} />
      );
    });

    const buttons = tr.root.findAllByType(TouchableOpacity);
    // Last button is restore
    const restoreBtn = buttons[buttons.length - 1];
    await act(async () => {
      restoreBtn.props.onPress();
    });

    expect(mockRestorePurchases).toHaveBeenCalled();
  });
});
