/**
 * CHARCUTIER — Pantry & Casing Assistant Screen
 * Apps4Brew Studio
 *
 * Implements:
 * - Butcher inventory (Salts, Spices, Casings, Woods)
 * - Casing length calculator (caliber vs stuffing weight)
 * - PDF Batch Passport Sheet printing with QR codes
 */

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../src/theme/colors';
import { t } from '../../src/i18n';
import { TouchButton } from '../../src/components/TouchButton';
import { StepperInput } from '../../src/components/StepperInput';
import { Apps4BrewPassModal } from '../../src/components/Apps4BrewPassModal';
import { useAppAccess } from '../../src/hooks/useAppAccess';
import {
  calculateCasingLength,
  CASING_SPECS,
} from '../../src/core/pantry-engine';
import {
  getAllPantryItems,
  upsertPantryItem,
  getAllBatches,
} from '../../src/db/database';
import { printBatchLabels } from '../../src/services/label-generator';
import { PantryItem, Batch } from '../../src/types';

export default function PantryScreen() {
  const { guardAction, isPassModalVisible, setIsPassModalVisible } = useAppAccess();

  // Casing calculator state
  const [casingMeatKg, setCasingMeatKg] = useState<number>(5.0);
  const [selectedCaliberKey, setSelectedCaliberKey] = useState<string>('pork_28_30');

  // Pantry inventory state
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [batches, setBatches] = useState<Batch[]>([]);

  // Add item form state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('g');
  const [newItemCategory, setNewItemCategory] = useState<'cure' | 'spice' | 'casing' | 'wood'>('cure');

  const casingResult = calculateCasingLength(casingMeatKg, selectedCaliberKey);

  const loadPantry = async () => {
    try {
      const pItems = await getAllPantryItems();
      setItems(pItems);
      const bList = await getAllBatches();
      setBatches(bList);
    } catch (err) {
      console.warn('Failed to load pantry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPantry();
  }, []);

  const handleSaveItem = () => {
    guardAction(async () => {
      if (!newItemName.trim()) {
        Alert.alert(t('common.warning'), t('pantry.nameRequired'));
        return;
      }

      const qty = parseFloat(newItemQty) || 0;
      const item: PantryItem = {
        id: `pantry_${Date.now()}`,
        category: newItemCategory,
        name: newItemName.trim(),
        quantity: qty,
        unit: newItemUnit,
        min_threshold: 0,
        notes: null,
        updated_at: Date.now(),
      };

      try {
        await upsertPantryItem(item);
        setIsAddingItem(false);
        setNewItemName('');
        setNewItemQty('');
        loadPantry();
      } catch (err) {
        Alert.alert(t('common.error'), t('pantry.saveError'));
      }
    });
  };

  const handlePrintLabels = async () => {
    guardAction(async () => {
      if (batches.length === 0) {
        Alert.alert(
          t('pantry.noBatchesTitle'),
          t('pantry.noBatchesDesc')
        );
        return;
      }

      try {
        await printBatchLabels(batches);
      } catch (err: any) {
        Alert.alert(t('common.error'), err?.message || t('pantry.pdfError'));
      }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. CASING LENGTH CALCULATOR */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>{t('pantry.casingCalculator')}</Text>

        <StepperInput
          label={t('pantry.meatWeightForCasing')}
          value={casingMeatKg}
          onChange={setCasingMeatKg}
          unit="kg"
          stepSmall={0.5}
          stepLarge={2.0}
          min={0.5}
          max={100}
          precision={1}
        />

        <Text style={styles.fieldLabel}>{t('pantry.casingCaliber')}:</Text>
        <View style={styles.casingList}>
          {Object.entries(CASING_SPECS).map(([key, spec]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.casingOption,
                selectedCaliberKey === key && styles.casingOptionActive,
              ]}
              onPress={() => setSelectedCaliberKey(key)}
            >
              <View style={styles.casingRadio}>
                {selectedCaliberKey === key && <View style={styles.casingRadioInner} />}
              </View>
              <View style={styles.casingTextCol}>
                <Text
                  style={[
                    styles.casingName,
                    selectedCaliberKey === key && styles.casingNameActive,
                  ]}
                >
                  {t(`pantry.casingCalibers.${key}` as any) || spec.name}
                </Text>
                <Text style={styles.casingUsage}>{spec.bestFor}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Casing Calculation Results Box */}
        <View style={styles.casingResultBox}>
          <Text style={styles.casingResultExact}>
            {t('pantry.requiredLength')}: <Text style={styles.highlight}>{casingResult.exactMeters} m</Text>
          </Text>
          <Text style={styles.casingResultReserve}>
            {t('pantry.recommendedPurchase')}:{' '}
            <Text style={styles.highlightBold}>{casingResult.recommendedMeters} m</Text>
          </Text>
        </View>
      </View>

      {/* 2. PDF BATCH PASSPORTS (QR LABELS) */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>{t('pantry.generatePdfSheet')}</Text>
        <Text style={styles.cardSubtitle}>
          {t('pantry.pdfSubtitle')}
        </Text>

        <TouchButton
          title={`🖨️ ${t('pantry.generatePdfSheet')} (${batches.length} partii)`}
          onPress={handlePrintLabels}
          variant="primary"
          style={styles.printBtn}
        />
      </View>

      {/* 3. PANTRY INVENTORY */}
      <View style={styles.card}>
        <View style={styles.inventoryHeaderRow}>
          <Text style={styles.cardHeader}>{t('pantry.inventoryTitle')}</Text>
          <TouchableOpacity
            style={styles.addItemBtn}
            onPress={() => setIsAddingItem(!isAddingItem)}
          >
            <Text style={styles.addItemBtnText}>{isAddingItem ? t('common.cancel') : `+ ${t('pantry.addItem')}`}</Text>
          </TouchableOpacity>
        </View>

        {isAddingItem && (
          <View style={styles.addForm}>
            <TextInput
              style={styles.formInput}
              placeholder={t('pantry.namePlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={newItemName}
              onChangeText={setNewItemName}
            />
            <View style={styles.formRow}>
              <TextInput
                style={[styles.formInput, { flex: 1 }]}
                placeholder={t('pantry.qtyPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                value={newItemQty}
                onChangeText={setNewItemQty}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.formInput, { width: 70, textAlign: 'center' }]}
                placeholder={t('pantry.unitPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                value={newItemUnit}
                onChangeText={setNewItemUnit}
              />
            </View>
            <TouchButton
              title={t('pantry.saveToInventory')}
              onPress={handleSaveItem}
              variant="primary"
              style={{ minHeight: 48 }}
            />
          </View>
        )}

        {loading ? (
          <ActivityIndicator color={colors.amberPrimary} style={{ marginVertical: 16 }} />
        ) : items.length === 0 ? (
          <Text style={styles.emptyInventoryText}>
            {t('pantry.emptyInventory')}
          </Text>
        ) : (
          <View style={styles.itemsList}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>
                  {item.quantity} {item.unit}
                </Text>
              </View>
            ))}
          </View>
        )}
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
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  casingList: {
    gap: 8,
    marginBottom: 14,
  },
  casingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    padding: 12,
  },
  casingOptionActive: {
    borderColor: colors.amberPrimary,
    backgroundColor: '#27201C',
  },
  casingRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.amberPrimary,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  casingRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.amberPrimary,
  },
  casingTextCol: {
    flex: 1,
  },
  casingName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  casingNameActive: {
    color: colors.amberLight,
  },
  casingUsage: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  casingResultBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.amberPrimary,
  },
  casingResultExact: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  casingResultReserve: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  highlight: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  highlightBold: {
    color: colors.amberPrimary,
    fontWeight: '800',
  },
  printBtn: {
    marginTop: 4,
  },
  inventoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addItemBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
  },
  addItemBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.amberPrimary,
  },
  addForm: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  formInput: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    paddingHorizontal: 12,
    minHeight: 44,
    color: colors.textPrimary,
    fontSize: 14,
    marginBottom: 10,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  emptyInventoryText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  itemQty: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.amberLight,
  },
});
