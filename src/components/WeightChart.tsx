/**
 * CHARCUTIER — Weight Loss Kinetics SVG Chart
 * Apps4Brew Studio
 *
 * Renders drying curve, target loss line, and weighing points using react-native-svg
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Polyline, Circle, Text as SvgText, Rect, G } from 'react-native-svg';
import { WeightLog } from '../types';
import { colors } from '../theme/colors';

interface WeightChartProps {
  initialWeightG: number;
  targetLossPct: number;
  logs: WeightLog[];
  width?: number;
  height?: number;
}

export function WeightChart({
  initialWeightG,
  targetLossPct = 35,
  logs,
  width = 340,
  height = 180,
}: WeightChartProps) {
  if (logs.length === 0) {
    return (
      <View style={[styles.emptyContainer, { width, height }]}>
        <Text style={styles.emptyText}>Brak zarejestrowanych ważeń</Text>
        <Text style={styles.emptySubtext}>
          Wprowadź pierwszy pomiar masy batonu, aby rozpocząć wykres kinetyki suszenia.
        </Text>
      </View>
    );
  }

  const paddingLeft = 40;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max Y on chart: slightly above target loss (e.g. target + 5%)
  const maxY = Math.max(targetLossPct + 5, ...logs.map((l) => l.loss_pct));
  const minY = 0;

  // Sort logs ascending by recorded_at
  const sorted = [...logs].sort((a, b) => a.recorded_at - b.recorded_at);
  const minTime = sorted[0].recorded_at;
  const maxTime = Math.max(sorted[sorted.length - 1].recorded_at, minTime + 1000);
  const timeSpan = maxTime - minTime || 1;

  // Convert log point to SVG coordinate
  const getX = (time: number) => {
    if (sorted.length === 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + ((time - minTime) / timeSpan) * chartWidth;
  };

  const getY = (lossPct: number) => {
    // 0% loss at top, maxY loss at bottom (or vice-versa)
    // In butcher charts, loss % increasing downward or upward
    return paddingTop + (lossPct / maxY) * chartHeight;
  };

  const pointsString = sorted.map((l) => `${getX(l.recorded_at)},${getY(l.loss_pct)}`).join(' ');
  const targetY = getY(targetLossPct);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Background Grid */}
        <Rect
          x={paddingLeft}
          y={paddingTop}
          width={chartWidth}
          height={chartHeight}
          fill={colors.surface}
          rx={8}
        />

        {/* 0% Line */}
        <Line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft + chartWidth}
          y2={paddingTop}
          stroke={colors.surfaceLight}
          strokeWidth={1}
        />
        <SvgText
          x={paddingLeft - 8}
          y={paddingTop + 4}
          fill={colors.textSecondary}
          fontSize={10}
          textAnchor="end"
          fontWeight="600"
        >
          0%
        </SvgText>

        {/* Target Loss Line (Dashed) */}
        <Line
          x1={paddingLeft}
          y1={targetY}
          x2={paddingLeft + chartWidth}
          y2={targetY}
          stroke={colors.safe}
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <SvgText
          x={paddingLeft - 8}
          y={targetY + 4}
          fill={colors.safe}
          fontSize={10}
          textAnchor="end"
          fontWeight="700"
        >
          {targetLossPct.toFixed(0)}%
        </SvgText>

        {/* Drying Curve Line */}
        {sorted.length > 1 && (
          <Polyline
            points={pointsString}
            fill="none"
            stroke={colors.amberPrimary}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data Points */}
        {sorted.map((log, index) => {
          const cx = getX(log.recorded_at);
          const cy = getY(log.loss_pct);
          const isLatest = index === sorted.length - 1;
          const isDanger = log.case_hardening_flag === 1;

          return (
            <G key={log.id || index}>
              <Circle
                cx={cx}
                cy={cy}
                r={isLatest ? 6 : 4}
                fill={isDanger ? colors.danger : colors.amberPrimary}
                stroke={colors.background}
                strokeWidth={2}
              />
              {isLatest && (
                <SvgText
                  x={cx}
                  y={cy - 10}
                  fill={colors.textPrimary}
                  fontSize={11}
                  fontWeight="800"
                  textAnchor="middle"
                >
                  -{log.loss_pct.toFixed(1)}%
                </SvgText>
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
