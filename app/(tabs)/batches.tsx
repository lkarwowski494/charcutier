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

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { t } from '../../src/i18n';
import { getAllBatches, getWeightLogsByBatchId } from '../../src/db/database';
import { Batch, BatchStatus, WeightLog } from '../../src/types';
import { TouchButton } from '../../src/components/TouchButton';
import { BatchQrScanner } from '../../src/components/BatchQrScanner';

interface BatchWithMetrics extends Batch {
  currentWeightG: number;
  currentLossPct: number;
  hasCaseHardening: boolean;
  daysElapsed: number;
}

export default function BatchesScreen() {
  const router = useRouter();
  const [batches, setBatches] = useState<BatchWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | BatchStatus>('all');
  const [isScannerVisible, setIsScannerVisible] = useState(false);

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
        return { label: 'Peklowanie', bg: '#1E3A8A', text: '#93C5FD' };
      case 'drying':
        return { label: 'Osuszanie', bg: '#78350F', text: '#FDE68A' };
      case 'smoking':
        return { label: 'Wędzenie', bg: '#831843', text: '#FBCFE8' };
      case 'maturing':
        return { label: 'Dojrzewalnia', bg: '#064E3B', text: '#A7F3D0' };
      case 'ready':
        return { label: 'Gotowe', bg: '#14532D', text: '#86EFAC' };
      case 'archived':
        return { label: 'Archiwum', bg: colors.surfaceLight, text: colors.textSecondary };
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
            <Text style={styles.metricVal}>{item.initial_weight_g.toFixed(0)} g</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>{t('batches.currentWeight')}</Text>
            <Text style={[styles.metricVal, { color: colors.amberPrimary }]}>
              {item.currentWeightG.toFixed(0)} g
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
            Dni w komorze: <Text style={styles.bold}>{item.daysElapsed}</Text>
          </Text>
          <Text style={styles.cardArrow}>Szczegóły ›</Text>
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
          <Text style={styles.qrScanBtnText}>📷 Skanuj QR</Text>
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
});
