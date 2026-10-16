# Macierz Testów — CHARCUTIER (Spiżarnia Masarza)

*Automatycznie wygenerowano przez `scripts/test-matrix.mjs` — stan na: 2026-10-16*

| Kategoria | Element / Identyfikator | Źródło | Pokrycie testami | Status |
| :--- | :--- | :--- | :--- | :---: |
| **EKRAN** | `/batches/[id]` | `app/(tabs)/batches/[id].tsx` | `.maestro/03-partie-i-salami.yaml`<br>`__tests__/hooks/useAppAccess.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/batches` | `app/(tabs)/batches.tsx` | `.maestro/03-partie-i-salami.yaml`<br>`__tests__/hooks/useAppAccess.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/guide` | `app/(tabs)/guide.tsx` | `.maestro/05-asystent-wedzenia.yaml`<br>`__tests__/hooks/useAppAccess.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/` | `app/(tabs)/index.tsx` | `.maestro/01-kalkulator-peklowania.yaml`<br>`.maestro/02-szynkowar.yaml`<br>`__tests__/components/ActiveFocusModal.test.tsx`<br>`__tests__/components/Apps4BrewPassModal.test.tsx`<br>`__tests__/components/BatchQrScanner.test.tsx`<br>`__tests__/components/CaseHardeningAlert.test.tsx`<br>`__tests__/components/CraftOnboardingModal.test.tsx`<br>`__tests__/components/PpmBadge.test.tsx`<br>`__tests__/components/SensoryRadarChart.test.tsx`<br>`__tests__/components/StepperInput.test.tsx`<br>`__tests__/components/TouchButton.test.tsx`<br>`__tests__/components/WeightChart.test.tsx`<br>`__tests__/core/curing-engine.test.ts`<br>`__tests__/core/custom-equipment.test.ts`<br>`__tests__/core/doctor-engine.test.ts`<br>`__tests__/core/pantry-engine.test.ts`<br>`__tests__/core/presets-data.test.ts`<br>`__tests__/core/recipe-share.test.ts`<br>`__tests__/core/reverse-scheduler.test.ts`<br>`__tests__/core/sensory-radar.test.ts`<br>`__tests__/core/smoking-engine.test.ts`<br>`__tests__/core/watch-sync.test.ts`<br>`__tests__/core/weight-loss-engine.test.ts`<br>`__tests__/hooks/useAppAccess.test.tsx`<br>`__tests__/hooks/useCraftProfile.test.tsx`<br>`__tests__/hooks/useUnitSystem.test.tsx`<br>`__tests__/i18n/i18n.test.ts`<br>`__tests__/services/backup.test.ts`<br>`__tests__/services/label-generator.test.ts`<br>`__tests__/utils/unit-converter.test.ts` | ✅ Pokryty |
| **EKRAN** | `/pantry` | `app/(tabs)/pantry.tsx` | `.maestro/04-spizarnia-etykiety.yaml`<br>`__tests__/core/pantry-engine.test.ts`<br>`__tests__/hooks/useAppAccess.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/settings` | `app/(tabs)/settings.tsx` | `__tests__/hooks/useAppAccess.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/smoking/[id]` | `app/(tabs)/smoking/[id].tsx` | `__tests__/hooks/useAppAccess.test.tsx` | ✅ Pokryty |
| **LOGIKA** | `calculateCuringRecipe` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateNitritePpm` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateHamMakerRecipe` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `validateThermalSafety` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateBrineDensity` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `estimateCuringDays` | `src/core/curing-engine.ts` | `__tests__/core/curing-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateWeightLossMetrics` | `src/core/weight-loss-engine.ts` | `__tests__/core/weight-loss-engine.test.ts` | ✅ Pokryty |
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

### Podsumowanie pokrycia macierzy: **37 / 37 (100.0%)**

- **EKRANY:** 100% tras pokryte testami E2E Maestro lub testami integracyjnymi
- **LOGIKA:** 100% funkcji silnika masarskiego, bezpieczeństwa i bazy pokryte testami jednostkowymi
