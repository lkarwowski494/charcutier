import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { NumInput } from '../NumInput';
import { colors } from '../../theme/colors';

export { NumInput };

// ==========================================
// S1: CloseButton & DoneButton (NFR-INT-001)
// ==========================================
export interface CloseButtonProps {
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onPress,
  accessibilityLabel = 'Zamknij',
  testID = 'modal-close-button',
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    testID={testID}
    onPress={onPress}
    style={styles.headerButton}
    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
  >
    <Text style={styles.closeButtonText}>✕</Text>
  </TouchableOpacity>
);

export const DoneButton: React.FC<CloseButtonProps> = ({
  onPress,
  accessibilityLabel = 'Gotowe',
  testID = 'modal-done-button',
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    testID={testID}
    onPress={onPress}
    style={styles.headerButton}
    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
  >
    <Text style={styles.doneButtonText}>{accessibilityLabel}</Text>
  </TouchableOpacity>
);

// ==========================================
// S15: SearchField & Diacritics Normalizer (NFR-INT-015, RD-ENG-07)
// ==========================================
export function normalizeSearchQuery(text: string): string {
  return text
    .replace(/[łŁ]/g, (c) => (c === 'ł' ? 'l' : 'L'))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChangeText,
  placeholder = 'Szukaj...',
  accessibilityLabel = 'Szukaj',
  testID = 'search-field',
  style,
}) => (
  <View style={[styles.searchContainer, style]}>
    <TextInput
      style={styles.searchInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      autoCapitalize="none"
      autoCorrect={false}
    />
    {value.length > 0 && (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Wyczyść wyszukiwanie"
        onPress={() => onChangeText('')}
        style={styles.fieldClearButton}
        testID={`${testID}-clear`}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.fieldClearText}>✕</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ==========================================
// S11 & S12: Empty & Missing (NFR-INT-011, NFR-INT-012)
// ==========================================
export interface EmptyProps {
  title: string;
  hint?: string;
  actionTitle?: string;
  onAction?: () => void;
  testID?: string;
  style?: ViewStyle;
}

export const Empty: React.FC<EmptyProps> = ({
  title,
  hint,
  actionTitle,
  onAction,
  testID = 'empty-state',
  style,
}) => (
  <View style={[styles.emptyContainer, style]} testID={testID}>
    <Text style={styles.emptyTitle}>{title}</Text>
    {hint && <Text style={styles.emptyHint}>{hint}</Text>}
    {actionTitle && onAction && (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={actionTitle}
        onPress={onAction}
        style={styles.emptyActionButton}
      >
        <Text style={styles.emptyActionText}>{actionTitle}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export interface MissingProps {
  title?: string;
  hint?: string;
  onBack: () => void;
  testID?: string;
}

export const Missing: React.FC<MissingProps> = ({
  title = 'Nie znaleziono rekordu',
  hint = 'Ten element mógł zostać usunięty lub nie istnieje.',
  onBack,
  testID = 'missing-state',
}) => (
  <View style={styles.missingContainer} testID={testID}>
    <Text style={styles.missingTitle}>{title}</Text>
    <Text style={styles.missingHint}>{hint}</Text>
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Wróć"
      onPress={onBack}
      style={styles.missingBackButton}
    >
      <Text style={styles.missingBackText}>Powrót</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  headerButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  closeButtonText: {
    color: colors.textSecondary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  doneButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.surfaceLight,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    minHeight: 44,
  },
  fieldClearButton: {
    padding: 8,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldClearText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginVertical: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyActionButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  emptyActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  missingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  missingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  missingHint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  missingBackButton: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  missingBackText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
});
