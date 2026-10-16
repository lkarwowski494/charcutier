/**
 * CHARCUTIER — StepperInput Component Tests
 * Apps4Brew Studio
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { StepperInput } from '../../src/components/StepperInput';
import { TextInput, TouchableOpacity } from 'react-native';

describe('StepperInput component', () => {
  test('renders label, unit and formatted numeric value', () => {
    let testRenderer: any;
    act(() => {
      testRenderer = TestRenderer.create(
        <StepperInput label="Waga mięsa" value={1500} onChange={() => {}} unit="g" />
      );
    });

    const input = testRenderer.root.findByType(TextInput);
    expect(input.props.value).toBe('1500');
  });

  test('increments and decrements value via stepper buttons', () => {
    let currentValue = 1000;
    const onChange = jest.fn((val) => {
      currentValue = val;
    });

    let testRenderer: any;
    act(() => {
      testRenderer = TestRenderer.create(
        <StepperInput
          label="Waga"
          value={1000}
          onChange={onChange}
          stepSmall={10}
          stepLarge={50}
          min={100}
          max={5000}
        />
      );
    });

    const buttons = testRenderer.root.findAllByType(TouchableOpacity);
    expect(buttons.length).toBe(4);

    // Button 0: -stepLarge (-50)
    act(() => {
      buttons[0].props.onPress();
    });
    expect(onChange).toHaveBeenCalledWith(950);

    // Button 1: -stepSmall (-10)
    act(() => {
      buttons[1].props.onPress();
    });
    expect(onChange).toHaveBeenCalledWith(990);

    // Button 2: +stepSmall (+10)
    act(() => {
      buttons[2].props.onPress();
    });
    expect(onChange).toHaveBeenCalledWith(1010);

    // Button 3: +stepLarge (+50)
    act(() => {
      buttons[3].props.onPress();
    });
    expect(onChange).toHaveBeenCalledWith(1050);
  });

  test('clamps values to min and max boundaries', () => {
    const onChange = jest.fn();
    let testRenderer: any;
    act(() => {
      testRenderer = TestRenderer.create(
        <StepperInput
          label="Waga"
          value={100}
          onChange={onChange}
          stepLarge={50}
          min={100}
          max={150}
        />
      );
    });

    const buttons = testRenderer.root.findAllByType(TouchableOpacity);
    // Try to decrement below min (100 - 50) -> should clamp to 100
    act(() => {
      buttons[0].props.onPress();
    });
    expect(onChange).toHaveBeenCalledWith(100);

    // Try to increment above max (100 + 100) -> should clamp to 150
    act(() => {
      buttons[3].props.onPress(); // +50 -> 150
    });
    expect(onChange).toHaveBeenCalledWith(150);
  });

  test('handles numeric typing with comma and dot decimals', () => {
    const onChange = jest.fn();
    let testRenderer: any;
    act(() => {
      testRenderer = TestRenderer.create(
        <StepperInput
          label="Sól"
          value={2.2}
          onChange={onChange}
          min={0}
          max={10}
          precision={1}
        />
      );
    });

    const input = testRenderer.root.findByType(TextInput);

    // Type with comma (European decimal)
    act(() => {
      input.props.onChangeText('2,5');
    });
    expect(onChange).toHaveBeenCalledWith(2.5);

    // Type with dot (US decimal)
    act(() => {
      input.props.onChangeText('3.1');
    });
    expect(onChange).toHaveBeenCalledWith(3.1);

    // Empty text
    act(() => {
      input.props.onChangeText('');
    });
    expect(onChange).toHaveBeenCalledWith(0);
  });
});
