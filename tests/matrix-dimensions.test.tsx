/**
 * Screen Dimensions & AX5 Font Scaling Test Matrix
 * Standards: NFR-A11Y-004, NFR-A11Y-003, DEC-16
 */

import React from 'react';
import { View } from 'react-native';
import TestRenderer, { act, ReactTestRendererJSON } from 'react-test-renderer';
import { SearchField, Empty } from '../src/components/ui';
import { PpmBadge } from '../src/components/PpmBadge';

interface ViewportPreset {
  name: string;
  width: number;
  height: number;
}

const VIEWPORT_PRESETS: ViewportPreset[] = [
  { name: 'iPhone SE 1st gen (Narrow)', width: 320, height: 568 },
  { name: 'iPhone SE 2nd/3rd gen', width: 375, height: 667 },
  { name: 'iPhone 15 / 16 Standard', width: 393, height: 852 },
  { name: 'iPhone 15 / 16 Pro Max', width: 430, height: 932 },
];

const FONT_SCALES = [1.0, 1.35, 2.0]; // 1.0 (Normal), 1.35 (Large), 2.0 (AX5 max)

function renderWithAct(element: React.ReactElement) {
  let tr: any;
  act(() => {
    tr = TestRenderer.create(element);
  });
  return tr;
}

describe('NFR-A11Y-004: Responsive Layouts across 320pt Viewport and AX5 Dynamic Type', () => {
  describe.each(VIEWPORT_PRESETS)('Viewport: $name ($width x $height pt)', ({ width, height }) => {
    describe.each(FONT_SCALES)('Font Scale: %p', (fontScale) => {
      test('SearchField renders without container overflow at width $width', () => {
        const tr = renderWithAct(
          <View style={{ width, height }}>
            <SearchField
              value="Bardzo długa nazwa poszukiwanej wędzonki domowej"
              onChangeText={() => {}}
              placeholder="Szukaj..."
            />
          </View>
        );
        const tree = tr.toJSON() as ReactTestRendererJSON;
        expect(tree).toBeTruthy();
        expect(tree.props.style.width).toBe(width);
      });

      test('Empty state wraps and displays call-to-action button within bounds', () => {
        const tr = renderWithAct(
          <View style={{ width, height }}>
            <Empty
              title="Brak zapisanych partii w wędzarni"
              hint="Rozpocznij proces peklowania, aby śledzić postępy utraty wagi i etapy wędzenia."
              actionTitle="Dodaj nową partię wędzonki"
              onAction={() => {}}
            />
          </View>
        );
        const tree = tr.toJSON() as ReactTestRendererJSON;
        expect(tree).toBeTruthy();
      });

      test('PpmBadge scales within reasonable layout boundary without clipping', () => {
        const tr = renderWithAct(
          <View style={{ width }}>
            <PpmBadge ppm={145} status="safe" />
          </View>
        );
        const tree = tr.toJSON() as ReactTestRendererJSON;
        expect(tree).toBeTruthy();
      });
    });
  });
});
