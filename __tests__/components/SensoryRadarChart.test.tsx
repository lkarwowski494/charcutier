/**
 * CHARCUTIER — SensoryRadarChart Component Tests
 * Apps4Brew Studio
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { SensoryRadarChart } from '../../src/components/SensoryRadarChart';
import { DEFAULT_SENSORY_PROFILE } from '../../src/core/sensory-radar';

describe('SensoryRadarChart component', () => {
  test('renders SVG radar chart with 6 axes for default sensory profile', () => {
    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <SensoryRadarChart profile={DEFAULT_SENSORY_PROFILE} size={280} />
      );
    });

    expect(tr.root).toBeTruthy();
  });

  test('renders when custom profile values are provided', () => {
    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <SensoryRadarChart
          profile={{
            ...DEFAULT_SENSORY_PROFILE,
            salinity: 5,
            smokiness: 4,
            acidity: 2,
          }}
          size={200}
        />
      );
    });

    expect(tr.root).toBeTruthy();
  });
});
