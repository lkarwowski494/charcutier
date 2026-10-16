/**
 * CHARCUTIER — Apps4BrewPassModal
 * Studio: Apps4Brew
 * Workshop-Proof Subscription Gate modal
 *
 * Rules:
 * - Cancel button in top-left (min 56x56 pt)
 * - Strict offline verification of receipts via SQLite
 * - Clear pricing ($0.99/mo, $4.99/yr, $14.99 Lifetime)
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { t } from '../i18n';
import { useAppAccess } from '../hooks/useAppAccess';

interface Apps4BrewPassModalProps {
  visible: boolean;
  onClose: () => void;
}

export function Apps4BrewPassModal({ visible, onClose }: Apps4BrewPassModalProps) {
  const { restorePurchases, applyPurchase } = useAppAccess();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.success) {
        Alert.alert(t('common.success'), t(result.messageKey), [
          { text: t('common.done'), onPress: onClose },
        ]);
      } else {
        Alert.alert(t('common.warning'), t(result.messageKey));
      }
    } catch {
      Alert.alert(t('common.error'), t('access.restoreError'));
    } finally {
      setIsRestoring(false);
    }
  };

  const handleSelectTier = async (tier: 'monthly' | 'yearly' | 'lifetime') => {
    await applyPurchase(tier);
    Alert.alert(t('common.success'), t('access.restoreSuccess'), [
      { text: t('common.done'), onPress: onClose },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Top Bar with Cancel in Top-Left */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t('common.cancel')}
            >
              <Text style={styles.cancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <View style={styles.badgePlaceholder} />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.brandTitle}>CHARCUTIER</Text>
            <Text style={styles.passTitle}>{t('access.passTitle')}</Text>
            <Text style={styles.passSubtitle}>{t('access.passSubtitle')}</Text>

            <View style={styles.bannerBox}>
              <Text style={styles.bannerTitle}>{t('access.featureBlockedTitle')}</Text>
              <Text style={styles.bannerDesc}>{t('access.featureBlockedDesc')}</Text>
            </View>

            {/* Pricing Tiers */}
            <View style={styles.tiersContainer}>
              {/* Monthly */}
              <TouchableOpacity
                style={styles.tierCard}
                onPress={() => handleSelectTier('monthly')}
                activeOpacity={0.8}
              >
                <View style={styles.tierInfo}>
                  <Text style={styles.tierName}>Miesięczny / Monthly</Text>
                  <Text style={styles.tierPrice}>{t('access.monthlyPrice')}</Text>
                </View>
                <View style={styles.selectBtn}>
                  <Text style={styles.selectBtnText}>{t('access.subscribe')}</Text>
                </View>
              </TouchableOpacity>

              {/* Yearly - Best Value */}
              <TouchableOpacity
                style={[styles.tierCard, styles.tierCardFeatured]}
                onPress={() => handleSelectTier('yearly')}
                activeOpacity={0.8}
              >
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>BEST VALUE</Text>
                </View>
                <View style={styles.tierInfo}>
                  <Text style={styles.tierName}>Roczny / Annual</Text>
                  <Text style={styles.tierPrice}>{t('access.yearlyPrice')}</Text>
                </View>
                <View style={[styles.selectBtn, styles.selectBtnFeatured]}>
                  <Text style={styles.selectBtnTextFeatured}>{t('access.subscribe')}</Text>
                </View>
              </TouchableOpacity>

              {/* Lifetime */}
              <TouchableOpacity
                style={styles.tierCard}
                onPress={() => handleSelectTier('lifetime')}
                activeOpacity={0.8}
              >
                <View style={styles.tierInfo}>
                  <Text style={styles.tierName}>Dożywotni / Lifetime</Text>
                  <Text style={styles.tierPrice}>{t('access.lifetimePrice')}</Text>
                </View>
                <View style={styles.selectBtn}>
                  <Text style={styles.selectBtnText}>{t('access.subscribe')}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Restore Purchase */}
            <TouchableOpacity
              style={styles.restoreBtn}
              onPress={handleRestore}
              disabled={isRestoring}
              activeOpacity={0.7}
            >
              {isRestoring ? (
                <ActivityIndicator color={colors.amberPrimary} />
              ) : (
                <Text style={styles.restoreText}>{t('access.restore')}</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              Apps4Brew Studio · Zero trackerów · Dane pozostają w 100% na Twoim urządzeniu
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: colors.surfaceLight,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  cancelBtn: {
    minWidth: 56,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  cancelText: {
    color: colors.amberPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  badgePlaceholder: {
    width: 56,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 13,
    letterSpacing: 3,
    color: colors.amberPrimary,
    fontWeight: '800',
    marginBottom: 4,
  },
  passTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  passSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  bannerBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: colors.amberPrimary,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  bannerDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  tiersContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    minHeight: 68,
  },
  tierCardFeatured: {
    borderColor: colors.amberPrimary,
    backgroundColor: '#27201C',
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: colors.amberPrimary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textInverse,
    letterSpacing: 1,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  tierPrice: {
    fontSize: 13,
    color: colors.amberLight,
    fontWeight: '500',
  },
  selectBtn: {
    minHeight: 48,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
  },
  selectBtnFeatured: {
    backgroundColor: colors.amberPrimary,
  },
  selectBtnText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  selectBtnTextFeatured: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
  restoreBtn: {
    minHeight: 56,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  restoreText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footerNote: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
