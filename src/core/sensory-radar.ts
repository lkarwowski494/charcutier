/**
 * CHARCUTIER — 6-Axis Sensory Radar Model & Tasting Profile
 * Apps4Brew Studio (Adapted from Słoik Sensory Radar)
 *
 * Implements organoleptic evaluation for cured, smoked, and dry-matured meats:
 * 1. Salinity (Słoność)
 * 2. Smokiness (Dymność)
 * 3. Acidity (Kwasowość / Dojrzałość salami)
 * 4. Spiciness (Pikantność / Ziołowość)
 * 5. Firmness (Kruchość / Struktura plastra)
 * 6. Succulence (Soczystość / Tłuszczowość)
 */

export interface SensoryProfile {
  salinity: number;    // 1-5 (3 = ideal balance)
  smokiness: number;   // 1-5
  acidity: number;     // 1-5
  spiciness: number;   // 1-5
  firmness: number;    // 1-5
  succulence: number;  // 1-5
  overallRating: number; // 1-5 stars
  tastingNotes?: string;
  tastedAt: number;
}

export const SENSORY_AXES = [
  { key: 'salinity', labelKey: 'sensory.salinity', labelPl: 'Słoność' },
  { key: 'smokiness', labelKey: 'sensory.smokiness', labelPl: 'Dymność' },
  { key: 'acidity', labelKey: 'sensory.acidity', labelPl: 'Kwasowość' },
  { key: 'spiciness', labelKey: 'sensory.spiciness', labelPl: 'Pikantność' },
  { key: 'firmness', labelKey: 'sensory.firmness', labelPl: 'Kruchość' },
  { key: 'succulence', labelKey: 'sensory.succulence', labelPl: 'Soczystość' },
] as const;

export const DEFAULT_SENSORY_PROFILE: SensoryProfile = {
  salinity: 3,
  smokiness: 3,
  acidity: 3,
  spiciness: 3,
  firmness: 3,
  succulence: 3,
  overallRating: 5,
  tastedAt: Date.now(),
};

/**
 * Validates and clamps sensory scores between 1 and 5
 */
export function sanitizeSensoryProfile(raw: Partial<SensoryProfile>): SensoryProfile {
  const clamp = (val: number | undefined, def: number = 3) =>
    Math.max(1, Math.min(5, val !== undefined && !isNaN(val) ? Math.round(val) : def));

  return {
    salinity: clamp(raw.salinity),
    smokiness: clamp(raw.smokiness),
    acidity: clamp(raw.acidity),
    spiciness: clamp(raw.spiciness),
    firmness: clamp(raw.firmness),
    succulence: clamp(raw.succulence),
    overallRating: Math.max(1, Math.min(5, raw.overallRating || 5)),
    tastingNotes: raw.tastingNotes ? raw.tastingNotes.trim() : undefined,
    tastedAt: raw.tastedAt || Date.now(),
  };
}

/**
 * Converts sensory profile scores into SVG radar polygon points
 */
export function calculateRadarCoordinates(
  profile: SensoryProfile,
  centerX: number,
  centerY: number,
  radius: number
): Array<{ x: number; y: number; label: string; value: number }> {
  const keys: Array<keyof Omit<SensoryProfile, 'overallRating' | 'tastingNotes' | 'tastedAt'>> = [
    'salinity',
    'smokiness',
    'acidity',
    'spiciness',
    'firmness',
    'succulence',
  ];

  const totalAxes = keys.length;
  const angleStep = (2 * Math.PI) / totalAxes;

  return keys.map((key, i) => {
    // Start at top (-PI/2) and rotate clockwise
    const angle = i * angleStep - Math.PI / 2;
    const value = profile[key] || 3;
    // Scale 1-5 to 0.2 - 1.0 of radius
    const currentRadius = (value / 5) * radius;

    const x = centerX + currentRadius * Math.cos(angle);
    const y = centerY + currentRadius * Math.sin(angle);

    const axisMeta = SENSORY_AXES.find((a) => a.key === key);

    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      label: axisMeta ? axisMeta.labelPl : key,
      value,
    };
  });
}
