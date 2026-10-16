/**
 * CHARCUTIER — Recipe Share Protocol Unit Tests
 * Apps4Brew Studio
 */

import {
  encodeRecipe,
  decodeRecipe,
  generateShareUrl,
  parseShareUrl,
  validateRecipeSafety,
  ShareableRecipe,
} from '../../src/core/recipe-share';

describe('recipe-share: Safe Export & Import Protocol', () => {
  const sampleRecipe: ShareableRecipe = {
    version: 1,
    name: 'Szynka Domowa Staropolska',
    meatType: 'pork',
    category: 'cured_smoked',
    curingMethod: 'wet',
    saltGramsPerKg: 22,
    peklosolRatio: 1.0,
    waterRatioPercent: 40,
    targetCoreTemp: 68,
    spices: [
      { name: 'Czosnek', gramsPerKg: 3 },
      { name: 'Liść laurowy', gramsPerKg: 0.5 },
    ],
    author: 'Mistrz Masarski',
  };

  test('encodes and decodes recipe faithfully preserving all fields', () => {
    const encoded = encodeRecipe(sampleRecipe);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decodeRecipe(encoded);
    expect(decoded.success).toBe(true);
    expect(decoded.recipe).toEqual(sampleRecipe);
  });

  test('generates valid deep link and parses recipe from it', () => {
    const url = generateShareUrl(sampleRecipe);
    expect(url.startsWith('charcutier://recipe?data=')).toBe(true);

    const parsed = parseShareUrl(url);
    expect(parsed.success).toBe(true);
    expect(parsed.recipe?.name).toBe('Szynka Domowa Staropolska');
    expect(parsed.recipe?.saltGramsPerKg).toBe(22);
  });

  test('parses web URL format with /r/ path', () => {
    const encoded = encodeRecipe(sampleRecipe);
    const webUrl = `https://charcutier.app/r/${encoded}`;

    const parsed = parseShareUrl(webUrl);
    expect(parsed.success).toBe(true);
    expect(parsed.recipe?.name).toBe(sampleRecipe.name);
  });

  test('handles corrupted or invalid base64 data gracefully', () => {
    const corrupted = decodeRecipe('!!!INVALID_BASE64_STRING!!!');
    expect(corrupted.success).toBe(false);
    expect(corrupted.recipe).toBeUndefined();
  });

  test('validates safe recipe and calculates expected PPM', () => {
    const safety = validateRecipeSafety(sampleRecipe);
    expect(safety.safe).toBe(true);
    expect(safety.errors.length).toBe(0);
    // 22g peklosol * 0.006 * 1000 = 132 PPM
    expect(safety.calculatedPpm).toBe(132);
  });

  test('detects toxic nitrite overdoses and reports critical errors', () => {
    const toxicRecipe: ShareableRecipe = {
      ...sampleRecipe,
      saltGramsPerKg: 50,
      peklosolRatio: 1.0,
      peklosolConcentration: 0.0625, // Cure #1 dose mistakenly set to 50g!
    };

    const safety = validateRecipeSafety(toxicRecipe);
    expect(safety.safe).toBe(false);
    expect(safety.errors.some((e) => e.includes('KRYTYCZNE'))).toBe(true);
  });

  test('parseShareUrl returns failure on invalid URLs and schemes', () => {
    expect(parseShareUrl('').success).toBe(false);
    expect(parseShareUrl('https://google.com').success).toBe(false);
  });

  test('detects invalid salt doses and missing recipe name', () => {
    const invalidRecipe: Partial<ShareableRecipe> = {
      name: '',
      saltGramsPerKg: -5,
    };
    const safety = validateRecipeSafety(invalidRecipe);
    expect(safety.safe).toBe(false);
    expect(safety.errors).toContain('Nazwa przepisu jest wymagana');
    expect(safety.errors).toContain('Dawka soli musi być większa niż 0 g/kg');
  });
});
