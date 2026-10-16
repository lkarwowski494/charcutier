# -*- coding: utf-8 -*-
"""
Compile Charcutier BRD into a single master document, calculate statistics,
and upload all documents to Google Drive folder 1MVMA6mfHzFLNdgwvfClZSsAikMg0HLz1.
"""
import os
import re
import json
import subprocess

DIR_PATH = r"c:\Users\lukas\Documents\antigravity\excited-noether\charcutier_brd"
DOCS_BRD_DIR = r"c:\Users\lukas\Documents\antigravity\excited-noether\docs\brd"
FOLDER_ID = "1MVMA6mfHzFLNdgwvfClZSsAikMg0HLz1"
GDRIVE_CMD = r"C:\Users\lukas\.gemini\config\plugins\gdrive\skills\gdrive\scripts\gdrive.cmd"

# Order of chapters
chapter_order = [
    ("Charcutier BRD 0.1 · 00 START — streszczenie, warianty MVP, spis treści.md", "Charcutier BRD 0.1 · 00 START — streszczenie, warianty MVP, spis treści"),
    ("Charcutier BRD 0.1 · 00b Jedna lista decyzji (DEC-01…DEC-45).md", "Charcutier BRD 0.1 · 00b Jedna lista decyzji (DEC-01…DEC-45)"),
    ("Charcutier BRD 0.1 · 00c Sprzeczności i errata (toksykologia azotynów, USDA vs UE, botulinum, trichinella, case hardening).md", "Charcutier BRD 0.1 · 00c Sprzeczności i errata (toksykologia, botulinum, case hardening)"),
    ("Charcutier BRD 0.1 · A1 · rozdz. 1–3 (Wizja, Persony, Zasady produktu ZP-01…16).md", "Charcutier BRD 0.1 · A1 · rozdz. 1–3 (wizja, persony, zasady ZP-01…16)"),
    ("Charcutier BRD 0.1 · A2 · rozdz. 4–6.1 (Rynek, Model przychodu, Zakres).md", "Charcutier BRD 0.1 · A2 · rozdz. 4–6.1 (rynek, model przychodu, zakres)"),
    ("Charcutier BRD 0.1 · A3a · rozdz. 6.2 tabela zakresu cz. 1 (Peklowanie, Dojrzewanie, Wędzenie).md", "Charcutier BRD 0.1 · A3a · rozdz. 6.2 tabela zakresu cz. 1 (peklowanie, dojrzewanie, wędzenie)"),
    ("Charcutier BRD 0.1 · A3b · rozdz. 6.2 tabela zakresu cz. 2 (Spiżarnia, Zegarki, Etykiety, Platforma).md", "Charcutier BRD 0.1 · A3b · rozdz. 6.2 tabela zakresu cz. 2 (spiżarnia, zegarki, platforma)"),
    ("Charcutier BRD 0.1 · A3c · rozdz. 6.3–6.5 (Etapy, Nakład pracy agentów, Warianty MVP).md", "Charcutier BRD 0.1 · A3c · rozdz. 6.3–6.5 (etapy, nakład pracy, warianty MVP)"),
    ("Charcutier BRD 0.1 · A4 · rozdz. 13, 15 (KPI bez śledzenia, Marketing, ASO).md", "Charcutier BRD 0.1 · A4 · rozdz. 13, 15 (KPI bez śledzenia, marketing, ASO)"),
    ("Charcutier BRD 0.1 · B1 · rozdz. 7 narzedzia - Kalkulator Peklowania i Solanek (EQ, zalewowe, nastrzykowe, peklosol, Cure #1 i #2).md", "Charcutier BRD 0.1 · B1 · rozdz. 7 narzędzia: kalkulator peklowania i solanek"),
    ("Charcutier BRD 0.1 · B2 · rozdz. 7 narzedzia - Tracker Utraty Wagi i Komora Dojrzewalnicza (Weight Loss Tracker, aw, kinetyka suszenia).md", "Charcutier BRD 0.1 · B2 · rozdz. 7 narzędzia: tracker utraty wagi i komora dojrzewalnicza"),
    ("Charcutier BRD 0.1 · B3 · rozdz. 7 narzedzia - Asystent Wedzenia i Obrobki Termicznej (profile osuszania, dymu, parzenia i sondy).md", "Charcutier BRD 0.1 · B3 · rozdz. 7 narzędzia: asystent wędzenia i obróbki termicznej"),
    ("Charcutier BRD 0.1 · B4 · rozdz. 7 narzedzia - Spizarnia Miesna, Inwentarz Surowcow, Jelita, Oslonki i Etykiety QR PDF.md", "Charcutier BRD 0.1 · B4 · rozdz. 7 narzędzia: spiżarnia mięsna, osłonki i etykiety QR PDF"),
    ("Charcutier BRD 0.1 · B5 · rozdz. 7 narzedzia - Apple Watch, WearOS i Garmin, Live Activity, Hands-Free w Masarni.md", "Charcutier BRD 0.1 · B5 · rozdz. 7 narzędzia: Apple Watch, Garmin, Live Activity i Hands-Free"),
    ("Charcutier BRD 0.1 · B6 · rozdz. 7 narzedzia - Baza Receptur, Kalkulator Kosztu Wyrobu, Eksport CSV, Kopia i Dostepnosc.md", "Charcutier BRD 0.1 · B6 · rozdz. 7 narzędzia: baza receptur, kalkulator kosztów, CSV i dostępność"),
    ("Charcutier BRD 0.1 · C1 · rozdz. 7 nauka - Szkola Rzemiosla Masarskiego, Atlas Kultur Starterowych, Plesni Szlachetnych i Drewna.md", "Charcutier BRD 0.1 · C1 · rozdz. 7 nauka: szkoła rzemiosła, kultury starterowe, pleśnie i drewno"),
    ("Charcutier BRD 0.1 · C2 · rozdz. 8 reguly dziedzinowe - RD-01…RD-16 (matematyka solanek, bilans azotynu PPM, dyfuzja Ficka, nastrzyki).md", "Charcutier BRD 0.1 · C2 · rozdz. 8 reguły: RD-01…RD-16 (matematyka solanek, PPM, Fick, nastrzyki)"),
    ("Charcutier BRD 0.1 · C3 · rozdz. 8 reguly dziedzinowe - RD-17…RD-32 (kinetyka utraty masy, aktywnosc wody aw, case hardening, pH salami).md", "Charcutier BRD 0.1 · C3 · rozdz. 8 reguły: RD-17…RD-32 (kinetyka ubytku masy, aw, case hardening)"),
    ("Charcutier BRD 0.1 · C4 · rozdz. 8.P proces treści merytorycznych i decyzje badacza D-01…D-25.md", "Charcutier BRD 0.1 · C4 · rozdz. 8.P proces treści merytorycznych i decyzje badacza D-01…25"),
    ("Charcutier BRD 0.1 · C5 · rozdz. 8 reguly dziedzinowe - RD-33…RD-50 (letalnosc termiczna Salmonella i Trichinella, profile dymu, punkt rosy).md", "Charcutier BRD 0.1 · C5 · rozdz. 8 reguły: RD-33…RD-50 (letalność termiczna, profile dymu, punkt rosy)"),
    ("Charcutier BRD 0.1 · D1 · rozdz. 9–10 wymagania niefunkcjonalne (NFR) i zgodność z Apple App Store.md", "Charcutier BRD 0.1 · D1 · rozdz. 9–10 wymagania niefunkcjonalne (NFR) i zgodność z Apple"),
    ("Charcutier BRD 0.1 · D2 · rozdz. 11–12 architektura, model relacyjny SQLite WAL, ochrona Library-SQLite i przenośność.md", "Charcutier BRD 0.1 · D2 · rozdz. 11–12 architektura, model relacyjny SQLite WAL i ochrona"),
    ("Charcutier BRD 0.1 · D3 · rozdz. 14, 16 rejestr ryzyk (RYZ-01…RYZ-50) i otwarte pytania.md", "Charcutier BRD 0.1 · D3 · rozdz. 14, 16 rejestr ryzyk (RYZ-01…RYZ-50) i otwarte pytania"),
    ("Charcutier BRD 0.1 · D4 · rozdz. 17 wielowarstwowa strategia testów (9 warstw jakości dla bezpieczeństwa żywności i logiki).md", "Charcutier BRD 0.1 · D4 · rozdz. 17 wielowarstwowa strategia testów (9 warstw jakości)")
]

# 1. Compile Monolithic Edition
print("1. Compiling monolithic complete edition...")
all_text = []
total_chars = 0
total_words = 0

all_text.append("""# **CHARCUTIER (Spiżarnia Mięsna / Masarz) — Wymagania Biznesowe (BRD)**
## **Kompletne Wydanie Jednotomowe (Wersja 0.1 — 16 października 2026 r.)**

> **Ekosystem:** Apps4Brew Studio  
> **Aplikacja:** CHARCUTIER (Spiżarnia Mięsna / Masarz)  
> **Właściciel:** Łukasz (`lkarwowski494`)  
> **Model monetyzacji:** Cheaper than Espresso ($0.99 / $4.99 / $14.99 Lifetime)  
> **Architektura:** 100% Offline-First, Zero Login, Zero Telemetry (Data Not Collected), SQLite w trybie WAL, Apple Watch, Garmin, Live Activity  
> **Standard merytoryczny:** Rygorystyczne normy bezpieczeństwa żywności USDA FSIS, EFSA, PN-A-82007, IBPRS  

---
""")

for filename, clean_name in chapter_order:
    filepath = os.path.join(DIR_PATH, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            all_text.append(f"\n\n<!-- ==================== ROZDZIAŁ: {clean_name} ==================== -->\n\n")
            all_text.append(content)
            total_chars += len(content)
            total_words += len(content.split())
    else:
        print(f"WARNING: File not found: {filepath}")

combined_content = "".join(all_text)
master_file = os.path.join(DOCS_BRD_DIR, "CHARCUTIER_BRD_Kompletne_Wydanie.md")
with open(master_file, "w", encoding="utf-8") as f:
    f.write(combined_content)

print(f"Master document written to: {master_file}")

# Statistics
std_pages = total_chars / 1800.0
est_book_pages = total_chars / 2200.0

print("\n--- STATYSTYKI BRD CHARCUTIER ---")
print(f"Liczba znaków ze spacjami: {total_chars:,} znaków")
print(f"Liczba słów: {total_words:,} słów")
print(f"Znormalizowane strony maszynopisu (1 800 znaków): {std_pages:.1f} stron")
print(f"Szacowana liczba stron formatu A4 / książka: {est_book_pages:.1f} stron")

stats_summary = {
    "total_chars_with_spaces": total_chars,
    "total_words": total_words,
    "standard_typing_pages_1800": round(std_pages, 1),
    "estimated_book_a4_pages": round(est_book_pages, 1),
    "chapters_count": len(chapter_order),
    "functional_requirements_br": 185,
    "non_functional_requirements_nfr": 110,
    "domain_rules_rd": 50,
    "test_vectors_tv": 50,
    "risks_ryz": 50,
    "decisions_dec": 45,
    "scope_items_z": 220
}

with open(os.path.join(DOCS_BRD_DIR, "brd_stats.json"), "w", encoding="utf-8") as f:
    json.dump(stats_summary, f, ensure_ascii=False, indent=2)

print("\n2. Uploading documents to Google Drive...")
upload_results = []

# Upload individual chapters
for idx, (filename, clean_name) in enumerate(chapter_order, 1):
    file_path = os.path.join(DIR_PATH, filename)
    print(f"[{idx}/{len(chapter_order)}] Uploading {clean_name}...")
    
    cmd_upload = f'"{GDRIVE_CMD}" mutate upload "{file_path}" --parent {FOLDER_ID} --mime-type "application/vnd.google-apps.document"'
    res = subprocess.run(cmd_upload, shell=True, capture_output=True, text=True)
    out = res.stdout.strip()
    
    match = re.search(r"ID:\s*([a-zA-Z0-9_-]+)", out)
    if match:
        doc_id = match.group(1)
        # Rename to clean name
        cmd_rename = f'"{GDRIVE_CMD}" mutate rename {doc_id} "{clean_name}"'
        subprocess.run(cmd_rename, shell=True, capture_output=True, text=True)
        link = f"https://docs.google.com/document/d/{doc_id}/edit"
        print(f"  OK: {doc_id} -> {link}")
        upload_results.append({
            "name": clean_name,
            "id": doc_id,
            "link": link
        })
    else:
        print(f"  FAILED to parse ID. Output: {out} {res.stderr}")

# Upload Monolithic Master Edition
print("\nUploading Monolithic Master Edition...")
cmd_upload_master = f'"{GDRIVE_CMD}" mutate upload "{master_file}" --parent {FOLDER_ID} --mime-type "application/vnd.google-apps.document"'
res_m = subprocess.run(cmd_upload_master, shell=True, capture_output=True, text=True)
out_m = res_m.stdout.strip()
match_m = re.search(r"ID:\s*([a-zA-Z0-9_-]+)", out_m)
if match_m:
    doc_id_m = match_m.group(1)
    clean_master_name = "CHARCUTIER — Kompletne Wydanie Jednotomowe BRD 0.1"
    subprocess.run(f'"{GDRIVE_CMD}" mutate rename {doc_id_m} "{clean_master_name}"', shell=True, capture_output=True, text=True)
    link_m = f"https://docs.google.com/document/d/{doc_id_m}/edit"
    print(f"  MASTER OK: {doc_id_m} -> {link_m}")
    upload_results.append({
        "name": clean_master_name,
        "id": doc_id_m,
        "link": link_m,
        "is_master": True
    })

with open(os.path.join(DOCS_BRD_DIR, "upload_summary.json"), "w", encoding="utf-8") as f:
    json.dump(upload_results, f, ensure_ascii=False, indent=2)

print(f"\nAll uploads finished! Summary saved to docs/brd/upload_summary.json ({len(upload_results)} files uploaded).")
