/**
 * CHARCUTIER — Workshop-Proof Stepper Input
 * Apps4Brew Studio
 *
 * Designed for wet, salty, or gloved hands.
 * Large touch targets (min 56 pt) and quick increment buttons.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { colors } from '../theme/colors';

interface StepperInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  stepSmall?: number;
  stepLarge?: number;
  min?: number;
  max?: number;
  precision?: number;
}

export function StepperInput({
  label,
  value,
  onChange,
  unit = 'g',
  stepSmall = 10,
  stepLarge = 50,
  min = 0,
  max = 100000,
  precision = 0,
}: StepperInputProps) {
  const updateValue = (delta: number) => {
    const raw = value + delta;
    const clamped = Math.min(max, Math.max(min, raw));
    const rounded = Number(clamped.toFixed(precision));
    onChange(rounded);
  };

  const handleTextChange = (text: string) => {
    const parsed = parseFloat(text.replace(',', '.'));
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    } else if (text === '') {
      onChange(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Large Digital Display */}
      <View style={styles.displayCard}>
        <TextInput
          style={styles.textInput}
          value={value === 0 ? '' : value.toFixed(precision)}
          placeholder="0"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          onChangeText={handleTextChange}
        />
        <Text style={styles.unitText}>{unit}</Text>
      </View>

      {/* Stepper Buttons (each >= 56 pt height) */}
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => updateValue(-stepLarge)}
          activeOpacity={0.7}
        >
          <Text style={styles.stepperBtnText}>-{stepLarge}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => updateValue(-stepSmall)}
          activeOpacity={0.7}
        >
          <Text style={styles.stepperBtnText}>-{stepSmall}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => updateValue(stepSmall)}
          activeOpacity={0.7}
        >
          <Text style={styles.stepperBtnText}>+{stepSmall}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => updateValue(stepLarge)}
          activeOpacity={0.7}
        >
          <Text style={styles.stepperBtnText}>+{stepLarge}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  displayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
    minHeight: 64,
  },
  textInput: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.amberPrimary,
    textAlign: 'center',
    padding: 0,
    minWidth: 120,
  },
  unitText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepperBtn: {
    flex: 1,
    minHeight: colors.minTouchSize, // 56 pt
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});
