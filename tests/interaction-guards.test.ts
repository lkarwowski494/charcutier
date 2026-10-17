import fs from 'fs';
import path from 'path';

function getFilesRecursively(dir: string, ext: string = '.tsx'): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, ext));
    } else if (fullPath.endsWith(ext) || fullPath.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Studio Interaction Guards S1-S16 (NFR-INT-001..016)', () => {
  const appDir = path.resolve(__dirname, '../app');
  const appFiles = getFilesRecursively(appDir);

  it('S2: No Alert.prompt in any app file', () => {
    for (const file of appFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toMatch(/Alert\.prompt\s*\(/);
    }
  });

  it('S5: No ambiguous "Tak", "Nie", "Wróć" button labels in alert or dialog calls', () => {
    const forbiddenLabelsRegex = /text:\s*['"](Tak|Nie|Wróć|Wroc|Yes|No|Back)['"]/i;
    for (const file of appFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const match = content.match(forbiddenLabelsRegex);
      if (match) {
        throw new Error(
          `[S5 Violation] Ambiguous button label "${match[1]}" found in ${file}. Use descriptive verbs like "Usuń", "Anuluj".`
        );
      }
    }
  });

  it('S8: No generic "Błąd" / "Error" as alone alert title', () => {
    const genericErrorTitleRegex = /Alert\.alert\(\s*['"`](Błąd|Error|Uwaga)['"`]/;
    for (const file of appFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const match = content.match(genericErrorTitleRegex);
      if (match) {
        throw new Error(
          `[S8 Violation] Generic alert title "${match[1]}" in ${file}. Titles must name the specific failed action.`
        );
      }
    }
  });

  it('S8: No Alert.alert in app/_layout.tsx on startup', () => {
    const layoutFile = path.resolve(appDir, '_layout.tsx');
    if (fs.existsSync(layoutFile)) {
      const content = fs.readFileSync(layoutFile, 'utf-8');
      expect(content).not.toMatch(/Alert\.alert\s*\(/);
    }
  });

  it('S16: No low-level native modules imported directly in app/**/*.tsx views', () => {
    const forbiddenImports = [
      /from\s+['"]expo-file-system['"]/,
      /from\s+['"]expo-sqlite['"]/,
      /from\s+['"]@react-native-async-storage\/async-storage['"]/,
    ];

    for (const file of appFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const regex of forbiddenImports) {
        if (regex.test(content)) {
          throw new Error(
            `[S16 Violation] Direct low-level native import ${regex} in view ${file}. Views must use db/ or services/ adapters.`
          );
        }
      }
    }
  });
});
