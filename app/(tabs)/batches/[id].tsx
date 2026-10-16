/**
 * CHARCUTIER — Batch Passport & Weight Logging Screen
 * Apps4Brew Studio
 *
 * Implements:
 * - Full batch passport metrics
 * - Weight loss kinetics SVG chart
 * - Stepper-assisted weighing registration
 * - Case Hardening detector on new weighings
 * - Transition to Smoking Assistant
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../../src/theme/colors';
import { t } from '../../../src/i18n';
import {
  getBatchById,
  getWeightLogsByBatchId,
  createWeightLog,
  deleteBatch,
} from '../../../src/db/database';
import { Batch, WeightLog } from '../../../src/types';
import { WeightChart } from '../../../src/components/WeightChart';
import { StepperInput } from '../../../src/components/StepperInput';
import { TouchButton } from '../../../src/components/TouchButton';
import { CaseHardeningAlert } from '../../../src/components/CaseHardeningAlert';
import { Apps4BrewPassModal } from '../../../src/components/Apps4BrewPassModal';
import { useAppAccess } from '../../../src/hooks/useAppAccess';
import { useUnitSystem } from '../../../src/hooks/useUnitSystem';
import {
  calculateDailyLossRate,
  checkCaseHardening,
  estimateReadinessDate,
  checkFermentationSafety,
} from '../../../src/core/weight-loss-engine';
import { createBackup } from '../../../src/services/backup';
import { SensoryRadarChart } from '../../../src/components/SensoryRadarChart';
import {
  DEFAULT_SENSORY_PROFILE,
  SensoryProfile,
  SENSORY_AXES,
} from '../../../src/core/sensory-radar';

export default function BatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { guardAction, isPassModalVisible, setIsPassModalVisible } = useAppAccess();
  const { formatWeight } = useUnitSystem();

  const [batch, setBatch] = useState<Batch | null>(null);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);

  // New weighing form state
  const [newWeightG, setNewWeightG] = useState<number>(0);
  const [chamberTempC, setChamberTempC] = useState<string>('12');
  const [chamberRhPct, setChamberRhPct] = useState<string>('78');

  // Salami Fermentation & pH monitoring state (BR-WAGA-006 / RD-27)
  const [fermentPh, setFermentPh] = useState<string>('5.2');
  const [fermentHours, setFermentHours] = useState<string>('36');

  // Sensory evaluation state
  const [sensoryProfile, setSensoryProfile] = useState<SensoryProfile>(DEFAULT_SENSORY_PROFILE);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const b = await getBatchById(id);
      if (b) {
        setBatch(b);
        const wLogs = await getWeightLogsByBatchId(b.id);
        setLogs(wLogs);
        if (wLogs.length > 0) {
          setNewWeightG(wLogs[wLogs.length - 1].weight_g);
        } else {
          setNewWeightG(b.initial_weight_g);
        }
      }
    } catch (err) {
      console.warn('Failed to load batch passport:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !batch) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.amberPrimary} />
      </View>
    );
  }

  const latestLog = logs[logs.length - 1];
  const currentWeightG = latestLog ? latestLog.weight_g : batch.initial_weight_g;
  const currentLossPct = latestLog ? latestLog.loss_pct : 0;
  const hasCaseHardening = logs.some((l) => l.case_hardening_flag === 1);
  const daysInChamber = Math.max(0, Math.floor((Date.now() - batch.created_at) / (24 * 3600 * 1000)));

  const projection = estimateReadinessDate(
    batch.initial_weight_g,
    batch.target_loss_pct,
    logs,
    batch.created_at
  );

  const fermentationResult = useMemo(() => {
    const phVal = parseFloat(fermentPh);
    const hrsVal = parseFloat(fermentHours);
    if (isNaN(phVal)) return null;
    return checkFermentationSafety(phVal, isNaN(hrsVal) ? 24 : hrsVal);
  }, [fermentPh, fermentHours]);

  const updateSensoryScore = (axisKey: keyof Omit<SensoryProfile, 'overallRating' | 'tastingNotes' | 'tastedAt'>, delta: number) => {
    setSensoryProfile((prev) => {
      const current = prev[axisKey];
      const next = Math.max(1, Math.min(5, current + delta));
      return { ...prev, [axisKey]: next };
    });
  };

  const handleSaveWeighing = () => {
    guardAction(async () => {
      if (newWeightG <= 0) {
        Alert.alert(t('common.warning'), t('batches.invalidWeightAlert'));
        return;
      }

      const now = Date.now();
      const prevLog = logs[logs.length - 1];
      const prevWeight = prevLog ? prevLog.weight_g : batch.initial_weight_g;
      const prevTime = prevLog ? prevLog.recorded_at : batch.created_at;

      const deltaMillis = Math.max(1000, now - prevTime);
      const dailyRate = calculateDailyLossRate(
        prevWeight,
        newWeightG,
        batch.initial_weight_g,
        deltaMillis
      );

      const lossGrams = batch.initial_weight_g - newWeightG;
      const lossPct = Math.round((lossGrams / batch.initial_weight_g) * 100 * 10) / 10;

      const rhParsed = parseFloat(chamberRhPct);
      const tempParsed = parseFloat(chamberTempC);

      const daysElapsed = (now - batch.created_at) / (24 * 3600 * 1000);
      const chCheck = checkCaseHardening(
        dailyRate,
        daysElapsed,
        isNaN(rhParsed) ? null : rhParsed
      );

      const newLog: WeightLog = {
        id: `weight_${now}`,
        batch_id: batch.id,
        weight_g: newWeightG,
        loss_pct: lossPct,
        daily_loss_rate: dailyRate,
        case_hardening_flag: chCheck.isCaseHardening ? 1 : 0,
        temp_c: isNaN(tempParsed) ? null : tempParsed,
        rh_pct: isNaN(rhParsed) ? null : rhParsed,
        recorded_at: now,
        notes: null,
      };

      try {
        await createWeightLog(newLog);
        await createBackup();
        await loadData();

        if (chCheck.isCaseHardening) {
          Alert.alert(
            t('batches.caseHardeningAlarmTitle'),
            t('batches.caseHardeningAlarmMsg', { rate: dailyRate.toFixed(1) })
          );
        } else {
          Alert.alert(t('common.success'), t('batches.weighingSuccessAlert'));
        }
      } catch (err) {
        console.error('Failed to save weight log:', err);
        Alert.alert(t('common.error'), t('batches.weighingErrorAlert'));
      }
    });
  };

  const handleDeleteBatch = () => {
    Alert.alert(
      t('common.warning'),
      t('batches.deleteBatchConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBatch(batch.id);
              await createBackup();
              router.replace('/batches');
            } catch (err) {
              Alert.alert(t('common.error'), t('batches.deleteBatchError'));
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Batch Header Passport Card */}
      <View style={styles.passportCard}>
        <Text style={styles.passportTitle}>{batch.name}</Text>
        <Text style={styles.passportSubtitle}>
          {batch.cut_type} · {t(`calculator.types.${batch.meat_type}`)} · {t(`calculator.methods.${batch.cure_type}`)}
        </Text>

        <View style={styles.statGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('batches.initialWeight')}</Text>
            <Text style={styles.statValue}>{formatWeight(batch.initial_weight_g)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('batches.currentWeight')}</Text>
            <Text style={[styles.statValue, { color: colors.amberPrimary }]}>
              {formatWeight(currentWeightG)}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('batches.currentLoss')}</Text>
            <Text style={[styles.statValue, { color: colors.safe }]}>
              -{currentLossPct.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('batches.targetLoss')}</Text>
            <Text style={styles.statValue}>{batch.target_loss_pct.toFixed(0)}%</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            {t('batches.daysInProcess')} <Text style={styles.bold}>{daysInChamber}</Text>
          </Text>
          {projection.daysRemaining !== null && (
            <Text style={styles.infoText}>
              {t('batches.estimatedReadyIn')} <Text style={styles.bold}>~{projection.daysRemaining} {t('common.days')}</Text>
            </Text>
          )}
        </View>
      </View>

      {/* Case Hardening Warning Banner if detected */}
      {hasCaseHardening && (
        <CaseHardeningAlert
          dailyRatePct={latestLog?.daily_loss_rate}
          daysElapsed={daysInChamber}
        />
      )}

      {/* Weight Loss Kinetics Chart */}
      <Text style={styles.sectionHeader}>{t('batches.weightHistoryTitle')}</Text>
      <WeightChart
        initialWeightG={batch.initial_weight_g}
        targetLossPct={batch.target_loss_pct}
        logs={logs}
      />

      {/* Register New Weighing Section */}
      <View style={styles.weighingSection}>
        <Text style={styles.sectionHeader}>{t('batches.logWeightModalTitle')}</Text>

        <StepperInput
          label={t('batches.newBatchWeight')}
          value={newWeightG}
          onChange={setNewWeightG}
          unit="g"
          stepSmall={10}
          stepLarge={50}
          min={50}
          max={batch.initial_weight_g * 1.2}
        />

        <View style={styles.envRow}>
          <View style={styles.envField}>
            <Text style={styles.envLabel}>{t('batches.chamberTemp')}</Text>
            <TextInput
              style={styles.envInput}
              value={chamberTempC}
              onChangeText={setChamberTempC}
              keyboardType="numeric"
              placeholder="12"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.envField}>
            <Text style={styles.envLabel}>{t('batches.chamberRh')}</Text>
            <TextInput
              style={styles.envInput}
              value={chamberRhPct}
              onChangeText={setChamberRhPct}
              keyboardType="numeric"
              placeholder="78"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <TouchButton
          title={t('batches.addWeightBtn')}
          onPress={handleSaveWeighing}
          variant="primary"
          style={styles.saveWeightBtn}
        />
      </View>

      {/* 3b. Salami Fermentation & pH Monitoring (BR-WAGA-006 / RD-27) */}
      <View style={styles.fermentCard}>
        <Text style={styles.sectionHeader}>🧪 {t('batches.fermentationTitle')}</Text>
        <Text style={styles.fermentSubtitle}>{t('batches.fermentationDesc')}</Text>

        <View style={styles.envRow}>
          <View style={styles.envField}>
            <Text style={styles.envLabel}>{t('batches.fermentationPhInput')}</Text>
            <TextInput
              style={styles.envInput}
              value={fermentPh}
              onChangeText={setFermentPh}
              keyboardType="numeric"
              placeholder="5.2"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.envField}>
            <Text style={styles.envLabel}>{t('batches.fermentationHoursInput')}</Text>
            <TextInput
              style={styles.envInput}
              value={fermentHours}
              onChangeText={setFermentHours}
              keyboardType="numeric"
              placeholder="36"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {fermentationResult && (
          <View style={[
            styles.fermentStatusBadge,
            fermentationResult.status === 'safe'
              ? styles.fermentSafe
              : fermentationResult.status === 'stalled_danger'
              ? styles.fermentDanger
              : styles.fermentWarning
          ]}>
            <Text style={styles.fermentStatusTitle}>
              {fermentationResult.status === 'safe' ? '🛡️ ' : fermentationResult.status === 'stalled_danger' ? '⛔ ' : '⏳ '}
              {t(fermentationResult.statusKey)}
            </Text>
            <Text style={styles.fermentStatusDesc}>
              {t(fermentationResult.messageKey)}
            </Text>
          </View>
        )}
      </View>

      {/* 5. Sensory Tasting Radar Card */}
      <View style={styles.sensoryCard}>
        <Text style={styles.sectionHeader}>👅 {t('sensory.title')}</Text>
        <View style={styles.radarWrapper}>
          <SensoryRadarChart profile={sensoryProfile} size={280} />
        </View>

        {/* Sensory Tweak Grid */}
        <View style={styles.sensoryTweakGrid}>
          {SENSORY_AXES.map((axis) => (
            <View key={axis.key} style={styles.sensoryAxisRow}>
              <Text style={styles.axisLabel}>{t(axis.labelKey)}</Text>
              <View style={styles.axisControls}>
                <TouchableOpacity
                  style={styles.axisBtn}
                  onPress={() => updateSensoryScore(axis.key as any, -1)}
                >
                  <Text style={styles.axisBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.axisScore}>{sensoryProfile[axis.key as keyof typeof sensoryProfile]}</Text>
                <TouchableOpacity
                  style={styles.axisBtn}
                  onPress={() => updateSensoryScore(axis.key as any, 1)}
                >
                  <Text style={styles.axisBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Actions: Proceed to Smoking */}
      <View style={styles.actionBlock}>
        <TouchButton
          title={t('batches.startSmoking')}
          onPress={() => router.push(`/smoking/${batch.id}`)}
          variant="outline"
          style={styles.smokeActionBtn}
        />

        <TouchableOpacity style={styles.deleteLink} onPress={handleDeleteBatch}>
          <Text style={styles.deleteLinkText}>{t('batches.deleteThisBatch')}</Text>
        </TouchableOpacity>
      </View>

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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  passportCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.amberPrimary,
    marginBottom: 16,
  },
  passportTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  passportSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
    paddingTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bold: {
    fontWeight: '800',
    color: colors.amberLight,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 8,
  },
  weighingSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginTop: 10,
    marginBottom: 16,
  },
  envRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  envField: {
    flex: 1,
  },
  envLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  envInput: {
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    paddingHorizontal: 12,
    minHeight: 48,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  saveWeightBtn: {
    marginTop: 4,
  },
  actionBlock: {
    gap: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  smokeActionBtn: {
    width: '100%',
  },
  deleteLink: {
    padding: 12,
  },
  deleteLinkText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  costCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginBottom: 16,
  },
  costRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  costStatBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  costStatLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  costStatVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  savingsBanner: {
    backgroundColor: '#064E3B',
    borderRadius: 8,
    padding: 8,
  },
  savingsBannerText: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  sensoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginBottom: 16,
    alignItems: 'center',
  },
  radarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  sensoryTweakGrid: {
    width: '100%',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
    paddingTop: 10,
  },
  sensoryAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  axisLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  axisControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  axisBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  axisBtnText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  axisScore: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.amberLight,
    width: 20,
    textAlign: 'center',
  },
  fermentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginTop: 10,
    marginBottom: 16,
  },
  fermentSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  fermentStatusBadge: {
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    borderWidth: 1.5,
  },
  fermentSafe: {
    backgroundColor: '#064E3B',
    borderColor: colors.safe,
  },
  fermentWarning: {
    backgroundColor: '#451A03',
    borderColor: colors.amberPrimary,
  },
  fermentDanger: {
    backgroundColor: '#450A0A',
    borderColor: colors.danger,
  },
  fermentStatusTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  fermentStatusDesc: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 16,
  },
});
