/**
 * CHARCUTIER — 6-Axis Sensory Radar Unit Tests
 * Apps4Brew Studio
 */

import {
  DEFAULT_SENSORY_PROFILE,
  SENSORY_AXES,
  sanitizeSensoryProfile,
  calculateRadarCoordinates,
} from '../../src/core/sensory-radar';

describe('sensory-radar: 6-Axis Tasting Evaluation', () => {
  test('provides default 6-axis profile with values initialized to 3 (balanced)', () => {
    expect(DEFAULT_SENSORY_PROFILE.salinity).toBe(3);
    expect(DEFAULT_SENSORY_PROFILE.smokiness).toBe(3);
    expect(DEFAULT_SENSORY_PROFILE.acidity).toBe(3);
    expect(DEFAULT_SENSORY_PROFILE.spiciness).toBe(3);
    expect(DEFAULT_SENSORY_PROFILE.firmness).toBe(3);
    expect(DEFAULT_SENSORY_PROFILE.succulence).toBe(3);
    expect(DEFAULT_SENSORY_PROFILE.overallRating).toBe(5);
  });

  test('sanitizes and clamps raw values between 1 and 5', () => {
    const sanitized = sanitizeSensoryProfile({
      salinity: 0,
      smokiness: 10,
      acidity: 4,
      spiciness: -2,
      tastingNotes: '  Bardzo krucha szynka  ',
    });

    expect(sanitized.salinity).toBe(1);
    expect(sanitized.smokiness).toBe(5);
    expect(sanitized.acidity).toBe(4);
    expect(sanitized.spiciness).toBe(1);
    expect(sanitized.firmness).toBe(3); // default fallback
    expect(sanitized.tastingNotes).toBe('Bardzo krucha szynka');
  });

  test('calculates accurate 6-point radar coordinates for SVG rendering', () => {
    const coords = calculateRadarCoordinates(DEFAULT_SENSORY_PROFILE, 100, 100, 80);

    expect(coords.length).toBe(6);

    for (const point of coords) {
      expect(typeof point.x).toBe('number');
      expect(typeof point.y).toBe('number');
      expect(point.value).toBe(3);
      expect(point.label).toBeDefined();

      // Coordinates must lie inside the radius boundary
      const dist = Math.sqrt(Math.pow(point.x - 100, 2) + Math.pow(point.y - 100, 2));
      expect(dist).toBeLessThanOrEqual(81);
    }
  });

  test('SENSORY_AXES contains exactly 6 calibrated dimensions with labels', () => {
    expect(SENSORY_AXES.length).toBe(6);
    const keys = SENSORY_AXES.map((a) => a.key);
    expect(keys).toEqual(['salinity', 'smokiness', 'acidity', 'spiciness', 'firmness', 'succulence']);
  });
});
