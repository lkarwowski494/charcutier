/**
 * CHARCUTIER — Workshop-Proof Touch Button
 * Apps4Craft Studio Standard
 *
 * Implements @apps4craft/ui CraftButton with kitchen-ergonomics (min 52pt).
 */

import React from 'react';
import { ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { CraftButton, CraftButtonVariant } from '@apps4craft/ui';
import { colors } from '../theme/colors';

export interface TouchButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  minHeight?: number;
  testID?: string;
  icon?: React.ReactNode;
}

export function TouchButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  minHeight,
  testID = 'touch-button',
  icon,
}: TouchButtonProps) {
  // Map variant to CraftButtonVariant
  const craftVariant: CraftButtonVariant =
    variant === 'outline' ? 'ghost' : variant;

  const flattenedStyle = StyleSheet.flatten([
    minHeight ? { minHeight } : null,
    variant === 'outline'
      ? {
          borderWidth: 1.5,
          borderColor: colors.accent,
          backgroundColor: 'transparent',
        }
      : null,
    style,
  ]) as ViewStyle | undefined;

  const flattenedLabelStyle = StyleSheet.flatten([
    variant === 'outline' ? { color: colors.accent, fontWeight: '700' } : null,
    textStyle,
  ]) as TextStyle | undefined;

  return (
    <CraftButton
      label={title}
      onPress={onPress}
      variant={craftVariant}
      accentColor={colors.accent}
      disabled={disabled}
      loading={loading}
      style={flattenedStyle}
      labelStyle={flattenedLabelStyle}
      testID={testID}
      icon={icon}
    />
  );
}
