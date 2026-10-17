/**
 * CHARCUTIER — i18n Engine Tests
 * Apps4Brew Studio
 */

import { t, setLanguage, getLanguage, subscribeLanguageChange } from '../../src/i18n';

describe('i18n translation engine', () => {
  beforeEach(() => {
    setLanguage('pl');
  });

  test('translates simple dot-notated keys in Polish', () => {
    expect(t('common.cancel')).toBe('Anuluj');
    expect(t('common.save')).toBe('Zapisz');
    expect(t('common.deleteConfirm')).toBe('Usuń');
    expect(t('calculator.title')).toBe('Kalkulator Masarski');
    expect(t('calculator.szynkowarTitle')).toBe('Kalkulator Szynkowaru i Prasy');
    expect(t('batches.title')).toBe('Aktywne Partie');
    expect(t('smoking.title')).toBe('Asystent Wędzenia & Parzenia');
    expect(t('pantry.title')).toBe('Spiżarnia & Jelita');
    expect(t('doctor.title')).toBe('Doktor Wędliniarski (SOS)');
    expect(t('backup.corruptDetected')).toContain('Wykryto uszkodzony stan');
    expect(t('caseHardening.alarmTitle')).toContain('CASE HARDENING');
    expect(t('access.passTitle')).toBe('CHARCUTIER Pass');
  });

  test('switches language to English and translates correctly', () => {
    setLanguage('en');
    expect(getLanguage()).toBe('en');
    expect(t('common.cancel')).toBe('Cancel');
    expect(t('common.save')).toBe('Save');
    expect(t('calculator.title')).toBe('Curing Calculator');
    expect(t('batches.title')).toBe('Active Batches');
    expect(t('smoking.title')).toBe('Smoking & Scalding Assistant');
    expect(t('pantry.title')).toBe('Pantry & Casings');
    expect(t('doctor.title')).toBe('Butchery Doctor (SOS)');
  });

  test('interpolates parameters correctly', () => {
    setLanguage('pl');
    expect(t('access.trialDaysLeft', { days: 7 })).toBe('Pozostało dni: 7');
    expect(t('batches.activeCount', { count: 3 })).toBe('Partie w toku: 3');

    setLanguage('en');
    expect(t('access.trialDaysLeft', { days: 7 })).toBe('Days remaining: 7');
    expect(t('batches.activeCount', { count: 3 })).toBe('Active batches: 3');
  });

  test('falls back to key or Polish if key not found', () => {
    setLanguage('en');
    expect(t('nonexistent.nested.key')).toBe('nonexistent.nested.key');
  });

  test('notifies subscribers upon language change', () => {
    const callback = jest.fn();
    const unsubscribe = subscribeLanguageChange(callback);

    setLanguage('en');
    expect(callback).toHaveBeenCalledWith('en');

    setLanguage('pl');
    expect(callback).toHaveBeenCalledWith('pl');

    unsubscribe();
    setLanguage('en');
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
