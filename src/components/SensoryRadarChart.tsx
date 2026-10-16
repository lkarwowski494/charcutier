/**
 * CHARCUTIER — 6-Axis Sensory Radar Chart Component
 * Apps4Brew Studio (Adapted from Słoik Tasting Radar)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { colors } from '../theme/colors';
import {
  SensoryProfile,
  calculateRadarCoordinates,
  SENSORY_AXES,
} from '../core/sensory-radar';

interface SensoryRadarChartProps {
  profile: SensoryProfile;
  size?: number;
}

export function SensoryRadarChart({ profile, size = 280 }: SensoryRadarChartProps) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) - 40; // padding for text labels

  // Compute spider web grid levels (1, 2, 3, 4, 5)
  const levels = [1, 2, 3, 4, 5];
  const totalAxes = SENSORY_AXES.length;
  const angleStep = (2 * Math.PI) / totalAxes;

  // Active profile coordinates
  const dataPoints = calculateRadarCoordinates(profile, centerX, centerY, radius);
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Concentric Rings */}
        {levels.map((lvl) => {
          const r = (lvl / 5) * radius;
          const ringPoints = SENSORY_AXES.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            return `${x},${y}`;
          }).join(' ');

          return (
            <Polygon
              key={lvl}
              points={ringPoints}
              stroke={colors.surfaceLight}
              strokeWidth={lvl === 3 ? 1.5 : 0.8}
              strokeDasharray={lvl === 3 ? '4 3' : undefined}
              fill="none"
            />
          );
        })}

        {/* Axis Spokes */}
        {SENSORY_AXES.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = centerX + radius * Math.cos(angle);
          const y2 = centerY + radius * Math.sin(angle);

          // Label coordinates slightly outside the outermost ring
          const labelDist = radius + 22;
          const lx = centerX + labelDist * Math.cos(angle);
          const ly = centerY + labelDist * Math.sin(angle) + 4;

          return (
            <G key={axis.key}>
              <Line
                x1={centerX}
                y1={centerY}
                x2={x2}
                y2={y2}
                stroke={colors.surfaceLight}
                strokeWidth={1}
              />
              <SvgText
                x={lx}
                y={ly}
                fill={colors.textPrimary}
                fontSize={10.5}
                fontWeight="700"
                textAnchor="middle"
              >
                {axis.labelPl}
              </SvgText>
            </G>
          );
        })}

        {/* Filled Data Polygon */}
        <Polygon
          points={polygonPoints}
          fill="rgba(245, 158, 11, 0.35)"
          stroke={colors.amberPrimary}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Vertex Markers */}
        {dataPoints.map((pt, i) => (
          <Circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={4.5}
            fill={colors.amberPrimary}
            stroke={colors.background}
            strokeWidth={1.5}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
});
