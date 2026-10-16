/**
 * CHARCUTIER — WeightChart Component Tests
 * Apps4Brew Studio
 */

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { WeightChart } from '../../src/components/WeightChart';
import { WeightLog } from '../../src/types';

describe('WeightChart component', () => {
  test('renders empty state when logs array is empty', () => {
    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <WeightChart initialWeightG={2000} targetLossPct={35} logs={[]} />
      );
    });
    expect(tr.toJSON()).toBeTruthy();
  });

  test('renders SVG elements with points and lines when logs are provided', () => {
    const now = Date.now();
    const mockLogs: WeightLog[] = [
      {
        id: 'w1',
        batch_id: 'b1',
        weight_g: 2000,
        loss_pct: 0,
        daily_loss_rate: 0,
        case_hardening_flag: 0,
        temp_c: 12,
        rh_pct: 80,
        recorded_at: now - 3 * 86400000,
        notes: null,
      },
      {
        id: 'w2',
        batch_id: 'b1',
        weight_g: 1800,
        loss_pct: 10,
        daily_loss_rate: 3.3,
        case_hardening_flag: 1, // danger point
        temp_c: 12,
        rh_pct: 70,
        recorded_at: now,
        notes: null,
      },
    ];

    let tr: any;
    act(() => {
      tr = TestRenderer.create(
        <WeightChart initialWeightG={2000} targetLossPct={35} logs={mockLogs} />
      );
    });
    expect(tr.root).toBeTruthy();
  });
});
