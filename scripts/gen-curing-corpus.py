#!/usr/bin/env python3
"""
gen-curing-corpus.py
Independent Python reference implementation generating meat curing,
nitrite PPM (USDA/EFSA), brine density, and weight-loss truth tables.
Apps4Brew Studio — Deterministic Verification Corpus (BR-TEST-011..014).
"""

import json
import os
import math

def calculate_ppm(cure_salt_g, nano2_ratio, meat_g, water_g=0):
    total_mass = meat_g + water_g
    if total_mass <= 0:
        return 0
    return math.floor((cure_salt_g * nano2_ratio * 1_000_000) / total_mass)

def calculate_brine_baume(salt_g, water_ml):
    if water_ml <= 0 or salt_g <= 0:
        return 0.0
    total_g = water_ml + salt_g
    # Specific gravity of salt brine: 1 + (salt_g / total_g) * 0.7
    sg = 1.0 + (salt_g / total_g) * 0.707
    # Baume formula for liquids heavier than water: 145 - (145 / sg)
    baume = 145.0 - (145.0 / sg)
    return round(baume, 1)

def calculate_weight_loss(initial_g, current_g, target_pct=35.0):
    if initial_g <= 0:
        return {"loss_pct": 0.0, "progress_pct": 0.0, "reached": False}
    loss_g = max(0.0, initial_g - current_g)
    loss_pct = round((loss_g / initial_g) * 100.0, 1)
    progress_pct = min(100.0, round((loss_pct / target_pct) * 100.0, 1))
    return {
        "loss_pct": loss_pct,
        "progress_pct": progress_pct,
        "reached": loss_pct >= target_pct
    }

def main():
    corpus = {
        "generator": "scripts/gen-curing-corpus.py",
        "description": "Cross-language oracle vectors for curing physics, nitrite ppm, brine density and weight loss",
        "nitrite_ppm_vectors": [],
        "brine_density_vectors": [],
        "weight_loss_vectors": []
    }

    # Nitrite PPM test vectors
    # Peklosól PL: 0.6% NaNO2 (0.006)
    # Cure #1: 6.25% NaNO2 (0.0625)
    test_masses = [500, 1000, 1500, 2500, 5000]
    for m in test_masses:
        # 20 g/kg standard dry cure (2.0% salt)
        salt_dose = m * 0.02
        ppm_pl = calculate_ppm(salt_dose, 0.006, m, 0)
        corpus["nitrite_ppm_vectors"].append({
            "meat_g": m,
            "water_g": 0,
            "cure_salt_g": salt_dose,
            "salt_type": "peklosol_pl",
            "nano2_ratio": 0.006,
            "expected_ppm": ppm_pl
        })

        # Cure #1 target 135-150 ppm (2.5 g / kg)
        cure1_dose = round(m * 0.0025, 2)
        ppm_cure1 = calculate_ppm(cure1_dose, 0.0625, m, 0)
        corpus["nitrite_ppm_vectors"].append({
            "meat_g": m,
            "water_g": 0,
            "cure_salt_g": cure1_dose,
            "salt_type": "cure_1",
            "nano2_ratio": 0.0625,
            "expected_ppm": ppm_cure1
        })

    # Brine density vectors (10%, 12%, 15% salt solutions in 1000ml water)
    for salt in [80, 100, 120, 150, 180]:
        corpus["brine_density_vectors"].append({
            "salt_g": salt,
            "water_ml": 1000,
            "expected_baume": calculate_brine_baume(salt, 1000)
        })

    # Weight loss vectors
    for (init_g, curr_g) in [(1000, 1000), (1000, 900), (1000, 750), (1000, 650), (2000, 1300)]:
        metrics = calculate_weight_loss(init_g, curr_g, 35.0)
        corpus["weight_loss_vectors"].append({
            "initial_g": init_g,
            "current_g": curr_g,
            "target_pct": 35.0,
            "expected_loss_pct": metrics["loss_pct"],
            "expected_progress_pct": metrics["progress_pct"],
            "expected_reached": metrics["reached"]
        })

    out_dir = os.path.join(os.path.dirname(__file__), "..", "tests", "fixtures")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "curing-corpus.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(corpus, f, indent=2, ensure_ascii=False)

    print(f"[OK] Generated {len(corpus['nitrite_ppm_vectors'])} PPM vectors, {len(corpus['brine_density_vectors'])} brine vectors, {len(corpus['weight_loss_vectors'])} loss vectors -> {out_file}")

if __name__ == "__main__":
    main()
