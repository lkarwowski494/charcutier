/**
 * CHARCUTIER — Active & Historical Batches Screen
 * Apps4Brew Studio
 *
 * Implements:
 * - List of active batches in chamber / curing
 * - Weight loss progress indicator
 * - Case Hardening warning badges
 * - Navigation to batch passport details
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { t } from '../../src/i18n';
import { getAllBatches, getWeightLogsByBatchId } from '../../src/db/database';
import { Batch, BatchStatus, WeightLog } from '../../src/types';
import { TouchButton } from '../../src/components/TouchButton';
import { BatchQrScanner } from '../../src/components/BatchQrScanner';
import { useUnitSystem } from '../../src/hooks/useUnitSystem';
import {
  calculateReverseSchedule,
  ButcheryProcessType,
} from '../../src/core/reverse-scheduler';

interface BatchWithMetrics extends Batch {
  currentWeightG: number;
  currentLossPct: number;
  hasCaseHardening: boolean;
  daysElapsed: number;
}

export default function BatchesScreen() {
  const router = useRouter();
  const { formatWeight } = useUnitSystem();
  const [batches, setBatches] = useState<BatchWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | BatchStatus>('all');
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isSchedulerVisible, setIsSchedulerVisible] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<ButcheryProcessType>('smoked_ham');
  const [targetDaysAhead, setTargetDaysAhead] = useState(10);

  const targetDate = useMemo(() => {
    return new Date(Date.now() + targetDaysAhead * 24 * 3600 * 1000);
  }, [targetDaysAhead]);

  const reverseSchedule = useMemo(() => {
    return calculateReverseSchedule(selectedProcess, targetDate);
  }, [selectedProcess, targetDate]);

  const loadBatches = async () => {
    try {
      const rawBatches = await getAllBatches();
      const enriched: BatchWithMetrics[] = await Promise.all(
        rawBatches.map(async (b) => {
          const logs = await getWeightLogsByBatchId(b.id);
          const latestLog: WeightLog | undefined = logs[logs.length - 1];
          const currentWeightG = latestLog ? latestLog.weight_g : b.initial_weight_g;
          const currentLossPct = latestLog ? latestLog.loss_pct : 0;
          const hasCaseHardening = logs.some((l) => l.case_hardening_flag === 1);
          const daysElapsed = Math.max(0, Math.floor((Date.now() - b.created_at) / (24 * 3600 * 1000)));

          return {
            ...b,
            currentWeightG,
            currentLossPct,
            hasCaseHardening,
            daysElapsed,
          };
        })
      );
      setBatches(enriched);
    } catch (err) {
      console.warn('Failed to load batches:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBatches();
    }, [])
  );

  const filteredBatches = batches.filter((b) => {
    if (selectedFilter === 'all') return true;
    return b.status === selectedFilter;
  });

  const filterOptions: Array<{ key: 'all' | BatchStatus; label: string }> = [
    { key: 'all', label: t('batches.filterAll') },
    { key: 'curing', label: t('batches.filterCuring') },
    { key: 'drying', label: t('batches.filterDrying') },
    { key: 'smoking', label: t('batches.filterSmoking') },
    { key: 'maturing', label: t('batches.filterMaturing') },
    { key: 'ready', label: t('batches.filterReady') },
  ];

  const getStatusBadge = (status: BatchStatus) => {
    switch (status) {
      case 'curing':
        return { label: t('batches.filterCuring'), bg: '#1E3A8A', text: '#93C5FD' };
      case 'drying':
        return { label: t('batches.filterDrying'), bg: '#78350F', text: '#FDE68A' };
      case 'smoking':
        return { label: t('batches.filterSmoking'), bg: '#831843', text: '#FBCFE8' };
      case 'maturing':
        return { label: t('batches.filterMaturing'), bg: '#064E3B', text: '#A7F3D0' };
      case 'ready':
        return { label: t('batches.filterReady'), bg: '#14532D', text: '#86EFAC' };
      case 'archived':
        return { label: t('batches.filterArchived'), bg: colors.surfaceLight, text: colors.textSecondary };
    }
  };

  const renderBatchCard = ({ item }: { item: BatchWithMetrics }) => {
    const badge = getStatusBadge(item.status);
    const progress = Math.min(100, (item.currentLossPct / item.target_loss_pct) * 100);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/batches/${item.id}`)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleCol}>
            <Text style={styles.batchName}>{item.name}</Text>
            <Text style={styles.batchCut}>
              {item.cut_type} · {t(`calculator.types.${item.meat_type}`)}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusBadgeText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </View>
        </View>

        {/* Case Hardening Warning Chip */}
        {item.hasCaseHardening && (
          <View style={styles.alertChip}>
            <Text style={styles.alertChipText}>⚠️ ALARM: CASE HARDENING</Text>
          </View>
        )}

        {/* Weight Metrics Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>{t('batches.initialWeight')}</Text>
            <Text style={styles.metricVal}>{formatWeight(item.initial_weight_g)}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>{t('batches.currentWeight')}</Text>
            <Text style={[styles.metricVal, { color: colors.amberPrimary }]}>
              {formatWeight(item.currentWeightG)}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>{t('batches.currentLoss')}</Text>
            <Text style={styles.metricVal}>
              -{item.currentLossPct.toFixed(1)}% / {item.target_loss_pct.toFixed(0)}%
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>
            {t('batches.daysInChamber')}: <Text style={styles.bold}>{item.daysElapsed}</Text>
          </Text>
          <Text style={styles.cardArrow}>{t('common.details')} ›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filter Tabs & QR Scan Trigger */}
      <View style={styles.filterBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterOptions}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === item.key && styles.filterChipActive]}
              onPress={() => setSelectedFilter(item.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === item.key && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={styles.qrScanBtn}
          onPress={() => setIsScannerVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.qrScanBtnText}>📷 QR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.qrScanBtn, styles.schedulerTriggerBtn]}
          onPress={() => setIsSchedulerVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.qrScanBtnText}>⏳ Harmonogram</Text>
        </TouchableOpacity>
      </View>

      {/* Main List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.amberPrimary} />
        </View>
      ) : filteredBatches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🥩</Text>
          <Text style={styles.emptyTitle}>Brak partii w tej kategorii</Text>
          <Text style={styles.emptySubtitle}>{t('batches.emptyState')}</Text>
          <TouchButton
            title="Przygotuj Wsad w Kalkulatorze"
            onPress={() => router.push('/')}
            variant="primary"
            style={styles.emptyBtn}
          />
        </View>
      ) : (
        <FlatList
          data={filteredBatches}
          keyExtractor={(item) => item.id}
          renderItem={renderBatchCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadBatches();
              }}
              tintColor={colors.amberPrimary}
            />
          }
        />
      )}

      {/* Reverse Process Scheduler Modal */}
      <Modal
        visible={isSchedulerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSchedulerVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.schedulerModalContainer}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.schedulerTitle}>⏳ {t('scheduler.title')}</Text>
              <TouchableOpacity onPress={() => setIsSchedulerVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.schedulerSubtitle}>{t('scheduler.subtitle')}</Text>

            {/* Process Selector */}
            <Text style={styles.pickerLabel}>{t('scheduler.productType')}:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.processChipRow}>
              {(['smoked_ham', 'smoked_sausage', 'dry_cured_loin', 'pastrami', 'kabanos'] as ButcheryProcessType[]).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.processChip, selectedProcess === p && styles.processChipActive]}
                  onPress={() => setSelectedProcess(p)}
                >
                  <Text style={[styles.processChipText, selectedProcess === p && styles.processChipTextActive]}>
                    {t(`scheduler.products.${p}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Target Date Stepper */}
            <View style={styles.targetDaysRow}>
              <Text style={styles.targetDaysLabel}>
                {t('scheduler.targetLabel')} <Text style={styles.targetDaysBold}>{reverseSchedule.targetDate.toLocaleDateString()}</Text> ({targetDaysAhead} {t('common.days')})
              </Text>
              <View style={styles.daysStepperRow}>
                <TouchableOpacity
                  style={styles.dayStepBtn}
                  onPress={() => setTargetDaysAhead((d) => Math.max(2, d - 1))}
                >
                  <Text style={styles.dayStepBtnText}>-1d</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dayStepBtn}
                  onPress={() => setTargetDaysAhead((d) => d + 1)}
                >
                  <Text style={styles.dayStepBtnText}>+1d</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dayStepBtn}
                  onPress={() => setTargetDaysAhead((d) => d + 7)}
                >
                  <Text style={styles.dayStepBtnText}>{t('scheduler.plusOneWeek')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.timelineSummaryBox}>
              <Text style={styles.timelineSummaryText}>
                ⏱️ {t('scheduler.totalDuration', { days: reverseSchedule.totalDurationDays })}
              </Text>
              <Text style={styles.timelineStartText}>
                🚀 Start peklowania: <Text style={styles.timelineStartBold}>{new Date(reverseSchedule.cureStartTimestamp).toLocaleDateString()} {new Date(reverseSchedule.cureStartTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </Text>
            </View>

            {/* Steps List */}
            <ScrollView style={styles.stepsListScroll}>
              {reverseSchedule.steps.map((step, idx) => (
                <View key={step.id} style={styles.stepCard}>
                  <View style={styles.stepHeaderRow}>
                    <View style={styles.stepIndexBadge}>
                      <Text style={styles.stepIndexText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.stepName}>{step.stepName}</Text>
                  </View>
                  <Text style={styles.stepTimeRange}>
                    📅 {new Date(step.startTimestamp).toLocaleDateString()} {new Date(step.startTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → {new Date(step.endTimestamp).toLocaleDateString()} {new Date(step.endTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  {step.targetTempC !== undefined && (
                    <Text style={styles.stepTemp}>🌡️ Temp. procesu: {step.targetTempC}°C</Text>
                  )}
                  <Text style={styles.stepInstruction}>{step.instruction}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchButton
              title={t('common.close')}
              onPress={() => setIsSchedulerVisible(false)}
              variant="primary"
              style={styles.closeSchedulerBtn}
            />
          </View>
        </View>
      </Modal>

      {/* Chamber QR Code Scanner Modal */}
      <BatchQrScanner
        visible={isScannerVisible}
        onClose={() => setIsScannerVisible(false)}
        onScanBatchId={(batchId) => {
          router.push(`/batches/${batchId}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBar: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qrScanBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.amberPrimary,
    marginLeft: 8,
  },
  qrScanBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textInverse,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    marginRight: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: colors.amberPrimary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.textInverse,
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleCol: {
    flex: 1,
    marginRight: 8,
  },
  batchName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  batchCut: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  alertChip: {
    backgroundColor: '#7F1D1D',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  alertChipText: {
    color: '#FEE2E2',
    fontSize: 11,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
    marginTop: 4,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.safe,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bold: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cardArrow: {
    fontSize: 13,
    color: colors.amberPrimary,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 54,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyBtn: {
    minWidth: 240,
  },
  schedulerTriggerBtn: {
    backgroundColor: '#854D0E',
    borderColor: '#CA8A04',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 16,
  },
  schedulerModalContainer: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 18,
    maxHeight: '90%',
    borderWidth: 1.5,
    borderColor: colors.amberPrimary,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  schedulerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  closeBtnText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  schedulerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.amberLight,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  processChipRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  processChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginRight: 8,
  },
  processChipActive: {
    backgroundColor: colors.amberPrimary,
    borderColor: colors.amberLight,
  },
  processChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  processChipTextActive: {
    color: colors.textInverse,
    fontWeight: '800',
  },
  targetDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  targetDaysLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  targetDaysBold: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  daysStepperRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dayStepBtn: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dayStepBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timelineSummaryBox: {
    backgroundColor: '#78350F',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  timelineSummaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FEF3C7',
    marginBottom: 2,
  },
  timelineStartText: {
    fontSize: 11,
    color: '#FDE68A',
  },
  timelineStartBold: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepsListScroll: {
    maxHeight: 280,
    marginBottom: 12,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stepIndexBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.amberPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndexText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textInverse,
  },
  stepName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepTimeRange: {
    fontSize: 11,
    color: colors.amberLight,
    marginBottom: 2,
  },
  stepTemp: {
    fontSize: 11,
    color: '#93C5FD',
    marginBottom: 4,
  },
  stepInstruction: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  closeSchedulerBtn: {
    marginTop: 4,
  },
});
