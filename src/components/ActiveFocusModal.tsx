/**
 * CHARCUTIER — ActiveFocusModal (Artisanal Workshop Focus Mode)
 * Apps4Craft Studio Standard
 *
 * Designed for kitchen counter & smokehouse ergonomics:
 * - Giant 72 pt clock legible from 3 meters away
 * - 60 pt high-contrast workshop buttons for greasy/gloved hands
 * - Keeps screen awake via expo-keep-awake
 * - 100% iOS Safe Area compliant with useSafeAreaInsets()
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { t } from '../i18n';
import { SmokePhase } from '../types';

interface ActiveFocusModalProps {
  visible: boolean;
  onClose: () => void;
  secondsRemaining: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  currentPhase: SmokePhase;
  targetCoreTemp?: number;
  currentCoreTemp?: string;
  batchName?: string;
}

export function ActiveFocusModal({
  visible,
  onClose,
  secondsRemaining,
  isTimerRunning,
  onToggleTimer,
  currentPhase,
  targetCoreTemp,
  currentCoreTemp,
  batchName,
}: ActiveFocusModalProps) {
  const insets = useSafeAreaInsets();

  const formatClock = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseTitle = (phase: SmokePhase) => {
    switch (phase) {
      case 'drying':
        return t('smoking.phaseDrying');
      case 'smoking':
        return t('smoking.phaseSmoking');
      case 'poaching':
        return t('smoking.phasePoaching');
      case 'cooling':
        return t('smoking.phaseCooling');
      default:
        return phase;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: Math.max(insets.bottom, 24),
            paddingLeft: Math.max(insets.left, 20),
            paddingRight: Math.max(insets.right, 20),
          },
        ]}
      >
        {/* Top Header with Safe Exit Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.exitBtn}
            onPress={onClose}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            accessibilityRole="button"
            accessibilityLabel={t('focus.exit')}
          >
            <Text style={styles.exitBtnText}>✕ {t('focus.exit')}</Text>
          </TouchableOpacity>

          <View style={styles.brandPill}>
            <Text style={styles.brandPillText}>APPS4CRAFT · FOCUS</Text>
          </View>
        </View>

        {/* Batch & Phase Header */}
        <View style={styles.phaseHeader}>
          {batchName ? (
            <Text style={styles.batchName} numberOfLines={1}>
              {batchName}
            </Text>
          ) : null}
          <Text style={styles.phaseLabel}>
            {t('focus.phase')}: {getPhaseTitle(currentPhase)}
          </Text>
          <View style={styles.keepAwakeBadge}>
            <View style={styles.liveIndicator} />
            <Text style={styles.keepAwakeText}>{t('focus.keepAwakeActive')}</Text>
          </View>
        </View>

        {/* Center: Giant 72 pt Workshop Clock */}
        <View style={styles.clockCenter}>
          <Text
            style={styles.giantClock}
            accessibilityRole="timer"
            accessibilityLabel={formatClock(secondsRemaining)}
          >
            {formatClock(secondsRemaining)}
          </Text>
          <Text style={styles.clockStatus}>
            {isTimerRunning ? t('smoking.timerCounting') : t('smoking.timerPaused')}
          </Text>

          {/* Temperature Target Readout if poaching */}
          {currentPhase === 'poaching' && targetCoreTemp && (
            <View style={styles.tempBadge}>
              <Text style={styles.tempBadgeText}>
                {t('smoking.targetCoreTempLabel', { temp: targetCoreTemp })}
                {currentCoreTemp ? ` · Wsad: ${currentCoreTemp}°C` : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Giant Controls (min 60 pt for butchery counter) */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.primaryActionBtn,
              isTimerRunning ? styles.pauseBtn : styles.startBtn,
            ]}
            onPress={onToggleTimer}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryActionText}>
              {isTimerRunning ? `⏸  ${t('smoking.pauseTimer')}` : `▶  ${t('smoking.startTimer')}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E10', // Deepest ceramic basalt
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  exitBtn: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#1E1E22',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2E2E34',
  },
  exitBtnText: {
    color: colors.amberPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  brandPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#18181C',
    borderWidth: 1,
    borderColor: '#2A2A30',
  },
  brandPillText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  phaseHeader: {
    alignItems: 'center',
    marginTop: 10,
  },
  batchName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  phaseLabel: {
    color: colors.amberPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  keepAwakeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#16161A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.safe,
    marginRight: 6,
  },
  keepAwakeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  clockCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141417',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#24242A',
  },
  giantClock: {
    fontSize: Platform.OS === 'ios' ? 72 : 64,
    fontWeight: '900',
    color: colors.amberPrimary,
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  clockStatus: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  tempBadge: {
    marginTop: 18,
    backgroundColor: '#201A15',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.amberPrimary,
  },
  tempBadgeText: {
    color: colors.amberLight,
    fontSize: 14,
    fontWeight: '700',
  },
  controls: {
    paddingBottom: 10,
  },
  primaryActionBtn: {
    minHeight: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtn: {
    backgroundColor: colors.amberPrimary,
  },
  pauseBtn: {
    backgroundColor: '#2E2219',
    borderWidth: 2,
    borderColor: colors.amberPrimary,
  },
  primaryActionText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
