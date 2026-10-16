/**
 * CHARCUTIER — CaseHardeningAlert Component Tests
 * Apps4Brew Studio
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { CaseHardeningAlert } from '../../src/components/CaseHardeningAlert';
import { Text } from 'react-native';

describe('CaseHardeningAlert component', () => {
  test('renders alarm title and metrics when provided', () => {
    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <CaseHardeningAlert dailyRatePct={3.8} daysElapsed={4} />
      );
    });

    const texts = tr.root.findAllByType(Text).map((t: any) => {
      const c = t.props.children;
      return Array.isArray(c) ? c.join('') : String(c);
    });
    const joined = texts.join(' ');
    expect(joined).toContain('CASE HARDENING');
    expect(joined).toContain('3.8');
    expect(joined).toContain('4');
  });

  test('renders without crashing when metrics are omitted', () => {
    let tr: any;
    act(() => {
      tr = TestRenderer.create(<CaseHardeningAlert />);
    });
    expect(tr.root).toBeTruthy();
  });
});
