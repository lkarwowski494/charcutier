# Macierz Testów — CHARCUTIER (Spiżarnia Masarza)

*Standard: BR-TEST-028..031 (Apps4Brew Role-Model Studio Standards)*
*Stan na: 2026-10-17 — Całkowite pokrycie: **79 / 79 (100.0%)***

### Podsumowanie kategorii AST

| Kategoria | Pokrycie | Procent | Status |
| :--- | :---: | :---: | :---: |
| **EKRAN** | 7 / 7 | 100.0% | ✅ |
| **UI** | 16 / 16 | 100.0% | ✅ |
| **TEKST** | 11 / 11 | 100.0% | ✅ |
| **LOGIKA** | 40 / 40 | 100.0% | ✅ |
| **WYMIAR** | 5 / 5 | 100.0% | ✅ |

### Szczegółowa tabela pokrycia AST

| Kategoria | Element / Identyfikator | Źródło | Pokrycie testami | Status |
| :--- | :--- | :--- | :--- | :---: |
| **EKRAN** | `/batches` | `app/(tabs)/batches.tsx` | `.maestro/03-partie-i-salami.yaml`<br>`__tests__/hooks/useAppAccess.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/batches/[id]` | `app/(tabs)/batches/[id].tsx` | `.maestro/03-partie-i-salami.yaml`<br>`__tests__/hooks/useAppAccess.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/guide` | `app/(tabs)/guide.tsx` | `.maestro/05-asystent-wedzenia.yaml`<br>`__tests__/hooks/useAppAccess.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/` | `app/(tabs)/index.tsx` | `.maestro/01-kalkulator-peklowania.yaml`<br>`.maestro/02-szynkowar.yaml`<br>`__tests__/components/ActiveFocusModal.test.tsx`<br>`__tests__/components/Apps4BrewPassModal.test.tsx`<br>`__tests__/components/BatchQrScanner.test.tsx`<br>`__tests__/components/CaseHardeningAlert.test.tsx`<br>`__tests__/components/CraftOnboardingModal.test.tsx`<br>`__tests__/components/PpmBadge.test.tsx`<br>`__tests__/components/SensoryRadarChart.test.tsx`<br>`__tests__/components/StepperInput.test.tsx`<br>`__tests__/components/TouchButton.test.tsx`<br>`__tests__/components/WeightChart.test.tsx`<br>`__tests__/core/curing-engine.test.ts`<br>`__tests__/core/custom-equipment.test.ts`<br>`__tests__/core/presets-data.test.ts`<br>`__tests__/core/recipe-share.test.ts`<br>`__tests__/core/smoking-engine.test.ts`<br>`__tests__/core/watch-sync.test.ts`<br>`__tests__/hooks/useAppAccess.test.tsx`<br>`__tests__/hooks/useCraftProfile.test.tsx`<br>`__tests__/hooks/useUnitSystem.test.tsx`<br>`__tests__/services/backup.test.ts`<br>`__tests__/services/label-generator.test.ts`<br>`tests/NumInput.test.tsx`<br>`tests/close-button-guard.test.tsx`<br>`tests/i18n-no-polish-in-en.test.tsx`<br>`tests/interaction-guards.test.ts`<br>`tests/lib/confirm.test.ts`<br>`tests/matrix-a11y.test.tsx`<br>`tests/matrix-dimensions.test.tsx`<br>`tests/matrix-invariants.test.ts`<br>`tests/swipe-delete.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/pantry` | `app/(tabs)/pantry.tsx` | `.maestro/04-spizarnia-etykiety.yaml`<br>`__tests__/hooks/useAppAccess.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/settings` | `app/(tabs)/settings.tsx` | `__tests__/hooks/useAppAccess.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/smoking/[id]` | `app/(tabs)/smoking/[id].tsx` | `__tests__/hooks/useAppAccess.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **LOGIKA** | `calculateCuringRecipe` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts`<br>`tests/curing-properties.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateNitritePpm` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts`<br>`tests/curing-corpus.test.ts`<br>`tests/curing-properties.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateHamMakerRecipe` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `validateThermalSafety` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateBrineDensity` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts`<br>`tests/curing-corpus.test.ts`<br>`tests/curing-properties.test.ts` | ✅ Pokryty |
| **LOGIKA** | `estimateCuringDays` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateWeightLossMetrics` | `src/core/weight-loss-engine.ts` | `__tests__/core/weight-loss-engine.test.ts`<br>`tests/curing-corpus.test.ts`<br>`tests/curing-properties.test.ts`<br>`tests/matrix-invariants.test.ts` | ✅ Pokryty |
| **LOGIKA** | `checkCaseHardening` | `src/core/weight-loss-engine.ts` | `__tests__/core/weight-loss-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `checkFermentationSafety` | `src/core/weight-loss-engine.ts` | `__tests__/core/weight-loss-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `estimateReadinessDate` | `src/core/weight-loss-engine.ts` | `__tests__/core/weight-loss-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `getTargetCoreTemp` | `src/core/smoking-engine.ts` | `__tests__/core/smoking-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `validatePhaseTransition` | `src/core/smoking-engine.ts` | `__tests__/core/smoking-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `checkWaterBathTemp` | `src/core/smoking-engine.ts` | `__tests__/core/smoking-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `isCoreTempReached` | `src/core/smoking-engine.ts` | `__tests__/core/smoking-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateReverseSchedule` | `src/core/reverse-scheduler.ts` | `__tests__/core/reverse-scheduler.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateCustomVesselRecipe` | `src/core/custom-equipment.ts` | `__tests__/core/custom-equipment.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateRadarCoordinates` | `src/core/sensory-radar.ts` | `__tests__/core/sensory-radar.test.ts` | ✅ Pokryty |
| **LOGIKA** | `diagnoseDefect` | `src/core/doctor-engine.ts` | `__tests__/core/doctor-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateDesaltingBath` | `src/core/doctor-engine.ts` | `__tests__/core/doctor-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `MASTERCLASS_PRESETS` | `src/core/presets-data.ts` | `__tests__/core/presets-data.test.ts` | ✅ Pokryty |
| **LOGIKA** | `getPresetById` | `src/core/presets-data.ts` | `__tests__/core/presets-data.test.ts` | ✅ Pokryty |
| **LOGIKA** | `scalePresetToWeight` | `src/core/presets-data.ts` | `__tests__/core/presets-data.test.ts` | ✅ Pokryty |
| **LOGIKA** | `encodeRecipe` | `src/core/recipe-share.ts` | `__tests__/core/recipe-share.test.ts` | ✅ Pokryty |
| **LOGIKA** | `decodeRecipe` | `src/core/recipe-share.ts` | `__tests__/core/recipe-share.test.ts` | ✅ Pokryty |
| **LOGIKA** | `validateRecipeSafety` | `src/core/recipe-share.ts` | `__tests__/core/recipe-share.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateCasingLength` | `src/core/pantry-engine.ts` | `__tests__/core/pantry-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `balanceMeatFat` | `src/core/pantry-engine.ts` | `__tests__/core/pantry-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `createSmokingWatchSnapshot` | `src/services/watch-sync.ts` | `__tests__/core/watch-sync.test.ts` | ✅ Pokryty |
| **LOGIKA** | `formatGarminSmokingPayload` | `src/services/watch-sync.ts` | `__tests__/core/watch-sync.test.ts` | ✅ Pokryty |
| **LOGIKA** | `formatLiveActivitySmokingPayload` | `src/services/watch-sync.ts` | `__tests__/core/watch-sync.test.ts` | ✅ Pokryty |
| **LOGIKA** | `restoreBackup` | `src/services/backup.ts` | `__tests__/services/backup.test.ts` | ✅ Pokryty |
| **LOGIKA** | `exportBatchesToCsv` | `src/services/backup.ts` | `__tests__/services/backup.test.ts` | ✅ Pokryty |
| **LOGIKA** | `exportDatabaseToJson` | `src/services/backup.ts` | `__tests__/services/backup.test.ts` | ✅ Pokryty |
| **LOGIKA** | `safetyBackup` | `src/services/backup.ts` | `__tests__/services/backup.test.ts` | ✅ Pokryty |
| **LOGIKA** | `escapeCsvValue` | `src/services/backup.ts` | `__tests__/services/backup.test.ts` | ✅ Pokryty |
| **LOGIKA** | `checkCorruptState` | `src/services/backup.ts` | `__tests__/services/backup.test.ts` | ✅ Pokryty |
| **LOGIKA** | `generateBatchLabelsHtml` | `src/services/label-generator.ts` | `__tests__/services/label-generator.test.ts` | ✅ Pokryty |
| **LOGIKA** | `escapeHtml` | `src/services/label-generator.ts` | `__tests__/services/label-generator.test.ts` | ✅ Pokryty |
| **LOGIKA** | `wInKeep` | `src/utils/unit-converter.ts` | `__tests__/utils/unit-converter.test.ts` | ✅ Pokryty |
| **LOGIKA** | `formatWeight` | `src/utils/unit-converter.ts` | `__tests__/hooks/useUnitSystem.test.tsx`<br>`__tests__/utils/unit-converter.test.ts` | ✅ Pokryty |
| **UI** | `TouchButton` | `src/components/TouchButton.tsx` | `__tests__/components/CraftOnboardingModal.test.tsx`<br>`__tests__/components/TouchButton.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `CloseButton` | `src/components/ui/index.tsx` | `tests/close-button-guard.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `DoneButton` | `src/components/ui/index.tsx` | `tests/close-button-guard.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `SearchField` | `src/components/ui/index.tsx` | `tests/matrix-a11y.test.tsx`<br>`tests/matrix-dimensions.test.tsx` | ✅ Pokryty |
| **UI** | `NumInput` | `src/components/NumInput.tsx` | `tests/NumInput.test.tsx` | ✅ Pokryty |
| **UI** | `StepperInput` | `src/components/StepperInput.tsx` | `__tests__/components/StepperInput.test.tsx` | ✅ Pokryty |
| **UI** | `Empty` | `src/components/ui/index.tsx` | `tests/matrix-a11y.test.tsx`<br>`tests/matrix-dimensions.test.tsx` | ✅ Pokryty |
| **UI** | `Missing` | `src/components/ui/index.tsx` | `tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `CraftOnboardingModal` | `src/components/CraftOnboardingModal.tsx` | `__tests__/components/CraftOnboardingModal.test.tsx` | ✅ Pokryty |
| **UI** | `ActiveFocusModal` | `src/components/ActiveFocusModal.tsx` | `__tests__/components/ActiveFocusModal.test.tsx` | ✅ Pokryty |
| **UI** | `Apps4BrewPassModal` | `src/components/Apps4BrewPassModal.tsx` | `__tests__/components/Apps4BrewPassModal.test.tsx` | ✅ Pokryty |
| **UI** | `BatchQrScanner` | `src/components/BatchQrScanner.tsx` | `__tests__/components/BatchQrScanner.test.tsx` | ✅ Pokryty |
| **UI** | `PpmBadge` | `src/components/PpmBadge.tsx` | `__tests__/components/PpmBadge.test.tsx`<br>`tests/matrix-a11y.test.tsx`<br>`tests/matrix-dimensions.test.tsx` | ✅ Pokryty |
| **UI** | `CaseHardeningAlert` | `src/components/CaseHardeningAlert.tsx` | `__tests__/components/CaseHardeningAlert.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `SensoryRadarChart` | `src/components/SensoryRadarChart.tsx` | `__tests__/components/SensoryRadarChart.test.tsx` | ✅ Pokryty |
| **UI** | `WeightChart` | `src/components/WeightChart.tsx` | `__tests__/components/WeightChart.test.tsx` | ✅ Pokryty |
| **TEKST** | `calculator.title` | `src/i18n/pl.json` | `__tests__/i18n/i18n.test.ts` | ✅ Pokryty |
| **TEKST** | `calculator.szynkowarTitle` | `src/i18n/pl.json` | `__tests__/i18n/i18n.test.ts` | ✅ Pokryty |
| **TEKST** | `batches.title` | `src/i18n/pl.json` | `__tests__/i18n/i18n.test.ts` | ✅ Pokryty |
| **TEKST** | `smoking.title` | `src/i18n/pl.json` | `__tests__/i18n/i18n.test.ts` | ✅ Pokryty |
| **TEKST** | `pantry.title` | `src/i18n/pl.json` | `__tests__/i18n/i18n.test.ts` | ✅ Pokryty |
| **TEKST** | `doctor.title` | `src/i18n/pl.json` | `__tests__/i18n/i18n.test.ts` | ✅ Pokryty |
| **TEKST** | `common.save` | `src/i18n/pl.json` | `__tests__/i18n/i18n.test.ts`<br>`tests/i18n-no-polish-in-en.test.tsx` | ✅ Pokryty |
| **TEKST** | `common.cancel` | `src/i18n/pl.json` | `__tests__/i18n/i18n.test.ts`<br>`tests/i18n-no-polish-in-en.test.tsx` | ✅ Pokryty |
| **TEKST** | `common.deleteConfirm` | `src/i18n/pl.json` | `__tests__/i18n/i18n.test.ts` | ✅ Pokryty |
| **TEKST** | `backup.corruptDetected` | `src/i18n/pl.json` | `__tests__/i18n/i18n.test.ts` | ✅ Pokryty |
| **TEKST** | `caseHardening.alarmTitle` | `src/i18n/pl.json` | `__tests__/i18n/i18n.test.ts` | ✅ Pokryty |
| **WYMIAR** | `CureSaltType` | `src/types/index.ts` | `__tests__/core/curing-engine.test.ts`<br>`tests/curing-properties.test.ts`<br>`tests/matrix-invariants.test.ts` | ✅ Pokryty |
| **WYMIAR** | `CureType` | `src/types/index.ts` | `tests/curing-properties.test.ts` | ✅ Pokryty |
| **WYMIAR** | `SmokePhase` | `src/types/index.ts` | `__tests__/core/smoking-engine.test.ts` | ✅ Pokryty |
| **WYMIAR** | `SENSORY_AXES` | `src/core/sensory-radar.ts` | `__tests__/core/sensory-radar.test.ts` | ✅ Pokryty |
| **WYMIAR** | `MASTERCLASS_PRESETS` | `src/core/presets-data.ts` | `__tests__/core/presets-data.test.ts` | ✅ Pokryty |
