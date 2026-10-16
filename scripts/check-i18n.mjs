#!/usr/bin/env node
/**
 * CHARCUTIER — i18n Parity & Integrity Checker
 * Studio: Apps4Brew
 * Validates that all translation keys match 100% between pl.json and en.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PL_PATH = path.join(ROOT_DIR, 'src', 'i18n', 'pl.json');
const EN_PATH = path.join(ROOT_DIR, 'src', 'i18n', 'en.json');

function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(flattenKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function runCheck() {
  console.log('🔍 Checking i18n dictionaries for CHARCUTIER...');

  if (!fs.existsSync(PL_PATH)) {
    console.error(`❌ Missing PL dictionary file at: ${PL_PATH}`);
    process.exit(1);
  }

  if (!fs.existsSync(EN_PATH)) {
    console.error(`❌ Missing EN dictionary file at: ${EN_PATH}`);
    process.exit(1);
  }

  const plContent = JSON.parse(fs.readFileSync(PL_PATH, 'utf-8'));
  const enContent = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));

  const plKeys = new Set(flattenKeys(plContent));
  const enKeys = new Set(flattenKeys(enContent));

  const missingInEn = [...plKeys].filter((k) => !enKeys.has(k));
  const missingInPl = [...enKeys].filter((k) => !plKeys.has(k));

  let hasError = false;

  if (missingInEn.length > 0) {
    console.error(`❌ Found ${missingInEn.length} key(s) present in PL but missing in EN:`);
    missingInEn.forEach((k) => console.error(`   - ${k}`));
    hasError = true;
  }

  if (missingInPl.length > 0) {
    console.error(`❌ Found ${missingInPl.length} key(s) present in EN but missing in PL:`);
    missingInPl.forEach((k) => console.error(`   - ${k}`));
    hasError = true;
  }

  if (hasError) {
    console.error('\n💥 i18n parity check failed! Please synchronize dictionaries.');
    process.exit(1);
  }

  console.log(`✅ i18n parity check passed: ${plKeys.size} translation keys in 100% sync (PL <-> EN).`);
}

runCheck();
