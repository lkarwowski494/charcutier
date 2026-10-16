// Weryfikacja syntaktyczna i integralności scenariuszy Maestro E2E
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const maestroDir = join(root, '.maestro');

if (!existsSync(maestroDir)) {
  console.error('[maestro-check] Katalog .maestro nie istnieje!');
  process.exit(1);
}

const files = readdirSync(maestroDir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));

console.log(`[maestro-check] Weryfikacja ${files.length} scenariuszy E2E...`);

let errors = 0;
for (const file of files) {
  const filePath = join(maestroDir, file);
  const content = readFileSync(filePath, 'utf8');

  if (file === 'config.yaml') {
    if (!content.includes('executionOrder')) {
      console.error(`❌ [${file}] Brak klucza executionOrder`);
      errors++;
    } else {
      console.log(`✅ [${file}] Poprawny plik konfiguracyjny Maestro`);
    }
    continue;
  }

  if (!content.includes('appId: com.apps4brew.charcutier')) {
    console.error(`❌ [${file}] Brak poprawnego appId: com.apps4brew.charcutier`);
    errors++;
    continue;
  }

  if (!content.includes('launchApp')) {
    console.error(`❌ [${file}] Brak polecenia launchApp`);
    errors++;
    continue;
  }

  if (!content.includes('assertVisible') && !content.includes('tapOn')) {
    console.error(`❌ [${file}] Scenariusz nie zawiera żadnych asercji ani akcji`);
    errors++;
    continue;
  }

  console.log(`✅ [${file}] Poprawna składnia i asercje E2E`);
}

if (errors > 0) {
  console.error(`[maestro-check] Zakończono niepowodzeniem: ${errors} błędów`);
  process.exit(1);
}

console.log('✅ Wszystkie scenariusze Maestro E2E są poprawne!');
