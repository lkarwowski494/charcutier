/**
 * CHARCUTIER — Butchery Masterclass & Defect Troubleshooter
 * Apps4Brew Studio
 *
 * Implements:
 * - Biological safety commandments
 * - Smoking woods compendium
 * - Mold identification atlas (Bactoferm vs hazardous mycotoxins)
 * - Charcuterie defect troubleshooter
 */

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../../src/theme/colors';
import { t } from '../../src/i18n';
import {
  BUTCHERY_DEFECTS_CATALOG,
  calculateDesaltingBath,
  diagnoseDefect,
} from '../../src/core/doctor-engine';

export default function GuideScreen() {
  const [activeTab, setActiveTab] = useState<'safety' | 'woods' | 'molds' | 'defects' | 'doctor'>('safety');
  const [selectedDefectId, setSelectedDefectId] = useState<string>('case_hardening');
  const [desaltWeightKg, setDesaltWeightKg] = useState<number>(2.0);
  const [desaltCurrentSalt, setDesaltCurrentSalt] = useState<number>(30);
  const [desaltTargetSalt, setDesaltTargetSalt] = useState<number>(22);

  const selectedDefect = diagnoseDefect(selectedDefectId) || BUTCHERY_DEFECTS_CATALOG[0];
  const desaltingBath = calculateDesaltingBath(desaltWeightKg, desaltCurrentSalt, desaltTargetSalt);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Category Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'safety' && styles.tabBtnActive]}
          onPress={() => setActiveTab('safety')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'safety' && styles.tabBtnTextActive]}>
            🛡️ Dekalog
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'woods' && styles.tabBtnActive]}
          onPress={() => setActiveTab('woods')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'woods' && styles.tabBtnTextActive]}>
            🪵 Drewno
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'molds' && styles.tabBtnActive]}
          onPress={() => setActiveTab('molds')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'molds' && styles.tabBtnTextActive]}>
            🦠 Pleśnie
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'defects' && styles.tabBtnActive]}
          onPress={() => setActiveTab('defects')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'defects' && styles.tabBtnTextActive]}>
            🧭 Wady
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'doctor' && styles.tabBtnActive]}
          onPress={() => setActiveTab('doctor')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'doctor' && styles.tabBtnTextActive]}>
            🩺 Doktor
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. BIOLOGICAL SAFETY */}
      {activeTab === 'safety' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dekalog Bezpieczeństwa Biologicznego Masarza</Text>

          <View style={styles.ruleCard}>
            <Text style={styles.ruleNum}>1. PPM GUARD (DAWKOWANIE AZOTYNU)</Text>
            <Text style={styles.ruleText}>
              Nigdy nie myl polskiej peklosoli (0.6% NaNO2) z amerykańskim Prague Powder #1 (6.25%). Dawka 100–150 PPM (mg/kg) zapewnia 100% ochrony przed jadem kiełbasianym (Clostridium botulinum). Stężenie powyżej 200 PPM jest prawnie i biologicznie toksyczne!
            </Text>
          </View>

          <View style={styles.ruleCard}>
            <Text style={styles.ruleNum}>2. BEZWZGLĘDNA BLOKADA SALETRY W CIEPLE</Text>
            <Text style={styles.ruleText}>
              Saletra potasowa (KNO3 / Cure #2) jest dozwolona WYŁĄCZNIE w wędlinach długodojrzewających na surowo (&gt;30 dni). Podgrzanie saletry powyżej 75°C prowadzi do gwałtownej reakcji tworzenia rakotwórczych nitrozoamin (NDMA).
            </Text>
          </View>

          <View style={styles.ruleCard}>
            <Text style={styles.ruleNum}>3. ALARM CASE HARDENING</Text>
            <Text style={styles.ruleText}>
              Ubytek wagi w pierwszych 5 dobach NIE MOŻE przekraczać 3.0%/dobę. Jeśli woda z powierzchni odparuje za szybko, powstanie twardy pancerz skurczonych białek, blokując odparowywanie z rdzenia i powodując gnicie od środka.
            </Text>
          </View>

          <View style={styles.ruleCard}>
            <Text style={styles.ruleNum}>4. OBOWIĄZKOWE BADANIE DZICZYZNY</Text>
            <Text style={styles.ruleText}>
              Mięso dzika bezwzględnie wymaga urzędowego badania weterynaryjnego metodą wytrawiania na obecność włośnicy (Trichinella spiralis). Domowe mrożenie w zamrażarce NIE zabija europejskich szczepów włośnia!
            </Text>
          </View>

          <View style={styles.ruleCard}>
            <Text style={styles.ruleNum}>5. LIMIT 82°C PRZY PARZENIU</Text>
            <Text style={styles.ruleText}>
              Woda do parzenia kiełbas i szynki powinna mieć 75–80°C. Przekroczenie 82°C powoduje wytopienie tłuszczu pod osłonkę, pękanie jelit i suchy, wiórowaty farsz.
            </Text>
          </View>
        </View>
      )}

      {/* 2. SMOKING WOODS */}
      {activeTab === 'woods' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atlas Drewna Wędzarniczego</Text>

          <View style={styles.ruleCard}>
            <Text style={styles.woodName}>Olcha (Królowa Polskiego Wędzenia)</Text>
            <Text style={styles.ruleText}>
              Najbardziej uniwersalne drewno. Daje piękny, ciemnozłocisty do jasnobrązowego kolor oraz zrównoważony, łagodny aromat. Doskonała do wszystkich mięs: wieprzowiny, drobiu, wołowiny i ryb.
            </Text>
          </View>

          <View style={styles.ruleCard}>
            <Text style={styles.woodName}>Buk (Klasyka Wędlin Szlachetnych)</Text>
            <Text style={styles.ruleText}>
              Czysty, delikatny dym nadający wyrobom złocisto-żółtą barwę. Nie dominuje naturalnego smaku przypraw i mięsa. Standard w produkcji parówek, szynki i kiełbasy krakowskiej.
            </Text>
          </View>

          <View style={styles.ruleCard}>
            <Text style={styles.woodName}>Dąb (Mocny Profil & Wołowina)</Text>
            <Text style={styles.ruleText}>
              Głęboki, wyrazisty aromat i ciemnobrązowa barwa. Zawiera garbniki, dlatego wymaga suchego drewna bez kory. Idealny do wołowiny, dziczyzny i kiełbas myśliwskich.
            </Text>
          </View>

          <View style={styles.ruleCard}>
            <Text style={styles.woodName}>Drzewa Owocowe (Jabłoń, Wiśnia, Śliwa)</Text>
            <Text style={styles.ruleText}>
              Słodkawy, owocowy aromat. Wiśnia i śliwa nadają wędlinom wyjątkowy, ciemnowiśniowy, mahoniowy odcień. Świetne do boczku, drobiu i polędwiczek.
            </Text>
          </View>
        </View>
      )}

      {/* 3. MOLDS ATLAS */}
      {activeTab === 'molds' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atlas Pleśni Dojrzewalniczych</Text>

          <View style={[styles.ruleCard, { borderColor: colors.safe, borderWidth: 1.5 }]}>
            <Text style={[styles.woodName, { color: colors.safe }]}>
              ✅ Pleśń Pożądana: Penicillium nalgiovense (Bactoferm M-EK-4)
            </Text>
            <Text style={styles.ruleText}>
              {t('guide.goodMold')}
            </Text>
            <Text style={[styles.ruleText, { marginTop: 6, color: '#A7F3D0' }]}>
              Działanie: Chroni baton przed światłem, jełczeniem tłuszczu oraz zasiedleniem przez zarodniki grzybów trujących. Konsumuje kwas mlekowy, obniżając kwasowość dojrzałego salami.
            </Text>
          </View>

          <View style={[styles.ruleCard, { borderColor: colors.danger, borderWidth: 1.5 }]}>
            <Text style={[styles.woodName, { color: colors.danger }]}>
              ⛔ Pleśnie Groźne (Toksyczne Mykotoksyny)
            </Text>
            <Text style={styles.ruleText}>
              {t('guide.badMold')}
            </Text>
            <Text style={[styles.ruleText, { marginTop: 6, color: '#FECACA' }]}>
              Zasada bezpieczeństwa: Jeśli na wędlinie pojawi się zielona, kłaczkowata, czarna lub śluzowata pleśń, jej strzępki wnikają w głąb mięsa produkując rakotwórcze aflatoksyny. Wyrób należy bezwzględnie zutylizować!
            </Text>
          </View>
        </View>
      )}

      {/* 4. DEFECTS TROUBLESHOOTER */}
      {activeTab === 'defects' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kompas Wad i Defektów Masarskich</Text>

          <View style={styles.ruleCard}>
            <Text style={styles.defectTitle}>Wada: Case Hardening (Zesztywnienie powierzchniowe)</Text>
            <Text style={styles.defectMeta}><b>Objaw:</b> Twarda, ciemna obwódka pod osłonką, miękki i mazisty środek.</Text>
            <Text style={styles.defectMeta}><b>Przyczyna:</b> Zbyt niska wilgotność w komorze (&lt;75% RH) lub zbyt silny nawiew w pierwszych dniach.</Text>
            <Text style={styles.defectFix}><b>Rozwiązanie:</b> Zwiększ wilgotność do 82–85%, zmniejsz ruch powietrza lub zawiń baton w worek próżniowy na 3–5 dni, aby wyrównać wilgoć.</Text>
          </View>

          <View style={styles.ruleCard}>
            <Text style={styles.defectTitle}>Wada: Podciek galarety / wytopiony tłuszcz</Text>
            <Text style={styles.defectMeta}><b>Objaw:</b> Płynny lub zastygły tłuszcz pod jelitem, wiórowaty farsz.</Text>
            <Text style={styles.defectMeta}><b>Przyczyna:</b> Za wysoka temperatura wody w parzeniu (&gt;82°C) lub tępe sitka w maszynce (miażdżenie słoniny).</Text>
            <Text style={styles.defectFix}><b>Rozwiązanie:</b> Pilnuj termometru w kotle (75–80°C) oraz schładzaj słoninę do -2°C przed mieleniem.</Text>
          </View>

          <View style={styles.ruleCard}>
            <Text style={styles.defectTitle}>Wada: Kwaśny, smolisty smak wędzonki</Text>
            <Text style={styles.defectMeta}><b>Objaw:</b> Ciemna, lepka sadza na osłonce, piekący i kwaśny posmak.</Text>
            <Text style={styles.defectMeta}><b>Przyczyna:</b> Wędzenie mokrego mięsa lub wilgotnego drewna przy zduszonym dopływie powietrza.</Text>
            <Text style={styles.defectFix}><b>Rozwiązanie:</b> ZAWSZE osuszaj mięso w wędzarni bez dymu do stanu „suchego pergaminu” i wędź wyłącznie suchym drewnem liściastym.</Text>
          </View>
        </View>
      )}

      {/* 5. INTERACTIVE BUTCHERY DOCTOR & DESALTING CALCULATOR */}
      {activeTab === 'doctor' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('doctor.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('doctor.subtitle')}</Text>

          {/* Symptom Selector */}
          <Text style={styles.pickerHeader}>{t('doctor.selectSymptom')}:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.symptomChipRow}>
            {BUTCHERY_DEFECTS_CATALOG.map((defect) => (
              <TouchableOpacity
                key={defect.id}
                style={[styles.symptomChip, selectedDefectId === defect.id && styles.symptomChipActive]}
                onPress={() => setSelectedDefectId(defect.id || 'case_hardening')}
              >
                <Text style={[styles.symptomChipText, selectedDefectId === defect.id && styles.symptomChipTextActive]}>
                  {defect.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Active Defect Diagnosis Card */}
          <View style={styles.diagnosisCard}>
            <View style={styles.defectHeaderRow}>
              <Text style={styles.diagnosisTitle}>{selectedDefect.title}</Text>
              <View style={[
                styles.severityBadge,
                selectedDefect.severity === 'critical' ? styles.sevCritical :
                selectedDefect.severity === 'moderate' ? styles.sevModerate : styles.sevMinor
              ]}>
                <Text style={styles.severityText}>{selectedDefect.severity.toUpperCase()}</Text>
              </View>
            </View>

            {selectedDefect.immediateAction && (
              <View style={styles.immediateBox}>
                <Text style={styles.immediateLabel}>🚨 {t('doctor.immediateAction')}:</Text>
                <Text style={styles.immediateText}>{selectedDefect.immediateAction}</Text>
              </View>
            )}

            <Text style={styles.diagLabel}>{t('doctor.diagnosis')}:</Text>
            <Text style={styles.diagText}>{selectedDefect.cause || selectedDefect.rootCause}</Text>

            <Text style={styles.diagLabel}>{t('doctor.recoveryProtocol')}:</Text>
            {selectedDefect.recoverySteps.map((step, idx) => (
              <View key={idx} style={styles.recoveryStepRow}>
                <Text style={styles.stepNum}>{idx + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}

            <View style={styles.preventionBox}>
              <Text style={styles.preventionTitle}>💡 {t('doctor.prevention')}:</Text>
              <Text style={styles.preventionText}>{selectedDefect.prevention || selectedDefect.preventiveRule}</Text>
            </View>
          </View>

          {/* Desalting Water Bath Calculator */}
          <View style={styles.desaltingCard}>
            <Text style={styles.desaltingHeader}>💧 {t('doctor.desaltingCalculator')}</Text>

            <View style={styles.desaltStepperRow}>
              <Text style={styles.desaltLabel}>Waga wsadu: {desaltWeightKg.toFixed(1)} kg</Text>
              <View style={styles.stepBtnPair}>
                <TouchableOpacity
                  style={styles.stepMiniBtn}
                  onPress={() => setDesaltWeightKg((w) => Math.max(0.5, Number((w - 0.5).toFixed(1))))}
                >
                  <Text style={styles.stepMiniText}>-0.5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stepMiniBtn}
                  onPress={() => setDesaltWeightKg((w) => Number((w + 0.5).toFixed(1)))}
                >
                  <Text style={styles.stepMiniText}>+0.5</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.desaltStepperRow}>
              <Text style={styles.desaltLabel}>Obecna sól: {desaltCurrentSalt} g/kg</Text>
              <View style={styles.stepBtnPair}>
                <TouchableOpacity
                  style={styles.stepMiniBtn}
                  onPress={() => setDesaltCurrentSalt((s) => Math.max(15, s - 2))}
                >
                  <Text style={styles.stepMiniText}>-2g</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stepMiniBtn}
                  onPress={() => setDesaltCurrentSalt((s) => s + 2)}
                >
                  <Text style={styles.stepMiniText}>+2g</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.desaltStepperRow}>
              <Text style={styles.desaltLabel}>Cel soli: {desaltTargetSalt} g/kg</Text>
              <View style={styles.stepBtnPair}>
                <TouchableOpacity
                  style={styles.stepMiniBtn}
                  onPress={() => setDesaltTargetSalt((s) => Math.max(16, s - 1))}
                >
                  <Text style={styles.stepMiniText}>-1g</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stepMiniBtn}
                  onPress={() => setDesaltTargetSalt((s) => s + 1)}
                >
                  <Text style={styles.stepMiniText}>+1g</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bath calculation summary */}
            <View style={styles.bathSummaryBox}>
              <Text style={styles.bathSummaryHours}>
                ⏱️ {t('doctor.waterBathHours', { hours: desaltingBath.soakTimeHours })}
              </Text>
              <Text style={styles.bathSummaryVolume}>
                🪣 Wymagana woda: {desaltingBath.waterVolumeLiters} l (temp. maks. 4°C z lodem)
              </Text>
              <Text style={styles.bathSummaryAdvice}>{t('doctor.waterRatioAdvice')}</Text>
            </View>
          </View>
        </View>
      )}
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
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    minHeight: 44,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBtnActive: {
    backgroundColor: colors.amberPrimary,
    borderColor: colors.amberPrimary,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  tabBtnTextActive: {
    color: colors.textInverse,
    fontWeight: '800',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  ruleCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  ruleNum: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.amberPrimary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  ruleText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  woodName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.amberLight,
    marginBottom: 6,
  },
  defectTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FCA5A5',
    marginBottom: 6,
  },
  defectMeta: {
    fontSize: 12.5,
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  defectFix: {
    fontSize: 12.5,
    color: colors.safe,
    lineHeight: 18,
    marginTop: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  pickerHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.amberLight,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  symptomChipRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  symptomChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginRight: 8,
  },
  symptomChipActive: {
    backgroundColor: colors.amberPrimary,
    borderColor: colors.amberLight,
  },
  symptomChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  symptomChipTextActive: {
    color: colors.textInverse,
    fontWeight: '800',
  },
  diagnosisCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginBottom: 14,
  },
  defectHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  diagnosisTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sevCritical: {
    backgroundColor: '#7F1D1D',
  },
  sevModerate: {
    backgroundColor: '#78350F',
  },
  sevMinor: {
    backgroundColor: '#1E3A8A',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  immediateBox: {
    backgroundColor: '#450A0A',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.danger,
    marginBottom: 12,
  },
  immediateLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FECACA',
    marginBottom: 2,
  },
  immediateText: {
    fontSize: 13,
    color: '#FEE2E2',
    fontWeight: '600',
    lineHeight: 18,
  },
  diagLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.amberLight,
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  diagText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
    marginBottom: 6,
  },
  recoveryStepRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  stepNum: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.amberPrimary,
  },
  stepText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    flex: 1,
  },
  preventionBox: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  preventionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.safe,
    marginBottom: 4,
  },
  preventionText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  desaltingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    marginBottom: 16,
  },
  desaltingHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  desaltStepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  desaltLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  stepBtnPair: {
    flexDirection: 'row',
    gap: 6,
  },
  stepMiniBtn: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stepMiniText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bathSummaryBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bathSummaryHours: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 4,
  },
  bathSummaryVolume: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  bathSummaryAdvice: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
