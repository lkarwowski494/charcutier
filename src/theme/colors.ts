/**
 * CHARCUTIER — Basalt & Smoked Cured Palette
 * Studio: Apps4Craft Studio
 * Powered by @apps4craft/ui unified design system
 */

import { getCraftTheme, sharedCraftTokens } from '@apps4craft/ui';

// Wybór motywu dla CHARCUTIER / Masaż: wędzona wiśnia peklosoli #A43E38
export const craftTheme = getCraftTheme('masaz');
export { sharedCraftTokens };

export const colors = {
  // Ceramic Basalt Backgrounds (Apps4Craft Standard)
  background: sharedCraftTokens.colors.bgBasalt,        // #121214
  surface: sharedCraftTokens.colors.bgCard,              // #1C1C1F
  surfaceElevated: sharedCraftTokens.colors.bgCardSecondary, // #242428
  surfaceLight: sharedCraftTokens.colors.border,         // #2E2E34
  surfaceCream: '#FEF3C7',

  // Unique Metallic Accent: Wędzona wiśnia peklosoli (Apps4Craft Masaż theme)
  accent: craftTheme.accent,                             // #A43E38
  accentLight: craftTheme.accentLight,                   // #E06D53
  accentMuted: craftTheme.accentMuted,                   // rgba(164, 62, 56, 0.15)
  secondaryAccent: craftTheme.secondaryAccent,           // #5C241E

  copperPrimary: craftTheme.accent,                      // #A43E38
  amberPrimary: craftTheme.accent,                       // #A43E38 (Mapped to brand accent)
  amberDark: craftTheme.secondaryAccent,                 // #5C241E
  amberLight: craftTheme.accentLight,                    // #E06D53

  // Text & Content (Swiss Typography readability)
  textPrimary: sharedCraftTokens.colors.textPrimary,     // #F4EFEA
  textSecondary: sharedCraftTokens.colors.textSecondary, // #A09C96
  textMuted: sharedCraftTokens.colors.textMuted,         // #686561
  textInverse: '#121214',                               // Dark text on badges

  // Biological Safety Indicators (P0 USDA/EU)
  safe: sharedCraftTokens.colors.statusSuccess,          // #4E9F3D
  warning: '#F59E0B',                                    // Amber 500
  danger: sharedCraftTokens.colors.danger,               // #D9534F
  dangerDark: '#450A0A',                                 // Dark Red Alert Background

  // Workshop Ergonomics
  minTouchSize: sharedCraftTokens.buttonHeightMin,       // 52 pt
  hitSlopStandard: sharedCraftTokens.hitSlopStandard,
};
