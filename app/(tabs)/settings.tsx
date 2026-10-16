/**
 * CHARCUTIER — Settings & Apps4Brew Pass Management Screen
 * Apps4Brew Studio
 *
 * Implements:
 * - Apps4Brew Pass license status and strict restorePurchases
 * - 10 Rolling SQLite JSON backups manager with rotation
 * - Free CSV & JSON data exports (always available, even in Read-Only)
 * - Language and metric/imperial unit switchers
 */

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { colors } from '../../src/theme/colors';
import { t, setLanguage, getLanguage } from '../../src/i18n';
import { TouchButton } from '../../src/components/TouchButton';
import { Apps4BrewPassModal } from '../../src/components/Apps4BrewPassModal';
import { useAppAccess } from '../../src/hooks/useAppAccess';
import { useUnitSystem } from '../../src/hooks/useUnitSystem';
import {
  listBackups,
  createBackup,
  restoreBackup,
  exportBatchesToCsv,
  exportDatabaseToJson,
} from '../../src/services/backup';
import { setSetting } from '../../src/db/database';
import { AppLanguage, UnitSystem } from '../../src/types';

export default function SettingsScreen() {
  const {
    isUnlocked,
    isTrial,
    trialDaysLeft,
    tier,
    restorePurchases,
    isPassModalVisible,
    setIsPassModalVisible,
  } = useAppAccess();

  const { unitSystem, setUnitSystem } = useUnitSystem();
  const [currentLang, setCurrentLangState] = useState<AppLanguage>(getLanguage());
  const [backups, setBackups] = useState<Array<{ filename: string; path: string; size: number }>>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const loadSettingsAndBackups = async () => {
    try {
      setLoadingBackups(true);
      const bList = await listBackups();
      setBackups(bList);
    } catch (err) {
      console.warn('Error loading settings/backups:', err);
    } finally {
      setLoadingBackups(false);
    }
  };

  useEffect(() => {
    loadSettingsAndBackups();
  }, []);

  const handleLangChange = async (lang: AppLanguage) => {
    setLanguage(lang);
    setCurrentLangState(lang);
    await setSetting('app_lang', lang);
  };

  const handleUnitChange = async (system: UnitSystem) => {
    await setUnitSystem(system);
  };

  const handleCreateBackupNow = async () => {
    try {
      await createBackup();
      await loadSettingsAndBackups();
      Alert.alert(t('common.success'), t('settings.backupSuccess'));
    } catch (err) {
      Alert.alert(t('common.error'), t('settings.backupError'));
    }
  };

  const handleRestoreFromBackup = (filePath: string) => {
    Alert.alert(
      t('settings.restoreConfirmTitle'),
      t('settings.restoreConfirmMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: async () => {
            try {
              const content = await FileSystem.readAsStringAsync(filePath);
              await restoreBackup(content);
              Alert.alert(t('common.success'), t('settings.restoreSuccess'));
              await loadSettingsAndBackups();
            } catch (err) {
              Alert.alert(t('common.error'), t('settings.restoreError'));
            }
          },
        },
      ]
    );
  };

  const handleExportCsv = async () => {
    try {
      const csv = await exportBatchesToCsv();
      const path = `${FileSystem.cacheDirectory || FileSystem.documentDirectory}charcutier_partie.csv`;
      await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, { mimeType: 'text/csv' });
      } else {
        Alert.alert(t('common.success'), t('settings.exportSuccess'));
      }
    } catch (err) {
      Alert.alert(t('common.error'), t('settings.backupError'));
    }
  };

  const handleExportJson = async () => {
    try {
      const json = await exportDatabaseToJson();
      const path = `${FileSystem.cacheDirectory || FileSystem.documentDirectory}charcutier_pelna_baza.json`;
      await FileSystem.writeAsStringAsync(path, json, { encoding: FileSystem.EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, { mimeType: 'application/json' });
      } else {
        Alert.alert(t('common.success'), 'Plik JSON wygenerowany w pamięci podręcznej.');
      }
    } catch (err) {
      Alert.alert(t('common.error'), 'Błąd eksportu JSON.');
    }
  };

  const handleRestorePurchase = async () => {
    setIsRestoring(true);
    try {
      const res = await restorePurchases();
      if (res.success) {
        Alert.alert(t('common.success'), t(res.messageKey));
      } else {
        Alert.alert(t('common.warning'), t(res.messageKey));
      }
    } catch {
      Alert.alert(t('common.error'), t('access.restoreError'));
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. APPS4BREW PASS LICENSE CARD */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>{t('settings.apps4BrewPass')}</Text>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>{t('settings.subscriptionStatus')}:</Text>
          <Text style={styles.statusVal}>
            {tier
              ? `${t('settings.unlockedStatus')} (${tier.toUpperCase()})`
              : isTrial
              ? `${t('settings.trialStatus', { days: trialDaysLeft })}`
              : t('access.trialExpired')}
          </Text>
        </View>

        <View style={styles.licenseBtnRow}>
          <TouchButton
            title={tier ? 'Zarządzaj Licencją' : 'Odblokuj CHARCUTIER Pass'}
            onPress={() => setIsPassModalVisible(true)}
            variant="primary"
            style={{ flex: 1 }}
          />
        </View>

        <TouchableOpacity
          style={styles.restoreLink}
          onPress={handleRestorePurchase}
          disabled={isRestoring}
        >
          {isRestoring ? (
            <ActivityIndicator color={colors.amberPrimary} />
          ) : (
            <Text style={styles.restoreLinkText}>{t('access.restore')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 2. PREFERENCES (LANG & UNITS) */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Preferencje Masarni</Text>

        {/* Language */}
        <Text style={styles.fieldLabel}>{t('settings.language')}</Text>
        <View style={styles.choiceRow}>
          <TouchableOpacity
            style={[styles.choiceBtn, currentLang === 'pl' && styles.choiceBtnActive]}
            onPress={() => handleLangChange('pl')}
          >
            <Text style={[styles.choiceText, currentLang === 'pl' && styles.choiceTextActive]}>
              🇵🇱 Polski
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.choiceBtn, currentLang === 'en' && styles.choiceBtnActive]}
            onPress={() => handleLangChange('en')}
          >
            <Text style={[styles.choiceText, currentLang === 'en' && styles.choiceTextActive]}>
              🇬🇧 English
            </Text>
          </TouchableOpacity>
        </View>

        {/* Units */}
        <Text style={styles.fieldLabel}>{t('settings.units')}</Text>
        <View style={styles.choiceRow}>
          <TouchableOpacity
            style={[styles.choiceBtn, unitSystem === 'metric' && styles.choiceBtnActive]}
            onPress={() => handleUnitChange('metric')}
          >
            <Text style={[styles.choiceText, unitSystem === 'metric' && styles.choiceTextActive]}>
              Metryczny (g, kg, °C)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.choiceBtn, unitSystem === 'imperial' && styles.choiceBtnActive]}
            onPress={() => handleUnitChange('imperial')}
          >
            <Text style={[styles.choiceText, unitSystem === 'imperial' && styles.choiceTextActive]}>
              Imperialny (oz, lbs, °F)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. 10 ROLLING SQLITE BACKUPS */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>{t('settings.backupsTitle')}</Text>
        <Text style={styles.cardSubtitle}>
          Automatyczny silnik 10 rotacyjnych migawek relacyjnej bazy SQLite. Wykonywany po każdej mutacji wyrobu.
        </Text>

        <TouchButton
          title={t('settings.createBackup')}
          onPress={handleCreateBackupNow}
          variant="secondary"
          style={{ marginBottom: 14 }}
        />

        {loadingBackups ? (
          <ActivityIndicator color={colors.amberPrimary} />
        ) : backups.length === 0 ? (
          <Text style={styles.emptyNote}>Brak utworzonych kopii zapasowych.</Text>
        ) : (
          <View style={styles.backupList}>
            {backups.slice(0, 10).map((b) => (
              <View key={b.filename} style={styles.backupItem}>
                <View style={styles.backupInfo}>
                  <Text style={styles.backupFilename} numberOfLines={1}>
                    {b.filename}
                  </Text>
                  <Text style={styles.backupSize}>{(b.size / 1024).toFixed(1)} KB</Text>
                </View>
                <TouchableOpacity
                  style={styles.restoreSmallBtn}
                  onPress={() => handleRestoreFromBackup(b.path)}
                >
                  <Text style={styles.restoreSmallBtnText}>Przywróć</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 4. FREE DATA EXPORTS (ZERO-TOLERANCE READ-ONLY FREEDOM) */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Eksport Danych (100% Darmowy)</Text>
        <Text style={styles.cardSubtitle}>
          Zgodnie ze standardem Apps4Brew: Twoje dane nigdy nie są więzione. Pełny eksport CSV i JSON jest bezpłatny na zawsze.
        </Text>

        <View style={styles.exportBtnCol}>
          <TouchButton
            title={`📄 ${t('settings.exportCsv')}`}
            onPress={handleExportCsv}
            variant="outline"
            style={{ marginBottom: 10 }}
          />
          <TouchButton
            title={`💾 ${t('settings.exportJson')}`}
            onPress={handleExportJson}
            variant="outline"
          />
        </View>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginBottom: 16,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.amberPrimary,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  statusBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.amberPrimary,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statusVal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  licenseBtnRow: {
    flexDirection: 'row',
  },
  restoreLink: {
    paddingTop: 12,
    alignItems: 'center',
  },
  restoreLinkText: {
    fontSize: 13,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  choiceBtn: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceBtnActive: {
    backgroundColor: colors.amberPrimary,
    borderColor: colors.amberPrimary,
  },
  choiceText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  choiceTextActive: {
    color: colors.textInverse,
    fontWeight: '800',
  },
  emptyNote: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  backupList: {
    gap: 8,
  },
  backupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  backupInfo: {
    flex: 1,
    marginRight: 10,
  },
  backupFilename: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  backupSize: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  restoreSmallBtn: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  restoreSmallBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.amberPrimary,
  },
  exportBtnCol: {
    marginTop: 4,
  },
});
