/**
 * CHARCUTIER — PPM Guard Safety Badge
 * Apps4Brew Studio
 *
 * Visual indicator of active Sodium Nitrite (NaNO2) Parts-Per-Million
 * Color-coded for rapid biological safety assessment:
 * - Green (100-150 PPM): Safe USDA/EU target
 * - Amber (151-200 PPM): Caution
 * - Red (>200 PPM): Critical Hazard
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { t } from '../i18n';

interface PpmBadgeProps {
  ppm: number;
  status: 'safe' | 'warning' | 'toxic';
}

export function PpmBadge({ ppm, status }: PpmBadgeProps) {
  const getBadgeColors = () => {
    switch (status) {
      case 'safe':
        return { bg: '#064E3B', border: colors.safe, text: '#A7F3D0' };
      case 'warning':
        return { bg: '#78350F', border: colors.warning, text: colors.amberLight };
      case 'toxic':
        return { bg: '#7F1D1D', border: colors.danger, text: '#FECACA' };
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'safe':
        return t('calculator.ppmStatusSafe');
      case 'warning':
        return t('calculator.ppmStatusWarning');
      case 'toxic':
        return t('calculator.ppmStatusToxic');
    }
  };

  const currentTheme = getBadgeColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.bg, borderColor: currentTheme.border },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.ppmValue, { color: currentTheme.text }]}>
          {ppm.toFixed(1)} PPM
        </Text>
        <View
          style={[styles.indicatorDot, { backgroundColor: currentTheme.border }]}
        />
      </View>
      <Text style={[styles.statusLabel, { color: currentTheme.text }]}>
        {getStatusText()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 8,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ppmValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
