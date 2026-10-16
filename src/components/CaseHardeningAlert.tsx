/**
 * CHARCUTIER — Case Hardening Alert Banner
 * Apps4Brew Studio
 *
 * P0 biological protection banner warning against surface protein collapse
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { t } from '../i18n';

interface CaseHardeningAlertProps {
  dailyRatePct?: number;
  daysElapsed?: number;
}

export function CaseHardeningAlert({
  dailyRatePct,
  daysElapsed,
}: CaseHardeningAlertProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.title}>{t('batches.chAlertTitle')}</Text>
      </View>
      <Text style={styles.description}>{t('batches.caseHardeningAlert')}</Text>

      {dailyRatePct !== undefined && (
        <View style={styles.metricsBox}>
          <Text style={styles.metricText}>
            {t('batches.chAlertRate')}: <Text style={styles.metricBold}>{dailyRatePct.toFixed(1)}%/dobę</Text> (limit: 3.0%)
          </Text>
          {daysElapsed !== undefined && (
            <Text style={styles.metricText}>
              {t('batches.chAlertDay')}: <Text style={styles.metricBold}>{daysElapsed.toFixed(0)}</Text>
            </Text>
          )}
        </View>
      )}

      <Text style={styles.actionNote}>
        {t('batches.chAlertAction')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#450A0A',
    borderColor: colors.danger,
    borderWidth: 2,
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  warningIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FEE2E2',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: '#FECACA',
    lineHeight: 18,
    marginBottom: 10,
  },
  metricsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  metricText: {
    fontSize: 12,
    color: '#FCA5A5',
  },
  metricBold: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionNote: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.amberLight,
  },
});
