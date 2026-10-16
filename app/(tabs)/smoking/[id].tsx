/**
 * CHARCUTIER — 4-Phase Smoking & Thermal Processing Assistant
 * Apps4Brew Studio
 *
 * Implements:
 * - expo-keep-awake to keep screen on with dirty/greasy butcher hands
 * - 4-Phase State Machine (Drying -> Smoking -> Poaching -> Cooling)
 * - P0 Parchment surface confirmation blocker
 * - P0 Water bath >82°C fat-rendering alert
 * - Authentic PCM WAV dual-tone craft chime on timer completion
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { colors } from '../../../src/theme/colors';
import { t } from '../../../src/i18n';
import { getBatchById, updateBatch } from '../../../src/db/database';
import { Batch, SmokePhase } from '../../../src/types';
import { TouchButton } from '../../../src/components/TouchButton';
import { Apps4BrewPassModal } from '../../../src/components/Apps4BrewPassModal';
import { useAppAccess } from '../../../src/hooks/useAppAccess';
import {
  getTargetCoreTemp,
  validatePhaseTransition,
  checkWaterBathTemp,
  SMOKE_WOOD_PROFILES,
} from '../../../src/core/smoking-engine';
import { playTimerChime } from '../../../src/utils/timer-audio';
import { createBackup } from '../../../src/services/backup';

export default function SmokingAssistantScreen() {
  // Prevent screen sleep during butchery smoking/poaching
  useKeepAwake();

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { guardAction, isPassModalVisible, setIsPassModalVisible } = useAppAccess();

  const [batch, setBatch] = useState<Batch | null>(null);
  const [currentPhase, setCurrentPhase] = useState<SmokePhase>('drying');

  // Phase 1 (Drying) state
  const [isParchmentConfirmed, setIsParchmentConfirmed] = useState(false);

  // Phase 2 (Smoking) state
  const [selectedWood, setSelectedWood] = useState<string>('alder');
  const [smokeDurationMinutes, setSmokeDurationMinutes] = useState<number>(180);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(180 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Phase 3 (Poaching) state
  const [waterBathTempC, setWaterBathTempC] = useState<string>('78');
  const [currentCoreTempC, setCurrentCoreTempC] = useState<string>('20');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadBatch() {
      if (id) {
        const b = await getBatchById(id);
        if (b) setBatch(b);
      }
    }
    loadBatch();
  }, [id]);

  // Timer interval handling
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as any);
            setIsTimerRunning(false);
            playTimerChime();
            Alert.alert(t('smoking.timerAlertTitle'), t('smoking.timerAlertMsg'));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const targetCoreTemp = getTargetCoreTemp(batch ? `${batch.cut_type} ${batch.meat_type}` : 'ham');
  const waterCheck = checkWaterBathTemp(parseFloat(waterBathTempC) || 0);

  const formatTimerDisplay = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    guardAction(() => {
      setIsTimerRunning(!isTimerRunning);
    });
  };

  const handleAdvanceToSmoking = () => {
    guardAction(() => {
      const check = validatePhaseTransition('drying', 'smoking', {
        parchmentConfirmed: isParchmentConfirmed,
      });

      if (!check.allowed) {
        Alert.alert(t('common.warning'), t(check.errorKey || 'smoking.dryingInstruction'));
        return;
      }

      setCurrentPhase('smoking');
      setSecondsRemaining(smokeDurationMinutes * 60);
    });
  };

  const handleFinishProcess = () => {
    guardAction(async () => {
      if (batch) {
        await updateBatch(batch.id, { status: 'ready' });
        await createBackup();
        Alert.alert(t('common.success'), t('smoking.processFinishedMsg'), [
          { text: t('common.done'), onPress: () => router.replace('/batches') },
        ]);
      }
    });
  };

  const phases: Array<{ key: SmokePhase; label: string; num: number }> = [
    { key: 'drying', label: t('smoking.phase1Short'), num: 1 },
    { key: 'smoking', label: t('smoking.phase2Short'), num: 2 },
    { key: 'poaching', label: t('smoking.phase3Short'), num: 3 },
    { key: 'cooling', label: t('smoking.phase4Short'), num: 4 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 4-Phase Stepper Header */}
      <View style={styles.phaseStepper}>
        {phases.map((p) => {
          const isActive = currentPhase === p.key;
          return (
            <TouchableOpacity
              key={p.key}
              style={[styles.phaseStep, isActive && styles.phaseStepActive]}
              onPress={() => setCurrentPhase(p.key)}
            >
              <Text style={[styles.phaseStepNum, isActive && styles.phaseStepNumActive]}>
                {p.num}
              </Text>
              <Text style={[styles.phaseStepLabel, isActive && styles.phaseStepLabelActive]}>
                {p.label.split('. ')[1]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* PHASE 1: DRYING (OSUSZANIE) */}
      {currentPhase === 'drying' && (
        <View style={styles.phaseCard}>
          <Text style={styles.phaseTitle}>{t('smoking.phaseDrying')}</Text>
          <Text style={styles.phaseInstruction}>{t('smoking.dryingInstruction')}</Text>

          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              {t('smoking.dryingTip')}
            </Text>
          </View>

          {/* P0 Parchment Surface Confirmation Checkbox */}
          <TouchableOpacity
            style={[styles.confirmBox, isParchmentConfirmed && styles.confirmBoxActive]}
            onPress={() => setIsParchmentConfirmed(!isParchmentConfirmed)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, isParchmentConfirmed && styles.checkboxActive]}>
              {isParchmentConfirmed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.confirmLabel}>{t('smoking.parchmentSurfaceConfirm')}</Text>
          </TouchableOpacity>

          <TouchButton
            title={t('smoking.startSmokingBtn')}
            onPress={handleAdvanceToSmoking}
            variant={isParchmentConfirmed ? 'primary' : 'secondary'}
            disabled={!isParchmentConfirmed}
            style={styles.advanceBtn}
          />
        </View>
      )}

      {/* PHASE 2: SMOKING (DYMIENIE) */}
      {currentPhase === 'smoking' && (
        <View style={styles.phaseCard}>
          <Text style={styles.phaseTitle}>{t('smoking.phaseSmoking')}</Text>

          {/* Wood Selector */}
          <Text style={styles.fieldLabel}>{t('smoking.woodType')}:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.woodList}>
            {Object.entries(SMOKE_WOOD_PROFILES).map(([woodKey, profile]) => (
              <TouchableOpacity
                key={woodKey}
                style={[styles.woodChip, selectedWood === woodKey && styles.woodChipActive]}
                onPress={() => setSelectedWood(woodKey)}
              >
                <Text style={[styles.woodChipText, selectedWood === woodKey && styles.woodChipTextActive]}>
                  {t(profile.nameKey)}
                </Text>
                <Text style={styles.woodFlavor}>{profile.colorKey}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Big Timer Display */}
          <View style={styles.timerDisplay}>
            <Text style={styles.timerDigits}>{formatTimerDisplay(secondsRemaining)}</Text>
            <Text style={styles.timerSub}>{isTimerRunning ? t('smoking.timerCounting') : t('smoking.timerPaused')}</Text>
          </View>

          <View style={styles.timerControls}>
            <TouchButton
              title={isTimerRunning ? t('smoking.pauseTimer') : t('smoking.startTimer')}
              onPress={handleToggleTimer}
              variant="primary"
              style={styles.controlBtn}
            />
            <TouchButton
              title={t('smoking.nextPoaching')}
              onPress={() => setCurrentPhase('poaching')}
              variant="secondary"
              style={styles.controlBtn}
            />
          </View>
        </View>
      )}

      {/* PHASE 3: POACHING / BAKING (PARZENIE) */}
      {currentPhase === 'poaching' && (
        <View style={styles.phaseCard}>
          <Text style={styles.phaseTitle}>{t('smoking.phasePoaching')}</Text>

          {/* P0 Water Bath Overheat Alert */}
          {waterCheck.isOverheating && (
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>⚠️ {t('smoking.waterTempAlert')}</Text>
              <Text style={styles.alertDesc}>
                {t('smoking.waterOverheatMsg', { temp: waterBathTempC })}
              </Text>
            </View>
          )}

          <View style={styles.tempGrid}>
            <View style={styles.tempCard}>
              <Text style={styles.tempLabel}>{t('smoking.waterBathTempLabel')}</Text>
              <TextInput
                style={[
                  styles.tempInput,
                  waterCheck.isOverheating && { borderColor: colors.danger, color: colors.danger },
                ]}
                value={waterBathTempC}
                onChangeText={setWaterBathTempC}
                keyboardType="numeric"
              />
              <Text style={styles.tempHint}>{t('smoking.optimalWaterTemp')}</Text>
            </View>

            <View style={styles.tempCard}>
              <Text style={styles.tempLabel}>{t('smoking.coreTempLabel')}</Text>
              <TextInput
                style={styles.tempInput}
                value={currentCoreTempC}
                onChangeText={setCurrentCoreTempC}
                keyboardType="numeric"
              />
              <Text style={[styles.tempHint, { color: colors.amberPrimary }]}>
                {t('smoking.targetCoreTempLabel', { temp: targetCoreTemp })}
              </Text>
            </View>
          </View>

          {parseFloat(currentCoreTempC) >= targetCoreTemp && (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>
                {t('smoking.coreTempReached', { temp: targetCoreTemp })}
              </Text>
            </View>
          )}

          <TouchButton
            title={t('smoking.nextCooling')}
            onPress={() => setCurrentPhase('cooling')}
            variant="primary"
            style={styles.advanceBtn}
          />
        </View>
      )}

      {/* PHASE 4: SHOCK COOLING (STUDZENIE) */}
      {currentPhase === 'cooling' && (
        <View style={styles.phaseCard}>
          <Text style={styles.phaseTitle}>{t('smoking.phaseCooling')}</Text>
          <Text style={styles.phaseInstruction}>
            {t('smoking.coolingInstruction')}
          </Text>

          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              {t('smoking.coolingTip')}
            </Text>
          </View>

          <TouchButton
            title={t('smoking.finishSession')}
            onPress={handleFinishProcess}
            variant="primary"
            style={styles.advanceBtn}
          />
        </View>
      )}

      <Apps4BrewPassModal
        visible={isPassModalVisible}
        onClose={() => setIsPassModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },
  phaseStepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  phaseStep: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  phaseStepActive: {
    backgroundColor: colors.amberPrimary,
  },
  phaseStepNum: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  phaseStepNumActive: {
    color: colors.textInverse,
  },
  phaseStepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  phaseStepLabelActive: {
    color: colors.textInverse,
  },
  phaseCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.surfaceLight,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.amberPrimary,
    marginBottom: 10,
  },
  phaseInstruction: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 14,
  },
  tipBox: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.amberPrimary,
    marginBottom: 16,
  },
  tipText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  confirmBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.surfaceLight,
    marginBottom: 16,
  },
  confirmBoxActive: {
    borderColor: colors.safe,
    backgroundColor: '#064E3B',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.amberPrimary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.safe,
    borderColor: colors.safe,
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  confirmLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  advanceBtn: {
    marginTop: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  woodList: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  woodChip: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    minWidth: 130,
  },
  woodChipActive: {
    borderColor: colors.amberPrimary,
    backgroundColor: '#27201C',
  },
  woodChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  woodChipTextActive: {
    color: colors.amberLight,
  },
  woodFlavor: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  timerDisplay: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.amberPrimary,
    marginVertical: 14,
  },
  timerDigits: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.amberPrimary,
    letterSpacing: 2,
  },
  timerSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  controlBtn: {
    flex: 1,
  },
  alertBox: {
    backgroundColor: '#450A0A',
    borderColor: colors.danger,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  alertTitle: {
    color: '#FEE2E2',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  alertDesc: {
    color: '#FECACA',
    fontSize: 12,
    lineHeight: 16,
  },
  tempGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tempCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    alignItems: 'center',
  },
  tempLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  tempInput: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 80,
    textAlign: 'center',
    marginBottom: 6,
  },
  tempHint: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  successBanner: {
    backgroundColor: '#064E3B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.safe,
  },
  successText: {
    color: '#A7F3D0',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
});
