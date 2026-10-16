/**
 * CHARCUTIER — Workshop-Proof Touch Button
 * Apps4Brew Studio
 *
 * Rules:
 * - Minimum touch target 56x56 pt
 * - High contrast visual styling
 * - Distinct variants: primary, secondary, danger, outline
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../theme/colors';

interface TouchButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  minHeight?: number;
}

export function TouchButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  minHeight = colors.minTouchSize, // 56 pt
}: TouchButtonProps) {
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryBtn;
      case 'secondary':
        return styles.secondaryBtn;
      case 'danger':
        return styles.dangerBtn;
      case 'outline':
        return styles.outlineBtn;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'danger':
        return styles.dangerText;
      case 'outline':
        return styles.outlineText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { minHeight },
        getContainerStyle(),
        disabled && styles.disabledBtn,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textInverse : colors.amberPrimary}
        />
      ) : (
        <Text style={[styles.baseText, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  baseText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: colors.amberPrimary,
  },
  primaryText: {
    color: colors.textInverse,
  },
  secondaryBtn: {
    backgroundColor: colors.surfaceLight,
  },
  secondaryText: {
    color: colors.textPrimary,
  },
  dangerBtn: {
    backgroundColor: colors.danger,
  },
  dangerText: {
    color: colors.textPrimary,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.amberPrimary,
  },
  outlineText: {
    color: colors.amberPrimary,
  },
  disabledBtn: {
    opacity: 0.45,
  },
});
