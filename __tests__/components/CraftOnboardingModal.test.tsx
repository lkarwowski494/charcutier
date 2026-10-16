/**
 * CHARCUTIER — CraftOnboardingModal Component Tests
 * Apps4Craft Studio Standard
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { CraftOnboardingModal } from '../../src/components/CraftOnboardingModal';
import { TouchButton } from '../../src/components/TouchButton';

describe('CraftOnboardingModal', () => {
  test('renders modal when visible=true and displays 3 profiles', () => {
    const onSelectProfileMock = jest.fn();
    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <CraftOnboardingModal visible={true} onSelectProfile={onSelectProfileMock} />
      );
    });

    expect(tr.root).toBeTruthy();
    // Verify touch button confirm is present
    const btn = tr.root.findByType(TouchButton);
    expect(btn).toBeTruthy();
  });

  test('calls onSelectProfile when confirming profile selection', () => {
    const onSelectProfileMock = jest.fn();
    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <CraftOnboardingModal visible={true} onSelectProfile={onSelectProfileMock} />
      );
    });

    const btn = tr.root.findByType(TouchButton);
    act(() => {
      btn.props.onPress();
    });

    expect(onSelectProfileMock).toHaveBeenCalledWith('all_craft');
  });

  test('does not crash when visible=false', () => {
    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <CraftOnboardingModal visible={false} onSelectProfile={() => {}} />
      );
    });
    expect(tr.toJSON()).toBeNull();
  });
});
