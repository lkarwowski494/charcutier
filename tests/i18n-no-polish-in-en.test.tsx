import en from '../src/i18n/en.json';
import pl from '../src/i18n/pl.json';
import { t, setLanguage, getLanguage } from '../src/i18n';

describe('i18n hygiene & no Polish characters in English dictionary (NFR-I18N-001..008)', () => {
  const polishDiacriticsRegex = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;

  it('No Polish diacritics in English translation values (except legitimate proper names/brands)', () => {
    const allowedBorrowings = new Set([
      'Polish Peklosól (0.5–0.6% NaNO2)',
      'SŁOIK — Pickles & Home Fermentation',
      'Kiełbasa',
      'Kabanosy',
    ]);

    const violations: { key: string; value: string }[] = [];

    function checkObj(obj: Record<string, any>, prefix = '') {
      for (const [k, v] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${k}` : k;
        if (typeof v === 'string') {
          if (allowedBorrowings.has(v) || allowedBorrowings.has(k)) {
            continue;
          }
          if (polishDiacriticsRegex.test(v)) {
            violations.push({ key: fullKey, value: v });
          }
        } else if (typeof v === 'object' && v !== null) {
          checkObj(v, fullKey);
        }
      }
    }

    checkObj(en);

    if (violations.length > 0) {
      const details = violations.map((v) => `"${v.key}" -> "${v.value}"`).join('\n');
      throw new Error(`[NFR-I18N-002 Violation] Polish diacritics found in EN translations:\n${details}`);
    }

    expect(violations.length).toBe(0);
  });

  it('setLanguage switches language correctly and t() interpolates parameters', () => {
    setLanguage('en');
    expect(getLanguage()).toBe('en');
    expect(t('common.cancel')).toBe('Cancel');
    expect(t('common.save')).toBe('Save');

    setLanguage('pl');
    expect(getLanguage()).toBe('pl');
    expect(t('common.cancel')).toBe('Anuluj');
    expect(t('common.save')).toBe('Zapisz');
  });

  it('t() parameter interpolation works seamlessly in both languages', () => {
    setLanguage('pl');
    const plRes = t('access.trialDaysLeft', { days: 5 });
    expect(plRes).toContain('5');

    setLanguage('en');
    const enRes = t('access.trialDaysLeft', { days: 5 });
    expect(enRes).toContain('5');
    setLanguage('pl');
  });
});
