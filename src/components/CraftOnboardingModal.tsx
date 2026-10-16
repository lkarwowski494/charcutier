/**
 * CHARCUTIER — Craft Onboarding & Ritual Personalization Modal
 * Apps4Craft Studio Standard
 *
 * 1-Screen Welcome & Ritual Calibration:
 * - Persisted in SQLite app_settings
 * - Selects craftsman persona (Traditional vs Dry-Curing Artisan vs All Craft)
 * - Safe Area compliant (iOS Dynamic Island & Home indicator)
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { t } from '../i18n';
import { CraftProfile } from '../types';
import { TouchButton } from './TouchButton';

interface CraftOnboardingModalProps {
  visible: boolean;
  onSelectProfile: (profile: CraftProfile) => void;
}

export function CraftOnboardingModal({
  visible,
  onSelectProfile,
}: CraftOnboardingModalProps) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<CraftProfile>('all_craft');

  const profiles: Array<{
    id: CraftProfile;
    title: string;
    badge: string;
    desc: string;
  }> = [
    {
      id: 'traditional',
      title: t('onboarding.profileTraditionalTitle'),
      badge: t('onboarding.profileTraditionalBadge'),
      desc: t('onboarding.profileTraditionalDesc'),
    },
    {
      id: 'artisan',
      title: t('onboarding.profileArtisanTitle'),
      badge: t('onboarding.profileArtisanBadge'),
      desc: t('onboarding.profileArtisanDesc'),
    },
    {
      id: 'all_craft',
      title: t('onboarding.profileAllTitle'),
      badge: t('onboarding.profileAllBadge'),
      desc: t('onboarding.profileAllDesc'),
    },
  ];

  const handleConfirm = () => {
    onSelectProfile(selected);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Studio Brand Header */}
          <View style={styles.header}>
            <Text style={styles.studioPretitle}>APPS4CRAFT STUDIO</Text>
            <Text style={styles.brandTitle}>CHARCUTIER</Text>
            <Text style={styles.subtitle}>{t('onboarding.welcomeSubtitle')}</Text>
          </View>

          {/* Persona Selection Cards */}
          <Text style={styles.selectionPrompt}>{t('onboarding.selectRitual')}</Text>

          <View style={styles.cardsContainer}>
            {profiles.map((p) => {
              const isSelected = selected === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.profileCard,
                    isSelected && styles.profileCardSelected,
                  ]}
                  onPress={() => setSelected(p.id)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{p.title}</Text>
                    <View
                      style={[
                        styles.badge,
                        isSelected && styles.badgeSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          isSelected && styles.badgeTextSelected,
                        ]}
                      >
                        {p.badge}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardDesc}>{p.desc}</Text>

                  <View style={styles.radioRow}>
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.radioLabel,
                        isSelected && styles.radioLabelSelected,
                      ]}
                    >
                      {isSelected
                        ? t('onboarding.selectedLabel')
                        : t('onboarding.selectLabel')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Privacy & Offline Guarantee */}
          <View style={styles.guaranteeBox}>
            <Text style={styles.guaranteeTitle}>
              100% OFFLINE · ZERO TRACKERÓW
            </Text>
            <Text style={styles.guaranteeText}>
              {t('onboarding.offlineGuarantee')}
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Confirmation Action */}
        <View style={styles.footer}>
          <TouchButton
            title={t('onboarding.startCraftBtn')}
            onPress={handleConfirm}
            variant="primary"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginVertical: 16,
  },
  studioPretitle: {
    fontSize: 11,
    letterSpacing: 3,
    color: colors.amberPrimary,
    fontWeight: '800',
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 320,
  },
  selectionPrompt: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 12,
  },
  cardsContainer: {
    gap: 12,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    minHeight: 110,
  },
  profileCardSelected: {
    borderColor: colors.amberPrimary,
    backgroundColor: '#1E1B18',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeSelected: {
    backgroundColor: colors.amberPrimary,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  badgeTextSelected: {
    color: colors.textInverse,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.amberPrimary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.amberPrimary,
  },
  radioLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  radioLabelSelected: {
    color: colors.amberPrimary,
    fontWeight: '700',
  },
  guaranteeBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  guaranteeTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.amberPrimary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  guaranteeText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  footer: {
    paddingTop: 12,
  },
});
