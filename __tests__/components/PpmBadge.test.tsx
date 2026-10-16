/**
 * CHARCUTIER — PpmBadge Component Tests
 * Apps4Brew Studio
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { PpmBadge } from '../../src/components/PpmBadge';
import { Text } from 'react-native';

describe('PpmBadge component', () => {
  test('renders safe status (120 PPM)', () => {
    let tr: any;
    act(() => {
      tr = TestRenderer.create(<PpmBadge ppm={120} status="safe" />);
    });
    const texts = tr.root.findAllByType(Text).map((t: any) => {
      const c = t.props.children;
      return Array.isArray(c) ? c.join('') : String(c);
    });
    expect(texts.some((txt: string) => txt.includes('120.0 PPM'))).toBe(true);
  });

  test('renders warning status (180 PPM)', () => {
    let tr: any;
    act(() => {
      tr = TestRenderer.create(<PpmBadge ppm={180} status="warning" />);
    });
    const texts = tr.root.findAllByType(Text).map((t: any) => {
      const c = t.props.children;
      return Array.isArray(c) ? c.join('') : String(c);
    });
    expect(texts.some((txt: string) => txt.includes('180.0 PPM'))).toBe(true);
  });

  test('renders toxic status (250 PPM)', () => {
    let tr: any;
    act(() => {
      tr = TestRenderer.create(<PpmBadge ppm={250} status="toxic" />);
    });
    const texts = tr.root.findAllByType(Text).map((t: any) => {
      const c = t.props.children;
      return Array.isArray(c) ? c.join('') : String(c);
    });
    expect(texts.some((txt: string) => txt.includes('250.0 PPM'))).toBe(true);
  });
});
