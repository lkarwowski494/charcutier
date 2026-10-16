/**
 * CHARCUTIER — Curing Calculator & 1-Tap Start Screen
 * Apps4Brew Studio
 *
 * Implements:
 * - 1-Tap instant recipe generation for beginners
 * - Progressive Disclosure: Collapsible Pro butchery balance accordion
 * - P0 PPM Guard readout
 * - P0 Nitrosamine & Trichinella biological invariant checks
 * - Apps4Brew Pass gating for batch creation
 */

import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { t } from '../../src/i18n';
import { StepperInput } from '../../src/components/StepperInput';
import { PpmBadge } from '../../src/components/PpmBadge';
import { TouchButton } from '../../src/components/TouchButton';
import { Apps4BrewPassModal } from '../../src/components/Apps4BrewPassModal';
import { CraftOnboardingModal } from '../../src/components/CraftOnboardingModal';
import { useAppAccess } from '../../src/hooks/useAppAccess';
import { useUnitSystem } from '../../src/hooks/useUnitSystem';
import { useCraftProfile } from '../../src/hooks/useCraftProfile';
import {
  calculateCuringRecipe,
  calculateHamMakerRecipe,
  CURE_SALT_SPECS,
} from '../../src/core/curing-engine';
import { calculateCustomVesselRecipe } from '../../src/core/custom-equipment';
import { MASTERCLASS_PRESETS, MasterPreset } from '../../src/core/presets-data';
import { validateGameSafety } from '../../src/core/pantry-engine';
import { createBatch, createCuringLog } from '../../src/db/database';
import { createBackup } from '../../src/services/backup';
import { MeatType, CureType, CureSaltType } from '../../src/types';

export default function CalculatorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { guardAction, isPassModalVisible, setIsPassModalVisible, isExpired } = useAppAccess();
  const { formatWeight, formatVolume, unitSystem } = useUnitSystem();
  const { profile, selectProfile, isOnboardingCompleted } = useCraftProfile();

  // Craft profile preset filter: 'all' | 'traditional' | 'artisan'
  const [activeProfileFilter, setActiveProfileFilter] = useState<'all' | 'traditional' | 'artisan'>('all');

  // Primary parameters
  const [meatWeightG, setMeatWeightG] = useState<number>(1500);
  const [meatType, setMeatType] = useState<MeatType>('pork');
  const [cureType, setCureType] = useState<CureType>('eq_dry');
  const [cureSaltType, setCureSaltType] = useState<CureSaltType>('peklosol_pl');
  const [cureSaltRatio, setCureSaltRatio] = useState<number>(1.0); // 1.0 = 100% peklosol, 0.5 = 50/50 mix

  // Szynkowar (Ham Maker) Modal State (BR-PEKL-012)
  const [isSzynkowarModalVisible, setIsSzynkowarModalVisible] = useState(false);
  const [szynkowarCapacity, setSzynkowarCapacity] = useState<0.8 | 1.5 | 3.0>(1.5);
  const [isCustomCapacity, setIsCustomCapacity] = useState(false);
  const [customCapacityInput, setCustomCapacityInput] = useState('1.2');
  const [szynkowarMeatType, setSzynkowarMeatType] = useState<'pork' | 'poultry' | 'beef'>('poultry');

  // Advanced / Pro parameters (collapsible)
  const [isProExpanded, setIsProExpanded] = useState<boolean>(false);
  const [targetSalinityPct, setTargetSalinityPct] = useState<number>(2.2);
  const [sugarRatioPct, setSugarRatioPct] = useState<number>(0.4);
  const [isTrichinellaConfirmed, setIsTrichinellaConfirmed] = useState<boolean>(false);

  // New batch modal
  const [isNewBatchModalVisible, setIsNewBatchModalVisible] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [cutType, setCutType] = useState('Schab / Lonza');
  const [targetLossPct, setTargetLossPct] = useState(35.0);

  // Calculate live recipe
  const recipe = useMemo(() => {
    return calculateCuringRecipe({
      meatWeightG,
      cureType,
      cureSaltType,
      targetSalinityPct,
      cureSaltRatio,
      sugarRatioPct,
      plannedMaxTempC: cureType === 'eq_dry' ? 20 : 80,
    });
  }, [meatWeightG, cureType, cureSaltType, targetSalinityPct, cureSaltRatio, sugarRatioPct]);

  // Custom / Standard Szynkowar live formula calculation
  const effectiveCapacity = isCustomCapacity
    ? Math.max(0.2, parseFloat(customCapacityInput) || 1.2)
    : szynkowarCapacity;

  const szynkowarRecipe = useMemo(() => {
    if (isCustomCapacity) {
      const customRes = calculateCustomVesselRecipe(
        { id: 'custom_vessel', name: 'Naczynie rzemieślnicze', capacityKg: effectiveCapacity },
        szynkowarMeatType,
        0.8
      );
      return {
        meatWeightG: customRes.meatWeightG,
        recommendedWaterMl: customRes.recommendedWaterMl,
        cureSaltG: customRes.cureSaltG,
        pureSaltG: customRes.pureSaltG,
        gelatinGrams: Math.round(effectiveCapacity * 10),
        springTension: szynkowarMeatType === 'poultry' ? ('light' as const) : ('medium' as const),
        targetCoreTempC: szynkowarMeatType === 'poultry' ? 74 : 68,
      };
    }
    return calculateHamMakerRecipe({
      capacityKg: szynkowarCapacity,
      meatType: szynkowarMeatType,
      cureSaltRatio: 0.8,
    });
  }, [isCustomCapacity, effectiveCapacity, szynkowarCapacity, szynkowarMeatType]);

  // Craft profile preset filtering
  const effectiveFilter =
    activeProfileFilter !== 'all'
      ? activeProfileFilter
      : profile === 'all_craft'
      ? 'all'
      : profile;

  const filteredPresets = useMemo(() => {
    if (effectiveFilter === 'traditional') {
      return MASTERCLASS_PRESETS.filter(
        (p) =>
          p.category === 'cured_smoked' ||
          p.category === 'smoked' ||
          p.category === 'steamed'
      );
    }
    if (effectiveFilter === 'artisan') {
      return MASTERCLASS_PRESETS.filter(
        (p) =>
          p.category === 'dry_cured' ||
          p.category === 'sausage' ||
          p.category === 'specialty'
      );
    }
    return MASTERCLASS_PRESETS;
  }, [effectiveFilter]);

  const applySzynkowarToCalculator = () => {
    setMeatWeightG(szynkowarRecipe.meatWeightG);
    setMeatType(szynkowarMeatType === 'poultry' ? 'poultry' : 'pork');
    setCureType('traditional_dry');
    setCureSaltType('peklosol_pl');
    setCureSaltRatio(0.8);
    setTargetSalinityPct(szynkowarMeatType === 'poultry' ? 1.8 : 2.0);
    setCutType(
      szynkowarMeatType === 'poultry'
        ? 'Filet z indyka / kurczaka'
        : 'Szynka wieprzowa / łopatka'
    );
    setTargetLossPct(8.0);
    setIsSzynkowarModalVisible(false);
    Alert.alert(t('common.success'), t('calculator.szynkowarApplied'));
  };

  // Handle 1-Tap Masterclass preset selection
  const handleLoadPreset = (preset: MasterPreset) => {
    setMeatType(preset.meatType);
    setCureType(preset.cureType);
    setCureSaltType(preset.cureSaltType);
    setTargetSalinityPct(preset.saltRatioPct);
    setCureSaltRatio(preset.peklosolRatio);
    setSugarRatioPct(preset.sugarRatioPct);
    setTargetLossPct(preset.targetLossPct);
    setCutType(preset.cutType);
    Alert.alert(t('common.success'), t('presets.loaded', { name: preset.titlePl }));
  };

  // Handle batch creation with Apps4Brew Pass gating
  const handleCreateBatch = () => {
    // 1. P0 Trichinella check for wild boar
    const gameCheck = validateGameSafety(meatType, isTrichinellaConfirmed);
    if (!gameCheck.allowed) {
      Alert.alert(t('common.warning'), t(gameCheck.errorKey || 'calculator.trichinellaWarning'));
      return;
    }

    // 2. Apps4Brew Pass guard check
    guardAction(() => {
      setBatchName(`${t(`calculator.types.${meatType}`)} — ${new Date().toLocaleDateString()}`);
      setIsNewBatchModalVisible(true);
    });
  };

  const confirmSaveBatch = async () => {
    if (!batchName.trim()) {
      Alert.alert(t('common.warning'), t('calculator.batchNamePrompt'));
      return;
    }

    const batchId = `batch_${Date.now()}`;
    const now = Date.now();

    try {
      await createBatch({
        id: batchId,
        name: batchName.trim(),
        meat_type: meatType,
        cut_type: cutType,
        initial_weight_g: meatWeightG,
        target_loss_pct: targetLossPct,
        cure_type: cureType,
        status: 'curing',
        created_at: now,
        updated_at: now,
        notes: null,
      });

      await createCuringLog({
        id: `cure_${Date.now()}`,
        batch_id: batchId,
        salt_g: recipe.pureSaltG,
        cure_salt_g: recipe.cureSaltG,
        cure_salt_type: cureSaltType,
        calculated_ppm: recipe.calculatedPpm,
        water_ml: recipe.waterMl,
        spices_json: JSON.stringify([]),
        target_days: recipe.estimatedDays,
        started_at: now,
        completed_at: null,
      });

      // Automatic rolling backup on mutation
      await createBackup();

      setIsNewBatchModalVisible(false);
      Alert.alert(t('common.success'), t('calculator.batchCreatedSuccess'), [
        { text: t('common.done'), onPress: () => router.push('/batches') },
      ]);
    } catch (err) {
      console.error('Failed to create batch:', err);
      Alert.alert(t('common.error'), t('calculator.batchSaveError'));
    }
  };

  const meatTypes: MeatType[] = ['pork', 'beef', 'wild_boar', 'poultry', 'venison', 'lamb'];
  const cureMethods: CureType[] = ['eq_dry', 'wet_brine', 'wet_injection', 'traditional_dry'];
  const saltTypes: CureSaltType[] = ['peklosol_pl', 'cure_1', 'cure_2', 'saltpeter'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isExpired && (
        <TouchableOpacity
          style={styles.readOnlyBanner}
          onPress={() => setIsPassModalVisible(true)}
        >
          <Text style={styles.readOnlyText}>
            🔒 {t('access.readOnlyBanner')}
          </Text>
        </TouchableOpacity>
      )}

      {/* Szynkowar Mode Trigger Button (BR-PEKL-012) */}
      <TouchableOpacity
        style={styles.szynkowarBannerBtn}
        onPress={() => setIsSzynkowarModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.szynkowarBannerIcon}>🍖</Text>
        <View style={styles.szynkowarBannerTexts}>
          <Text style={styles.szynkowarBannerTitle}>{t('calculator.szynkowarModeBtn')}</Text>
          <Text style={styles.szynkowarBannerSub}>{t('calculator.szynkowarTitle')}</Text>
        </View>
        <Text style={styles.szynkowarBannerArrow}>➔</Text>
      </TouchableOpacity>

      {/* 0. Curated Masterclass Presets (1-Tap Fast Start) */}
      <View style={styles.presetsContainer}>
        <View style={styles.presetsHeaderRow}>
          <Text style={styles.presetsHeader}>🏆 {t('presets.title')}</Text>
          {/* Craft Profile Filter Pills */}
          <View style={styles.profileFilterRow}>
            {(
              [
                { id: 'all', label: 'Wszystkie' },
                { id: 'traditional', label: 'Tradycja' },
                { id: 'artisan', label: 'Artisan' },
              ] as const
            ).map((flt) => (
              <TouchableOpacity
                key={flt.id}
                style={[
                  styles.profileFilterPill,
                  effectiveFilter === flt.id && styles.profileFilterPillActive,
                ]}
                onPress={() => setActiveProfileFilter(flt.id)}
              >
                <Text
                  style={[
                    styles.profileFilterPillText,
                    effectiveFilter === flt.id && styles.profileFilterPillTextActive,
                  ]}
                >
                  {flt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScroll}>
          {filteredPresets.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={styles.presetCard}
              onPress={() => handleLoadPreset(preset)}
              activeOpacity={0.7}
            >
              <Text style={styles.presetTitle}>{preset.titlePl}</Text>
              <Text style={styles.presetMeta} numberOfLines={2}>{preset.summary}</Text>
              <View style={styles.presetBadge}>
                <Text style={styles.presetBadgeText}>1-TAP WCZYTAJ</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 1. Meat Weight Stepper */}
      <StepperInput
        label={t('calculator.meatWeight')}
        value={meatWeightG}
        onChange={setMeatWeightG}
        unit="g"
        stepSmall={50}
        stepLarge={250}
        min={100}
        max={50000}
      />

      {/* 2. SACRED NUMBERS READOUT (Above the fold for butcher counter ergonomics) */}
      <View style={styles.resultCard}>
        <View style={styles.resultHeaderRow}>
          <Text style={styles.resultHeader}>{t('calculator.resultTitle')}</Text>
          <View style={styles.sacredBadge}>
            <Text style={styles.sacredBadgeText}>SACRED NUMBERS</Text>
          </View>
        </View>

        {recipe.cureSaltG > 0 && (
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>
              {cureSaltType === 'peklosol_pl'
                ? t('calculator.cureSaltDose')
                : `${t('calculator.cureSaltDose')} (${CURE_SALT_SPECS[cureSaltType].name})`}:
            </Text>
            <Text style={[styles.resultValue, { color: colors.amberPrimary }]}>
              {unitSystem === 'metric'
                ? `${recipe.cureSaltG} g`
                : formatWeight(recipe.cureSaltG, { precision: 2 })}
            </Text>
          </View>
        )}

        {recipe.pureSaltG > 0 && (
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t('calculator.pureSaltDose')}:</Text>
            <Text style={styles.resultValue}>
              {unitSystem === 'metric'
                ? `${recipe.pureSaltG} g`
                : formatWeight(recipe.pureSaltG, { precision: 2 })}
            </Text>
          </View>
        )}

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>{t('calculator.sugarDose')}:</Text>
          <Text style={styles.resultValue}>
            {unitSystem === 'metric'
              ? `${recipe.sugarG} g`
              : formatWeight(recipe.sugarG, { precision: 2 })}
          </Text>
        </View>

        {recipe.waterMl > 0 && (
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t('calculator.waterVolume')}:</Text>
            <Text style={styles.resultValue}>
              {unitSystem === 'metric'
                ? `${recipe.waterMl} ml`
                : formatVolume(recipe.waterMl)}
            </Text>
          </View>
        )}

        {recipe.injectionMl > 0 && (
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t('calculator.injectionVolume')}:</Text>
            <Text style={styles.resultValue}>
              {unitSystem === 'metric'
                ? `${recipe.injectionMl} ml`
                : formatVolume(recipe.injectionMl)}
            </Text>
          </View>
        )}

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>{t('calculator.diffusionDays')}:</Text>
          <Text style={styles.resultValue}>
            ~{recipe.estimatedDays} {t('common.days')}
          </Text>
        </View>

        {/* PPM Guard Badge */}
        <PpmBadge ppm={recipe.calculatedPpm} status={recipe.ppmStatus} />
        <Text style={styles.ppmNote}>{t('calculator.ppmSafetyNote')}</Text>
      </View>

      {/* 2. Meat Type Selector */}
      <Text style={styles.sectionLabel}>{t('calculator.meatType')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {meatTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.chip, meatType === type && styles.chipActive]}
            onPress={() => setMeatType(type)}
          >
            <Text style={[styles.chipText, meatType === type && styles.chipTextActive]}>
              {t(`calculator.types.${type}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* P0 Wild Game Trichinella Checkbox */}
      {meatType === 'wild_boar' && (
        <TouchableOpacity
          style={[styles.warningBox, isTrichinellaConfirmed && styles.warningBoxConfirmed]}
          onPress={() => setIsTrichinellaConfirmed(!isTrichinellaConfirmed)}
          activeOpacity={0.8}
        >
          <Text style={styles.warningTitle}>⚠️ {t('calculator.trichinellaWarning')}</Text>
          <View style={styles.checkboxRow}>
            <View style={[styles.checkbox, isTrichinellaConfirmed && styles.checkboxActive]}>
              {isTrichinellaConfirmed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{t('calculator.trichinellaConfirm')}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* 3. Cure Method Selector */}
      <Text style={styles.sectionLabel}>{t('calculator.cureMethod')}</Text>
      <View style={styles.grid2}>
        {cureMethods.map((method) => (
          <TouchableOpacity
            key={method}
            style={[styles.methodCard, cureType === method && styles.methodCardActive]}
            onPress={() => setCureType(method)}
          >
            <Text style={[styles.methodCardText, cureType === method && styles.methodCardTextActive]}>
              {t(`calculator.methods.${method}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 4. Cure Salt Type Selector */}
      <Text style={styles.sectionLabel}>{t('calculator.cureSaltType')}</Text>
      <View style={styles.saltList}>
        {saltTypes.map((st) => (
          <TouchableOpacity
            key={st}
            style={[styles.saltRow, cureSaltType === st && styles.saltRowActive]}
            onPress={() => setCureSaltType(st)}
          >
            <View style={styles.saltRadio}>
              {cureSaltType === st && <View style={styles.saltRadioInner} />}
            </View>
            <View style={styles.saltDetails}>
              <Text style={[styles.saltName, cureSaltType === st && styles.saltNameActive]}>
                {CURE_SALT_SPECS[st].name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 4b. Mix Ratio Selector (BR-PEKL-007) when using Polish Peklosol */}
      {cureSaltType === 'peklosol_pl' && (
        <View style={styles.mixRatioContainer}>
          <Text style={styles.mixRatioLabel}>{t('calculator.cureSaltRatio')}:</Text>
          <View style={styles.mixRatioButtonGroup}>
            {[
              { label: '100%', ratio: 1.0 },
              { label: '80/20', ratio: 0.8 },
              { label: '60/40', ratio: 0.6 },
              { label: '50/50', ratio: 0.5 },
              { label: '0%', ratio: 0.0 },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={[styles.mixRatioBtn, cureSaltRatio === opt.ratio && styles.mixRatioBtnActive]}
                onPress={() => setCureSaltRatio(opt.ratio)}
              >
                <Text style={[styles.mixRatioBtnText, cureSaltRatio === opt.ratio && styles.mixRatioBtnTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* P0 Nitrosamine Warning Banner if Saltpeter / Cure #2 */}
      {recipe.nitrosamineRisk && (
        <View style={styles.dangerBox}>
          <Text style={styles.dangerTitle}>⛔ OSTRZEŻENIE: SALETRA W WYSOKIEJ TEMPERATURZE</Text>
          <Text style={styles.dangerDesc}>{t('calculator.saltpeterWarmWarning')}</Text>
        </View>
      )}

      {/* 6. Progressive Disclosure: Pro Butchery Balance Accordion */}
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsProExpanded(!isProExpanded)}
        activeOpacity={0.8}
      >
        <Text style={styles.accordionTitle}>{t('calculator.advancedAccordion')}</Text>
        <Text style={styles.accordionArrow}>{isProExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isProExpanded && (
        <View style={styles.accordionBody}>
          <Text style={styles.proDesc}>
            Zaawansowane parametry fizykochemiczne solanki i dyfuzji azotynów:
          </Text>

          <View style={styles.proRow}>
            <Text style={styles.proLabel}>{t('calculator.saltRatio')}:</Text>
            <View style={styles.proButtonGroup}>
              {[1.8, 2.0, 2.2, 2.5].map((pct) => (
                <TouchableOpacity
                  key={pct}
                  style={[styles.proBtn, targetSalinityPct === pct && styles.proBtnActive]}
                  onPress={() => setTargetSalinityPct(pct)}
                >
                  <Text style={[styles.proBtnText, targetSalinityPct === pct && styles.proBtnTextActive]}>
                    {pct}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.proRow}>
            <Text style={styles.proLabel}>{t('calculator.sugarRatio')}:</Text>
            <View style={styles.proButtonGroup}>
              {[0.2, 0.4, 0.6, 1.0].map((pct) => (
                <TouchableOpacity
                  key={pct}
                  style={[styles.proBtn, sugarRatioPct === pct && styles.proBtnActive]}
                  onPress={() => setSugarRatioPct(pct)}
                >
                  <Text style={[styles.proBtnText, sugarRatioPct === pct && styles.proBtnTextActive]}>
                    {pct}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {recipe.waterMl > 0 && (
            <>
              <View style={styles.proMetricRow}>
                <Text style={styles.proLabel}>{t('calculator.baumeDensity')}:</Text>
                <Text style={styles.proValue}>{recipe.brineBaume}° Bé</Text>
              </View>
              <View style={styles.proMetricRow}>
                <Text style={styles.proLabel}>Salometr (nasycenie):</Text>
                <Text style={styles.proValue}>{recipe.brineSalometer}° Sal</Text>
              </View>
            </>
          )}
        </View>
      )}

      {/* 7. Action Button: Create Batch */}
      <TouchButton
        title={t('calculator.createBatchBtn')}
        onPress={handleCreateBatch}
        variant="primary"
        style={styles.createBtn}
      />

      {/* New Batch Modal Dialog */}
      <Modal
        visible={isNewBatchModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsNewBatchModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nowa Partia w Spiżarni</Text>

            <Text style={styles.inputLabel}>{t('batches.batchName')}</Text>
            <TextInput
              style={styles.modalInput}
              value={batchName}
              onChangeText={setBatchName}
              placeholder="np. Schab dojrzewający z jałowcem"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.inputLabel}>{t('batches.cutType')}</Text>
            <TextInput
              style={styles.modalInput}
              value={cutType}
              onChangeText={setCutType}
              placeholder="np. Schab / Karkówka / Szynka"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.inputLabel}>{t('batches.targetLoss')} (%)</Text>
            <TextInput
              style={styles.modalInput}
              value={targetLossPct.toString()}
              onChangeText={(txt) => setTargetLossPct(parseFloat(txt) || 35)}
              keyboardType="numeric"
            />

            <View style={styles.modalActions}>
              <TouchButton
                title={t('common.cancel')}
                onPress={() => setIsNewBatchModalVisible(false)}
                variant="secondary"
                style={styles.modalBtn}
              />
              <TouchButton
                title={t('common.save')}
                onPress={confirmSaveBatch}
                variant="primary"
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Szynkowar (Ham Maker) Modal Dialog (BR-PEKL-012) */}
      <Modal
        visible={isSzynkowarModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSzynkowarModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>🍖 {t('calculator.szynkowarTitle')}</Text>

            <Text style={styles.inputLabel}>{t('calculator.szynkowarCapacity')}:</Text>
            <View style={styles.szynkowarCapRow}>
              {[0.8, 1.5, 3.0].map((cap) => (
                <TouchableOpacity
                  key={cap}
                  style={[
                    styles.szynkowarCapBtn,
                    !isCustomCapacity && szynkowarCapacity === cap && styles.szynkowarCapBtnActive,
                  ]}
                  onPress={() => {
                    setIsCustomCapacity(false);
                    setSzynkowarCapacity(cap as 0.8 | 1.5 | 3.0);
                  }}
                >
                  <Text
                    style={[
                      styles.szynkowarCapText,
                      !isCustomCapacity && szynkowarCapacity === cap && styles.szynkowarCapTextActive,
                    ]}
                  >
                    {cap.toFixed(1)} kg
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.szynkowarCapBtn,
                  isCustomCapacity && styles.szynkowarCapBtnActive,
                ]}
                onPress={() => setIsCustomCapacity(true)}
              >
                <Text
                  style={[
                    styles.szynkowarCapText,
                    isCustomCapacity && styles.szynkowarCapTextActive,
                  ]}
                >
                  Własne
                </Text>
              </TouchableOpacity>
            </View>

            {isCustomCapacity && (
              <View style={{ marginVertical: 8 }}>
                <Text style={styles.inputLabel}>Pojemność własnego naczynia (kg):</Text>
                <TextInput
                  style={styles.modalInput}
                  value={customCapacityInput}
                  onChangeText={setCustomCapacityInput}
                  keyboardType="numeric"
                  placeholder="np. 1.2 lub 2.5"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            )}

            <Text style={styles.inputLabel}>{t('calculator.meatType')}:</Text>
            <View style={styles.szynkowarCapRow}>
              {[
                { type: 'poultry', label: 'Drób (Indyk/Kurczak)' },
                { type: 'pork', label: 'Wieprzowina (Szynka)' },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.type}
                  style={[styles.szynkowarCapBtn, szynkowarMeatType === opt.type && styles.szynkowarCapBtnActive]}
                  onPress={() => setSzynkowarMeatType(opt.type as any)}
                >
                  <Text style={[styles.szynkowarCapText, szynkowarMeatType === opt.type && styles.szynkowarCapTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.szynkowarMetricsCard}>
              <View style={styles.szynkowarMetricRow}>
                <Text style={styles.szynkowarMetricLabel}>Wsad mięsa:</Text>
                <Text style={styles.szynkowarMetricVal}>{szynkowarRecipe.meatWeightG} g</Text>
              </View>
              <View style={styles.szynkowarMetricRow}>
                <Text style={styles.szynkowarMetricLabel}>{t('calculator.szynkowarWaterGelatin')}:</Text>
                <Text style={styles.szynkowarMetricVal}>{szynkowarRecipe.recommendedWaterMl} ml ({szynkowarRecipe.gelatinGrams}g żelatyny)</Text>
              </View>
              <View style={styles.szynkowarMetricRow}>
                <Text style={styles.szynkowarMetricLabel}>{t('calculator.szynkowarSpringTension')}:</Text>
                <Text style={[styles.szynkowarMetricVal, { color: colors.amberPrimary }]}>
                  {szynkowarRecipe.springTension === 'light' ? t('calculator.szynkowarSpringLight') : t('calculator.szynkowarSpringMedium')}
                </Text>
              </View>
              <View style={styles.szynkowarMetricRow}>
                <Text style={styles.szynkowarMetricLabel}>Docelowa temp. rdzenia:</Text>
                <Text style={[styles.szynkowarMetricVal, { color: colors.safe }]}>{szynkowarRecipe.targetCoreTempC}°C</Text>
              </View>
            </View>

            <Text style={styles.szynkowarGuideText}>
              💡 {t('calculator.szynkowarThermalGuide')}
            </Text>

            <View style={styles.modalActions}>
              <TouchButton
                title={t('common.cancel')}
                onPress={() => setIsSzynkowarModalVisible(false)}
                variant="secondary"
                style={styles.modalBtn}
              />
              <TouchButton
                title={t('calculator.szynkowarApply')}
                onPress={applySzynkowarToCalculator}
                variant="primary"
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Apps4Brew Pass Modal for Subscription Access */}
      <Apps4BrewPassModal
        visible={isPassModalVisible}
        onClose={() => setIsPassModalVisible(false)}
      />

      {/* 1-Screen Offline Craft Ritual Calibration Onboarding */}
      <CraftOnboardingModal
        visible={!isOnboardingCompleted}
        onSelectProfile={selectProfile}
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
  readOnlyBanner: {
    backgroundColor: '#78350F',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.amberPrimary,
  },
  readOnlyText: {
    color: '#FEF3C7',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginRight: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.amberPrimary,
    borderColor: colors.amberPrimary,
  },
  chipText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: colors.textInverse,
    fontWeight: '800',
  },
  warningBox: {
    backgroundColor: '#451A03',
    borderColor: colors.amberPrimary,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  warningBoxConfirmed: {
    borderColor: colors.safe,
    backgroundColor: '#064E3B',
  },
  warningTitle: {
    color: colors.amberLight,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.amberPrimary,
    marginRight: 10,
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
    fontSize: 14,
  },
  checkboxLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  methodCard: {
    flex: 1,
    minWidth: '47%',
    minHeight: 52,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodCardActive: {
    borderColor: colors.amberPrimary,
    backgroundColor: '#27201C',
  },
  methodCardText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  methodCardTextActive: {
    color: colors.amberPrimary,
    fontWeight: '800',
  },
  saltList: {
    gap: 8,
    marginBottom: 16,
  },
  saltRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    paddingHorizontal: 14,
    minHeight: 56,
  },
  saltRowActive: {
    borderColor: colors.amberPrimary,
    backgroundColor: '#27201C',
  },
  saltRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.amberPrimary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saltRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.amberPrimary,
  },
  saltDetails: {
    flex: 1,
  },
  saltName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  saltNameActive: {
    color: colors.amberLight,
    fontWeight: '800',
  },
  dangerBox: {
    backgroundColor: '#450A0A',
    borderColor: colors.danger,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  dangerTitle: {
    color: '#FEE2E2',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  dangerDesc: {
    color: '#FECACA',
    fontSize: 12,
    lineHeight: 16,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.amberPrimary,
    padding: 18,
    marginBottom: 16,
  },
  resultHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.amberPrimary,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
    paddingBottom: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  resultLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  ppmNote: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 56,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.amberLight,
  },
  accordionArrow: {
    color: colors.amberPrimary,
    fontSize: 14,
  },
  accordionBody: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  proDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  proRow: {
    marginBottom: 12,
  },
  proLabel: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 6,
  },
  proButtonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  proBtn: {
    flex: 1,
    minHeight: 44,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proBtnActive: {
    backgroundColor: colors.amberPrimary,
  },
  proBtnText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  proBtnTextActive: {
    color: colors.textInverse,
    fontWeight: '800',
  },
  proMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
  },
  proValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.amberLight,
  },
  createBtn: {
    marginTop: 8,
  },
  presetsContainer: {
    marginBottom: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  presetsHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.amberLight,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsScroll: {
    flexDirection: 'row',
  },
  presetCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    width: 200,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    justifyContent: 'space-between',
  },
  presetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  presetMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginBottom: 10,
  },
  presetBadge: {
    backgroundColor: colors.amberPrimary,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  presetBadgeText: {
    color: colors.textInverse,
    fontSize: 10,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.amberPrimary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    paddingHorizontal: 14,
    minHeight: 48,
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
  },
  szynkowarBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B1F04',
    borderWidth: 1.5,
    borderColor: colors.amberPrimary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  szynkowarBannerIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  szynkowarBannerTexts: {
    flex: 1,
  },
  szynkowarBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.amberLight,
    marginBottom: 2,
  },
  szynkowarBannerSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  szynkowarBannerArrow: {
    fontSize: 18,
    color: colors.amberPrimary,
    fontWeight: '800',
  },
  mixRatioContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  mixRatioLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  mixRatioButtonGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  mixRatioBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mixRatioBtnActive: {
    backgroundColor: colors.amberPrimary,
    borderColor: colors.amberPrimary,
  },
  mixRatioBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  mixRatioBtnTextActive: {
    fontWeight: '800',
    color: colors.textInverse,
  },
  szynkowarCapRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  szynkowarCapBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    borderRadius: 10,
    alignItems: 'center',
  },
  szynkowarCapBtnActive: {
    backgroundColor: colors.amberPrimary,
    borderColor: colors.amberPrimary,
  },
  szynkowarCapText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  szynkowarCapTextActive: {
    fontWeight: '800',
    color: colors.textInverse,
  },
  szynkowarMetricsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  szynkowarMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  szynkowarMetricLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  szynkowarMetricVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  szynkowarGuideText: {
    fontSize: 12,
    color: colors.amberLight,
    lineHeight: 17,
    marginBottom: 16,
    backgroundColor: '#271B0A',
    padding: 10,
    borderRadius: 8,
  },
  presetsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileFilterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  profileFilterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  profileFilterPillActive: {
    backgroundColor: colors.amberPrimary,
    borderColor: colors.amberPrimary,
  },
  profileFilterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  profileFilterPillTextActive: {
    color: colors.textInverse,
    fontWeight: '800',
  },
  resultHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
    paddingBottom: 8,
  },
  sacredBadge: {
    backgroundColor: '#291809',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.amberPrimary,
  },
  sacredBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.amberPrimary,
    letterSpacing: 1,
  },
});
