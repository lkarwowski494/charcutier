/**
 * Brand & Trademark Purity Contract Test
 * Standards: NFR-SEC-011, BR-REL-018, DEC-10
 * Ensures no third-party trademark infringements in UI, dictionaries, app.json, or site/.
 */

import fs from 'fs';
import path from 'path';

const root = path.join(__dirname, '..');

// Blacklist of commercial third-party trademarks and competitors
const FORBIDDEN_TRADEMARKS = [
  'Thermomix',
  'SousVide Supreme',
  'Anova Precision',
  'Bradley Smoker',
  'Traeger',
  'Big Green Egg',
  'CrossFit',
  'Yahtzee',
  'IKEA',
];

describe('NFR-SEC-011: Brand & Trademark Purity Contract', () => {
  test('Language dictionaries (pl.json, en.json) do not contain protected third-party trademarks', () => {
    const i18nDir = path.join(root, 'src', 'i18n');
    const files = fs.readdirSync(i18nDir).filter((f) => f.endsWith('.json'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(i18nDir, file), 'utf8');
      for (const brand of FORBIDDEN_TRADEMARKS) {
        const regex = new RegExp(`\\b${brand}\\b`, 'i');
        expect(content).not.toMatch(regex);
      }
    }
  });

  test('app.json, site/ and presets metadata do not contain protected trademarks', () => {
    const appJson = fs.readFileSync(path.join(root, 'app.json'), 'utf8');
    for (const brand of FORBIDDEN_TRADEMARKS) {
      expect(appJson).not.toMatch(new RegExp(`\\b${brand}\\b`, 'i'));
    }

    const siteFiles = ['index.html', 'privacy.html', 'support.html'];
    for (const f of siteFiles) {
      const p = path.join(root, 'site', f);
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        for (const brand of FORBIDDEN_TRADEMARKS) {
          expect(content).not.toMatch(new RegExp(`\\b${brand}\\b`, 'i'));
        }
      }
    }
  });

  test('Studio branding strictly refers to Apps4Craft / Apps4Brew Studio', () => {
    const appJson = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo;
    expect(appJson.ios.bundleIdentifier).toBe('com.apps4brew.charcutier');
    expect(appJson.ios.appleTeamId).toBe('8NQ9GHY8GF');
  });
});
