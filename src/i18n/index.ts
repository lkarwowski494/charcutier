/**
 * CHARCUTIER — i18n Translation Engine
 * Apps4Brew Studio
 */

import pl from './pl.json';
import en from './en.json';
import { AppLanguage } from '../types';

const dictionaries: Record<AppLanguage, Record<string, any>> = {
  pl,
  en,
};

let currentLanguage: AppLanguage = 'pl';
const listeners = new Set<(lang: AppLanguage) => void>();

/**
 * Get currently selected language
 */
export function getLanguage(): AppLanguage {
  return currentLanguage;
}

/**
 * Set application language and notify all active listeners
 */
export function setLanguage(lang: AppLanguage): void {
  if (lang !== 'pl' && lang !== 'en') return;
  if (currentLanguage !== lang) {
    currentLanguage = lang;
    listeners.forEach((listener) => {
      try {
        listener(lang);
      } catch (err) {
        console.error('Error in i18n listener:', err);
      }
    });
  }
}

/**
 * Subscribe to language changes
 */
export function subscribeLanguageChange(listener: (lang: AppLanguage) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Translate a dot-notated key with optional interpolation params
 * Example: t('access.trialDaysLeft', { days: 5 })
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const dict = dictionaries[currentLanguage] || dictionaries.pl;
  const parts = key.split('.');

  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to PL if missing in current
      let fallback: any = dictionaries.pl;
      for (const fbPart of parts) {
        if (fallback && typeof fallback === 'object' && fbPart in fallback) {
          fallback = fallback[fbPart];
        } else {
          return key;
        }
      }
      current = fallback;
      break;
    }
  }

  if (typeof current !== 'string') {
    return key;
  }

  if (!params) {
    return current;
  }

  // Replace {paramName}
  return current.replace(/\{(\w+)\}/g, (match, paramName) => {
    if (paramName in params) {
      return String(params[paramName]);
    }
    return match;
  });
}
