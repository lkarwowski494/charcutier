/**
 * CHARCUTIER — Moduł Bezpiecznego Dzielenia się Przepisami (Recipe Share Protocol)
 * Umożliwia kompresję, eksport i import receptur wędliniarskich przez URL / QR kod
 * z automatyczną walidacją bezpieczeństwa biologicznego (PPM Guard, proporcje peklosoli).
 */

export interface ShareableSpice {
  name: string;
  gramsPerKg: number;
}

export interface ShareableRecipe {
  version: 1;
  id?: string;
  name: string;
  meatType: string;
  category: 'cured_smoked' | 'dry_cured' | 'steamed' | 'raw_fermented';
  curingMethod: 'dry' | 'wet' | 'equilibrium';
  saltGramsPerKg: number;
  peklosolRatio: number; // 0.0 do 1.0 (0% do 100% udziału peklosoli)
  peklosolConcentration?: number; // domyślnie 0.006 (0.6% azotynu sodu)
  waterRatioPercent?: number; // % masy mięsa (dla solanek)
  targetLossPercent?: number; // np. 35% dla salami/lonzy
  targetCoreTemp?: number; // np. 68°C dla parzenia
  smokingTemp?: number; // np. 55°C
  spices: ShareableSpice[];
  description?: string;
  author?: string;
  createdAt?: string;
}

export interface RecipeValidationResult {
  safe: boolean;
  warnings: string[];
  errors: string[];
  calculatedPpm: number;
}

/**
 * Weryfikuje biologiczne bezpieczeństwo udostępnianego przepisu.
 */
export function validateRecipeSafety(recipe: Partial<ShareableRecipe>): RecipeValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!recipe.name || recipe.name.trim().length === 0) {
    errors.push('Nazwa przepisu jest wymagana');
  }

  const saltGrams = recipe.saltGramsPerKg ?? 0;
  if (saltGrams <= 0) {
    errors.push('Dawka soli musi być większa niż 0 g/kg');
  } else if (saltGrams < 15) {
    warnings.push('Bardzo niska zawartość soli (<15 g/kg). Ryzyko namnażania patogenów.');
  } else if (saltGrams > 45) {
    warnings.push('Bardzo wysoka zawartość soli (>45 g/kg). Wyrób może być niezjadliwy.');
  }

  const peklosolRatio = recipe.peklosolRatio ?? 0;
  if (peklosolRatio < 0 || peklosolRatio > 1) {
    errors.push('Proporcja peklosoli musi mieścić się w przedziale 0.0 - 1.0');
  }

  const concentration = recipe.peklosolConcentration ?? 0.006;
  const peklosolGrams = saltGrams * peklosolRatio;
  const calculatedPpm = Math.round(peklosolGrams * concentration * 1000);

  if (recipe.category === 'dry_cured' && calculatedPpm < 80 && peklosolRatio > 0) {
    warnings.push('PPM azotynu poniżej 80 PPM w wyrobie surowym/dojrzewającym może nie powstrzymać Clostridium botulinum.');
  }

  if (calculatedPpm > 175) {
    warnings.push(`Uwaga: Stężenie azotynu wynosi ${calculatedPpm} PPM (standard UE: 150 PPM).`);
  }

  if (calculatedPpm > 250) {
    errors.push(`KRYTYCZNE: Stężenie azotynu wynosi ${calculatedPpm} PPM, przekracza limit toksyczny (200 PPM)!`);
  }

  if (recipe.targetCoreTemp && (recipe.targetCoreTemp < 60 || recipe.targetCoreTemp > 90)) {
    warnings.push('Zalecana docelowa temperatura wewnętrzna parzenia powinna mieścić się w przedziale 65°C - 80°C.');
  }

  return {
    safe: errors.length === 0,
    warnings,
    errors,
    calculatedPpm,
  };
}

/**
 * Koduje przepis do bezpiecznego, zwartego ciągu base64 URL-safe.
 */
export function encodeRecipe(recipe: ShareableRecipe): string {
  const jsonStr = JSON.stringify(recipe);
  if (typeof btoa !== 'undefined') {
    return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
  }
  // Node.js fallback
  return encodeURIComponent(Buffer.from(jsonStr, 'utf-8').toString('base64'));
}

/**
 * Dekoduje i weryfikuje ciąg base64 z przepisem.
 */
export function decodeRecipe(encoded: string): { success: boolean; recipe?: ShareableRecipe; error?: string } {
  try {
    const raw = decodeURIComponent(encoded);
    let jsonStr: string;
    if (typeof atob !== 'undefined') {
      jsonStr = decodeURIComponent(escape(atob(raw)));
    } else {
      jsonStr = Buffer.from(raw, 'base64').toString('utf-8');
    }

    const parsed = JSON.parse(jsonStr) as ShareableRecipe;

    if (!parsed || parsed.version !== 1 || !parsed.name || typeof parsed.saltGramsPerKg !== 'number') {
      return { success: false, error: 'Nieprawidłowa struktura lub nieobsługiwana wersja przepisu.' };
    }

    return { success: true, recipe: parsed };
  } catch (e) {
    return { success: false, error: 'Błąd dekodowania przepisu: nieprawidłowy format danych.' };
  }
}

/**
 * Generuje link uniwersalny / deep-link do importu przepisu.
 */
export function generateShareUrl(recipe: ShareableRecipe): string {
  const encoded = encodeRecipe(recipe);
  return `charcutier://recipe?data=${encoded}`;
}

/**
 * Parsuje link głęboki lub URL WWW i wyodrębnia przepis.
 */
export function parseShareUrl(url: string): { success: boolean; recipe?: ShareableRecipe; error?: string } {
  try {
    let dataParam: string | null = null;
    if (url.includes('?data=')) {
      dataParam = url.split('?data=')[1];
    } else if (url.includes('/r/')) {
      dataParam = url.split('/r/')[1];
    }

    if (!dataParam) {
      return { success: false, error: 'URL nie zawiera parametru z danymi przepisu.' };
    }

    // Usunięcie ewentualnych kotwic lub kolejnych parametrów
    if (dataParam.includes('&')) {
      dataParam = dataParam.split('&')[0];
    }

    return decodeRecipe(dataParam);
  } catch (err) {
    return { success: false, error: 'Nie udało się przetworzyć podanego adresu URL.' };
  }
}
