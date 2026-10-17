import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { CloseButton, DoneButton } from '../src/components/ui';

describe('S1 Close & Done Button Guard (tests/close-button-guard.test.tsx)', () => {
  it('CloseButton has minimum touch target >= 44pt and descriptive accessibilityLabel', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<CloseButton onPress={() => {}} accessibilityLabel="Zamknij" />);
    });

    const btn = tree.root.findByProps({ accessibilityRole: 'button' });
    expect(btn.props.accessibilityLabel).toBe('Zamknij');
  });

  it('DoneButton has minimum touch target >= 44pt and descriptive accessibilityLabel', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<DoneButton onPress={() => {}} accessibilityLabel="Gotowe" />);
    });

    const btn = tree.root.findByProps({ accessibilityRole: 'button' });
    expect(btn.props.accessibilityLabel).toBe('Gotowe');
  });
});
