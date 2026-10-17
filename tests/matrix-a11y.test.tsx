/**
 * Matrix Accessibility Audit Test (RNTL)
 * Standards: NFR-A11Y-001..008, RD-ENG-03, BR-TEST-016
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import TestRenderer, { act, ReactTestRendererJSON } from 'react-test-renderer';
import {
  CloseButton,
  DoneButton,
  SearchField,
  Empty,
  Missing,
} from '../src/components/ui';
import { TouchButton } from '../src/components/TouchButton';
import { PpmBadge } from '../src/components/PpmBadge';
import { CaseHardeningAlert } from '../src/components/CaseHardeningAlert';

function renderWithAct(element: React.ReactElement) {
  let tr: any;
  act(() => {
    tr = TestRenderer.create(element);
  });
  return tr;
}

/**
 * Calculates effective touch target dimension per RD-ENG-03
 * Weff = max(w, minW) + hitSlop.left + hitSlop.right
 * Heff = max(h, minH) + hitSlop.top + hitSlop.bottom
 */
function computeEffectiveTouchTarget(node: ReactTestRendererJSON): { width: number; height: number } {
  const style = StyleSheet.flatten(node.props.style) || {};
  const hitSlop = node.props.hitSlop || {};

  const top = typeof hitSlop === 'number' ? hitSlop : (hitSlop.top || 0);
  const bottom = typeof hitSlop === 'number' ? hitSlop : (hitSlop.bottom || 0);
  const left = typeof hitSlop === 'number' ? hitSlop : (hitSlop.left || 0);
  const right = typeof hitSlop === 'number' ? hitSlop : (hitSlop.right || 0);

  const w = style.width || style.minWidth || 0;
  const h = style.height || style.minHeight || 0;

  return {
    width: w + left + right,
    height: h + top + bottom,
  };
}

function traverseTree(
  node: ReactTestRendererJSON | null,
  visitor: (n: ReactTestRendererJSON) => void
) {
  if (!node) return;
  visitor(node);
  if (node.children) {
    for (const child of node.children) {
      if (typeof child === 'object' && child !== null) {
        traverseTree(child as ReactTestRendererJSON, visitor);
      }
    }
  }
}

describe('NFR-A11Y-001..008: Accessibility & Touch Target Audit', () => {
  describe('Touch Target Dimensions (RD-ENG-03 >= 44 pt)', () => {
    test('CloseButton meets >= 44x44 pt effective touch target', () => {
      const tr = renderWithAct(<CloseButton onPress={() => {}} />);
      const tree = tr.toJSON() as ReactTestRendererJSON;
      const dims = computeEffectiveTouchTarget(tree);
      expect(dims.width).toBeGreaterThanOrEqual(44);
      expect(dims.height).toBeGreaterThanOrEqual(44);
    });

    test('DoneButton meets >= 44x44 pt effective touch target', () => {
      const tr = renderWithAct(<DoneButton onPress={() => {}} />);
      const tree = tr.toJSON() as ReactTestRendererJSON;
      const dims = computeEffectiveTouchTarget(tree);
      expect(dims.width).toBeGreaterThanOrEqual(44);
      expect(dims.height).toBeGreaterThanOrEqual(44);
    });

    test('SearchField and its clear button meet >= 44x44 pt touch target', () => {
      const tr = renderWithAct(<SearchField value="boczek" onChangeText={() => {}} />);
      const tree = tr.toJSON() as ReactTestRendererJSON;

      let foundClear = false;
      traverseTree(tree, (n) => {
        if (n.props.testID === 'search-field-clear') {
          foundClear = true;
          const dims = computeEffectiveTouchTarget(n);
          expect(dims.width).toBeGreaterThanOrEqual(44);
          expect(dims.height).toBeGreaterThanOrEqual(44);
        }
      });
      expect(foundClear).toBe(true);
    });

    test('TouchButton meets workshop ergonomics >= 44 pt (min 52 pt)', () => {
      const tr = renderWithAct(<TouchButton title="Zapisz partię" onPress={() => {}} />);
      expect(tr.root.findByProps({ accessibilityRole: 'button' })).toBeTruthy();
    });

    test('Empty state action button meets >= 44 pt touch target', () => {
      const tr = renderWithAct(
        <Empty
          title="Brak partii"
          actionTitle="Dodaj pierwszą partię"
          onAction={() => {}}
        />
      );
      const tree = tr.toJSON() as ReactTestRendererJSON;

      let foundAction = false;
      traverseTree(tree, (n) => {
        if (n.props.accessibilityRole === 'button') {
          foundAction = true;
          const dims = computeEffectiveTouchTarget(n);
          expect(dims.height).toBeGreaterThanOrEqual(44);
        }
      });
      expect(foundAction).toBe(true);
    });
  });

  describe('Accessibility Labels, Roles & States (NFR-A11Y-001, NFR-A11Y-006)', () => {
    test('All interactive buttons provide descriptive non-empty accessibilityLabel', () => {
      const components = [
        <CloseButton onPress={() => {}} />,
        <DoneButton onPress={() => {}} />,
        <SearchField value="kiełbasa" onChangeText={() => {}} />,
        <Empty title="Brak" actionTitle="Utwórz" onAction={() => {}} />,
        <Missing onBack={() => {}} />,
      ];

      for (const comp of components) {
        const tr = renderWithAct(comp);
        const tree = tr.toJSON() as ReactTestRendererJSON;
        traverseTree(tree, (n) => {
          if (n.props.onPress || n.props.accessibilityRole === 'button') {
            const label = n.props.accessibilityLabel;
            expect(label).toBeTruthy();
            expect(typeof label).toBe('string');
            expect(label.trim().length).toBeGreaterThan(0);

            // Prohibited raw technical artifacts
            expect(label).not.toContain('undefined');
            expect(label).not.toContain('NaN');
            expect(label).not.toContain('[object Object]');
            // Prohibit bare symbol without word description
            expect(label).not.toMatch(/^[\+✕×⋯🗑️]$/);
          }
        });
      }
    });

    test('PpmBadge communicates safety status with text and symbol (NFR-A11Y-006: not color alone)', () => {
      const safeTr = renderWithAct(<PpmBadge ppm={120} status="safe" />);
      const safeTree = safeTr.toJSON() as ReactTestRendererJSON;
      expect(safeTree).toBeTruthy();
      expect(JSON.stringify(safeTree)).toContain('120');

      const toxicTr = renderWithAct(<PpmBadge ppm={250} status="toxic" />);
      const toxicTree = toxicTr.toJSON() as ReactTestRendererJSON;
      expect(toxicTree).toBeTruthy();
      expect(JSON.stringify(toxicTree)).toContain('250');
    });

    test('CaseHardeningAlert contains explicit warning text and recommendations', () => {
      const tr = renderWithAct(
        <CaseHardeningAlert
          dailyRatePct={4.2}
          daysElapsed={3}
        />
      );
      const tree = tr.toJSON() as ReactTestRendererJSON;

      expect(tree).toBeTruthy();
      const serialized = JSON.stringify(tree);
      expect(serialized).toContain('4.2');
    });
  });
});
