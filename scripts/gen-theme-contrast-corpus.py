#!/usr/bin/env python3
"""
gen-theme-contrast-corpus.py
Independent Python reference implementation for calculating WCAG 2.1 relative
luminance and contrast ratios across all theme color pairs (BR-TEST-013, NFR-A11Y-001).
Apps4Brew Studio — Deterministic Verification Corpus.
"""

import json
import os
import re

def hex_to_rgb(hex_code):
    hex_code = hex_code.lstrip("#")
    if len(hex_code) == 3:
        hex_code = "".join([c * 2 for c in hex_code])
    return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))

def srgb_channel_to_linear(c_byte):
    c = c_byte / 255.0
    if c <= 0.04045:
        return c / 12.92
    else:
        return ((c + 0.055) / 1.055) ** 2.4

def relative_luminance(rgb):
    r, g, b = rgb
    rl = srgb_channel_to_linear(r)
    gl = srgb_channel_to_linear(g)
    bl = srgb_channel_to_linear(b)
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl

def contrast_ratio(rgb1, rgb2):
    l1 = relative_luminance(rgb1)
    l2 = relative_luminance(rgb2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    cr = (lighter + 0.05) / (darker + 0.05)
    return round(cr, 2)

def extract_palette_from_colors_ts(file_path):
    palette = {}
    if not os.path.exists(file_path):
        return palette

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Match key: '#RRGGBB' or // #RRGGBB comments
    patterns = [
        r'(\w+):\s*[\'"](#[0-9a-fA-F]{6})[\'"]',
        r'(\w+):\s*[^,\n]+\s*//\s*(#[0-9a-fA-F]{6})'
    ]
    for pattern in patterns:
        for match in re.finditer(pattern, content):
            key, hex_val = match.groups()
            palette[key] = hex_val.upper()

    return palette

def main():
    theme_file = os.path.join(os.path.dirname(__file__), "..", "src", "theme", "colors.ts")
    palette = extract_palette_from_colors_ts(theme_file)

    # Defaults if not parsed completely
    defaults = {
        "background": "#121214",
        "surface": "#1C1C1F",
        "surfaceElevated": "#242428",
        "surfaceLight": "#2E2E34",
        "surfaceCream": "#FEF3C7",
        "accent": "#A43E38",
        "accentLight": "#E06D53",
        "secondaryAccent": "#5C241E",
        "textPrimary": "#F4EFEA",
        "textSecondary": "#A09C96",
        "textMuted": "#686561",
        "textInverse": "#121214",
        "safe": "#4E9F3D",
        "warning": "#F59E0B",
        "danger": "#D9534F",
        "dangerDark": "#450A0A"
    }
    palette = {**defaults, **palette}

    pairs_to_evaluate = [
        # Text on dark surfaces (Standard UI)
        {"fg": "textPrimary", "bg": "background", "role": "normal_text", "min_target": 4.5},
        {"fg": "textPrimary", "bg": "surface", "role": "normal_text", "min_target": 4.5},
        {"fg": "textPrimary", "bg": "surfaceElevated", "role": "normal_text", "min_target": 4.5},
        {"fg": "textSecondary", "bg": "background", "role": "large_or_secondary_text", "min_target": 4.5},
        {"fg": "textSecondary", "bg": "surface", "role": "large_or_secondary_text", "min_target": 4.5},
        {"fg": "textMuted", "bg": "background", "role": "disabled_or_tertiary", "min_target": 3.0},
        
        # Inverted text on badges and highlights
        {"fg": "textInverse", "bg": "surfaceCream", "role": "badge_text", "min_target": 4.5},
        {"fg": "textInverse", "bg": "warning", "role": "badge_text", "min_target": 4.5},
        {"fg": "textInverse", "bg": "safe", "role": "badge_text", "min_target": 4.5},

        # Alert banners and critical warnings
        {"fg": "textPrimary", "bg": "dangerDark", "role": "critical_alert_text", "min_target": 4.5},
        {"fg": "danger", "bg": "background", "role": "danger_indicator", "min_target": 3.0},
        {"fg": "safe", "bg": "background", "role": "safe_indicator", "min_target": 3.0},
        {"fg": "warning", "bg": "background", "role": "warning_indicator", "min_target": 3.0},
        {"fg": "accentLight", "bg": "background", "role": "brand_accent_action", "min_target": 3.0},
        {"fg": "accentLight", "bg": "surface", "role": "brand_accent_action", "min_target": 3.0},
        {"fg": "textPrimary", "bg": "accent", "role": "primary_button_text", "min_target": 4.0}
    ]

    corpus = {
        "generator": "scripts/gen-theme-contrast-corpus.py",
        "description": "WCAG 2.1 relative luminance and contrast ratio oracle vectors",
        "palette": palette,
        "results": []
    }

    for item in pairs_to_evaluate:
        fg_hex = palette[item["fg"]]
        bg_hex = palette[item["bg"]]
        rgb_fg = hex_to_rgb(fg_hex)
        rgb_bg = hex_to_rgb(bg_hex)
        ratio = contrast_ratio(rgb_fg, rgb_bg)
        lum_fg = round(relative_luminance(rgb_fg), 4)
        lum_bg = round(relative_luminance(rgb_bg), 4)

        passes = ratio >= item["min_target"]
        corpus["results"].append({
            "foreground_token": item["fg"],
            "foreground_hex": fg_hex,
            "foreground_luminance": lum_fg,
            "background_token": item["bg"],
            "background_hex": bg_hex,
            "background_luminance": lum_bg,
            "contrast_ratio": ratio,
            "role": item["role"],
            "min_target": item["min_target"],
            "wcag_aa_compliant": passes
        })

    out_dir = os.path.join(os.path.dirname(__file__), "..", "tests", "fixtures")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "theme-contrast-corpus.json")

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(corpus, f, indent=2, ensure_ascii=False)

    print(f"[OK] Generated {len(corpus['results'])} WCAG contrast verification vectors -> {out_file}")

if __name__ == "__main__":
    main()
