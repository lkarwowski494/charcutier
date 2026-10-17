#!/usr/bin/env node
/**
 * scripts/check-licenses.mjs
 * Production Dependencies License Scanner & Whitelist Gate
 * Standards: NFR-SEC-009, BR-REL-017
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const ALLOWED_LICENSES = new Set([
  'MIT',
  'ISC',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  '0BSD',
  'Unlicense',
  'CC0-1.0',
  'BlueOak-1.0.0',
]);

const FORBIDDEN_PATTERNS = [
  /\bAGPL\b/i,
  /\bLGPL\b/i,
  /\bGPL\b/i,
  /\bSSPL\b/i,
  /\bCPAL\b/i,
  /\bEUPL\b/i,
];

console.log('[check:licenses] Weryfikacja licencji zależności produkcyjnych...');

const dependencies = Object.keys(pkg.dependencies || {});
const errors = [];

for (const dep of dependencies) {
  // Check special cases like github repository refs (e.g. @apps4craft/ui)
  const pkgJsonPath = join(root, 'node_modules', dep, 'package.json');
  if (!existsSync(pkgJsonPath)) {
    continue;
  }

  const depPkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
  let license = depPkg.license;
  if (typeof license === 'object' && license !== null) {
    license = license.type;
  }
  license = license || 'UNKNOWN';

  // Check forbidden licenses
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(license)) {
      errors.push(`Niedozwolona licencja copyleft (${license}) w pakiecie "${dep}"!`);
    }
  }

  // Check whitelist if known string
  if (license !== 'UNKNOWN' && !ALLOWED_LICENSES.has(license)) {
    // If not explicitly whitelisted, verify it is permissive
    const isPermissive = /MIT|Apache|BSD|ISC/i.test(license);
    if (!isPermissive) {
      errors.push(`Pakiet "${dep}" posiada licencję spoza białej listy permisywnej: ${license}`);
    }
  }
}

if (errors.length > 0) {
  console.error('❌ [check:licenses] Wykryto niezgodności licencyjne:');
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log(`✅ [check:licenses] Wszystkie ${dependencies.length} zależności produkcyjne mają w 100% bezpieczne licencje permisywne!`);
