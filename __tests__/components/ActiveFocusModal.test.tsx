/**
 * CHARCUTIER — ActiveFocusModal Component Tests
 * Apps4Craft Studio Standard
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { TouchableOpacity, Text } from 'react-native';
import { ActiveFocusModal } from '../../src/components/ActiveFocusModal';

describe('ActiveFocusModal', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    secondsRemaining: 3665, // 01:01:05
    isTimerRunning: true,
    onToggleTimer: jest.fn(),
    currentPhase: 'smoking' as const,
    batchName: 'Kiełbasa Krakowska',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders 72pt clock with formatted time and batch name', () => {
    let tr: any;
    act(() => {
      tr = TestRenderer.create(<ActiveFocusModal {...defaultProps} />);
    });

    const timer = tr.root.findByProps({ accessibilityRole: 'timer' });
    expect(timer.props.children).toBe('01:01:05');

    const texts = tr.root.findAllByType(Text);
    const textContents = texts.map((t: any) => t.props.children);
    expect(textContents).toContain('Kiełbasa Krakowska');
  });

  test('calls onClose when exit button is tapped', () => {
    const onCloseMock = jest.fn();
    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <ActiveFocusModal {...defaultProps} onClose={onCloseMock} />
      );
    });

    const exitBtn = tr.root.findByProps({ accessibilityLabel: 'Wyjdź' });
    act(() => {
      exitBtn.props.onPress();
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('calls onToggleTimer when action button is tapped', () => {
    const onToggleMock = jest.fn();
    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <ActiveFocusModal {...defaultProps} onToggleTimer={onToggleMock} />
      );
    });

    const touchables = tr.root.findAllByType(TouchableOpacity);
    // Find the toggle button (primary action)
    const toggleBtn = touchables.find((t: any) => t.props.onPress === onToggleMock);
    expect(toggleBtn).toBeTruthy();

    act(() => {
      toggleBtn.props.onPress();
    });

    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });

  test('renders target core temperature in poaching phase', () => {
    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <ActiveFocusModal
          {...defaultProps}
          currentPhase="poaching"
          targetCoreTemp={68}
          currentCoreTemp="54"
        />
      );
    });

    const texts = tr.root.findAllByType(Text);
    const hasCoreTemp = texts.some((t: any) => {
      const content = String(t.props.children);
      return content.includes('68') && content.includes('54');
    });
    expect(hasCoreTemp).toBe(true);
  });
});
