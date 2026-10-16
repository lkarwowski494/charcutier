/**
 * CHARCUTIER — Butchery Doctor & Emergency Recovery Unit Tests
 * Apps4Brew Studio
 */

import {
  diagnoseDefect,
  calculateDesaltingBath,
  BUTCHERY_DEFECTS_CATALOG,
} from '../../src/core/doctor-engine';

describe('doctor-engine: Butchery Troubleshooting & Recovery', () => {
  test('diagnoses Case Hardening with vacuum moisture redistribution protocol', () => {
    const diag = diagnoseDefect('case_hardening');
    expect(diag).toBeDefined();
    expect(diag!.id).toBe('case_hardening');
    expect(diag!.severity).toBe('moderate');
    expect(diag!.immediateAction).toContain('Przenieś wyrób natychmiast');
    expect(diag!.recoverySteps.length).toBeGreaterThan(0);
    expect(diag!.recoverySteps.some((step) => step.toLowerCase().includes('próżniow'))).toBe(true);
  });

  test('diagnoses over-salting defect and provides cold bath procedure', () => {
    const diag = diagnoseDefect('too_salty');
    expect(diag).toBeDefined();
    expect(diag!.severity).toBe('minor');
    expect(diag!.immediateAction).toContain('Kąpiel w zimnej wodzie');
  });

  test('marks toxic green/black mold as CRITICAL with disposal recommendation', () => {
    const diag = diagnoseDefect('green_black_mold');
    expect(diag).toBeDefined();
    expect(diag!.severity).toBe('critical');
    expect(diag!.recoverySteps.some((s) => s.includes('utylizacji'))).toBe(true);
  });

  test('calculates accurate desalting water bath duration and volume', () => {
    // 2kg meat, current 32 g/kg, target 22 g/kg (diff = 10 g/kg)
    const bath = calculateDesaltingBath(2.0, 32, 22);

    expect(bath.meatWeightKg).toBe(2.0);
    expect(bath.excessSaltGramsPerKg).toBe(10);
    expect(bath.waterVolumeLiters).toBe(6.0); // 2kg * 3L/kg
    expect(bath.soakTimeHours).toBe(5.0); // 10 * 0.5h
    expect(bath.waterTempMaxCelsius).toBe(4);
    expect(bath.instructions.length).toBeGreaterThan(0);
  });

  test('returns 0 hours soak time when current salt is already below or equal to target', () => {
    const bath = calculateDesaltingBath(3.0, 20, 22);
    expect(bath.excessSaltGramsPerKg).toBe(0);
    expect(bath.soakTimeHours).toBe(0);
  });

  test('returns undefined for non-existent defect code', () => {
    expect(diagnoseDefect('unknown_defect' as any)).toBeUndefined();
  });

  test('catalog contains all standard defects with prevention advice', () => {
    expect(BUTCHERY_DEFECTS_CATALOG.length).toBe(7);
    for (const defect of BUTCHERY_DEFECTS_CATALOG) {
      expect(defect.title).toBeDefined();
      expect(defect.symptom).toBeDefined();
      expect(defect.cause).toBeDefined();
      expect(defect.prevention).toBeDefined();
      expect(defect.recoverySteps.length).toBeGreaterThan(0);
    }
  });
});
