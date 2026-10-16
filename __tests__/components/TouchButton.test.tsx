/**
 * CHARCUTIER — TouchButton Component Tests
 * Apps4Brew Studio
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { TouchButton } from '../../src/components/TouchButton';
import { ActivityIndicator, Text } from 'react-native';

describe('TouchButton component', () => {
  test('renders with title and calls onPress', () => {
    const onPressMock = jest.fn();
    let testRenderer: any;
    act(() => {
      testRenderer = TestRenderer.create(
        <TouchButton title="Test Button" onPress={onPressMock} />
      );
    });

    const root = testRenderer.root;
    const textInstance = root.findByType(Text);
    expect(textInstance.props.children).toBe('Test Button');

    // Simulate click
    act(() => {
      root.findByProps({ accessibilityRole: 'button' }).props.onPress();
    });
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test('renders all visual variants: primary, secondary, danger, outline', () => {
    const variants: Array<'primary' | 'secondary' | 'danger' | 'outline'> = [
      'primary',
      'secondary',
      'danger',
      'outline',
    ];

    variants.forEach((v) => {
      let tr: any;
      act(() => {
        tr = TestRenderer.create(
          <TouchButton title={v} onPress={() => {}} variant={v} />
        );
      });
      expect(tr.root.findByProps({ accessibilityRole: 'button' })).toBeTruthy();
    });
  });

  test('disables interaction when disabled=true', () => {
    const onPressMock = jest.fn();
    let testRenderer: any;
    act(() => {
      testRenderer = TestRenderer.create(
        <TouchButton title="Disabled" onPress={onPressMock} disabled={true} />
      );
    });

    const button = testRenderer.root.findByProps({ accessibilityRole: 'button' });
    expect(button.props.disabled).toBe(true);
  });

  test('renders ActivityIndicator and hides text when loading=true', () => {
    let testRenderer: any;
    act(() => {
      testRenderer = TestRenderer.create(
        <TouchButton title="Loading" onPress={() => {}} loading={true} />
      );
    });

    const root = testRenderer.root;
    expect(root.findAllByType(ActivityIndicator).length).toBe(1);
    expect(root.findAllByType(Text).length).toBe(0);
  });
});
