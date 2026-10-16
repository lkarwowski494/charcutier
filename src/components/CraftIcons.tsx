/**
 * CHARCUTIER — Artisanal Craft Vector Icons
 * Apps4Craft Studio Standard
 *
 * Minimalist Swiss-style vector icons (2.0 pt stroke, ceramic basalt & smoked amber).
 * Zero raster images, zero emojis in navigation.
 */

import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

interface IconProps {
  color?: any;
  size?: number;
}

/** Warsztat / Butcher Knife & Cleaver Craft Icon */
export function CraftIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Cleaver blade */}
      <Path
        d="M3 4H16C17.1046 4 18 4.89543 18 6V13C18 14.1046 17.1046 15 16 15H8L3 10V4Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cleaver hole */}
      <Circle cx="14" cy="7" r="1.5" fill={color} />
      {/* Cleaver handle */}
      <Path
        d="M8 15L4 21"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Dojrzewalnia / Curing Ham & Aging Chamber Icon */
export function CellarIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Prosciutto / Ham contour */}
      <Path
        d="M7 19C4.5 17 3.5 13 5 9.5C6.5 6 10 4 14 5C17.5 6 19.5 9 20 12.5C20.5 16 18.5 19 15 20C11.5 21 9 20.5 7 19Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ham bone stem */}
      <Path
        d="M17 5L20 2"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Marbling / cure curve */}
      <Path
        d="M9 11C11 10.5 13 12 15 11.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Spiżarnia / Salt & Spice Jar Icon */
export function PantryIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Jar lid */}
      <Rect
        x="7"
        y="3"
        width="10"
        height="3"
        rx="1"
        stroke={color}
        strokeWidth="2"
      />
      {/* Jar body */}
      <Path
        d="M5 8C5 6.89543 5.89543 6 7 6H17C18.1046 6 19 6.89543 19 8V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Salt label / level */}
      <Line
        x1="8"
        y1="13"
        x2="16"
        y2="13"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
    </Svg>
  );
}

/** Akademia / Craft Atlas Book Icon */
export function AtlasIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Open book spine & pages */}
      <Path
        d="M12 6V20M12 6C10 4.5 6.5 4.5 3 6V19C6.5 17.5 10 17.5 12 19M12 6C14 4.5 17.5 4.5 21 6V19C17.5 17.5 14 17.5 12 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Atelier / Settings Gear & Tuning Icon */
export function AtelierIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Center circle */}
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
      {/* Cog teeth contour */}
      <Path
        d="M19.4 15A1.65 1.65 0 0019 16.7L19.2 17.9C19.3 18.5 18.8 19.1 18.2 19.1L17 19C16.4 19 15.8 19.4 15.6 20L15.2 21.1C15 21.7 14.4 22 13.8 22H10.2C9.6 22 9 21.6 8.8 21.1L8.4 20C8.2 19.4 7.6 19 7 19L5.8 19.1C5.2 19.1 4.7 18.5 4.8 17.9L5 16.7C5 16.1 4.7 15.5 4.1 15.3L3.1 14.9C2.5 14.7 2.1 14.1 2.1 13.5V10.5C2.1 9.9 2.5 9.3 3.1 9.1L4.1 8.7C4.7 8.5 5 7.9 5 7.3L4.8 6.1C4.7 5.5 5.2 4.9 5.8 4.9L7 5C7.6 5 8.2 4.6 8.4 4L8.8 2.9C9 2.3 9.6 2 10.2 2H13.8C14.4 2 15 2.4 15.2 2.9L15.6 4C15.8 4.6 16.4 5 17 5L18.2 4.9C18.8 4.9 19.3 5.5 19.2 6.1L19 7.3C19 7.9 19.3 8.5 19.9 8.7L20.9 9.1C21.5 9.3 21.9 9.9 21.9 10.5V13.5C21.9 14.1 21.5 14.7 20.9 14.9L19.9 15.3"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
