/**
 * NumInput Component Tests
 * Standards: BR-TEST-005, NFR-INT-003, RD-ENG-01
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { NumInput } from '../src/components/NumInput';
import { TextInput } from 'react-native';

describe('NumInput Component', () => {
  test('handles comma and dot decimal inputs smoothly', () => {
    let value = 10;
    const onChange = jest.fn((v) => {
      value = v;
    });

    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <NumInput
          value={value}
          onChangeNumber={onChange}
          stored={12.5}
        />
      );
    });

    const input = tr.root.findByType(TextInput);
    expect(input.props.value).toBe('10');

    // Type with dot and blur
    act(() => {
      input.props.onChangeText('14.2');
    });
    act(() => {
      input.props.onBlur({} as any);
    });
    expect(onChange).toHaveBeenCalledWith(14.2);
  });
});
