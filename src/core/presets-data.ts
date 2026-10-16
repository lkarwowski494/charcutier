/**
 * CHARCUTIER — Master Butchery Recipe Presets (12 Canonical Recipes + Artisanal Specialties)
 * Apps4Brew Studio (Conforming to BR-RECP-001 & PN-A-82007)
 *
 * 12 Certified Charcuterie Masterclass Presets with complete ingredient ratios,
 * biological parameters, and step-by-step masterclass procedures.
 */

import { MeatType, CureType, CureSaltType } from '../types';

export interface MasterPreset {
  id: string;
  name: string;
  titleKey: string;
  titlePl: string;
  category: 'cured_smoked' | 'dry_cured' | 'smoked' | 'sausage' | 'specialty' | 'steamed';
  meatType: MeatType;
  cutType: string;
  curingMethod: 'dry' | 'wet' | 'equilibrium';
  cureType: CureType;
  cureSaltType: CureSaltType;
  saltGramsPerKg: number;
  saltRatioPct: number;
  peklosolRatio: number;
  sugarRatioPct: number;
  waterRatioPct?: number;
  targetLossPercent: number;
  targetLossPct: number;
  targetCoreTemp?: number;
  targetCoreTempC?: number;
  recommendedWood?: string;
  casingCaliber?: string;
  spices: Array<{ name: string; gramsPerKg: number; gPerKg?: number }>;
  summary: string;
  techniqueNotes: string;
}

export interface ScaledRecipeSpice {
  name: string;
  gramsPerKg: number;
  totalGrams: number;
}

export interface ScaledRecipeResult {
  presetId: string;
  presetName: string;
  meatWeightKg: number;
  totalSaltGrams: number;
  pureSaltGrams: number;
  cureSaltGrams: number;
  waterVolumeMl?: number;
  spices: ScaledRecipeSpice[];
}

export const MASTER_PRESETS: MasterPreset[] = [
  // 1. Szynka Tradycyjna z Kością (BR-RECP-001 #4)
  {
    id: 'szynka_tradycyjna',
    name: 'Szynka Tradycyjna z Wędzarni',
    titleKey: 'presets.szynkaTradycyjna',
    titlePl: 'Szynka Tradycyjna z Wędzarni',
    category: 'cured_smoked',
    meatType: 'pork',
    cutType: 'Szynka (myszka / orzech)',
    curingMethod: 'wet',
    cureType: 'wet_injection',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 22,
    saltRatioPct: 2.2,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.4,
    waterRatioPct: 40,
    targetLossPercent: 12,
    targetLossPct: 12,
    targetCoreTemp: 68,
    targetCoreTempC: 68,
    recommendedWood: 'alder',
    spices: [
      { name: 'Liść laurowy', gramsPerKg: 1.0, gPerKg: 1.0 },
      { name: 'Ziele angielskie', gramsPerKg: 1.5, gPerKg: 1.5 },
      { name: 'Kolendra prażona', gramsPerKg: 1.0, gPerKg: 1.0 },
      { name: 'Czosnek ząbki', gramsPerKg: 4.0, gPerKg: 4.0 },
      { name: 'Pieprz czarny ziarnisty', gramsPerKg: 2.0, gPerKg: 2.0 },
    ],
    summary: 'Klasyczna polska szynka zalewowo-nastrzykowa, wędzona olchą i parzona do 68°C.',
    techniqueNotes: 'Pekluj 8–10 dni w 4–6°C. Przed wędzeniem ociekaj 14h i osuszaj w wędzarni bez dymu do pergaminu!',
  },

  // 2. Salami Milano (BR-RECP-001 #2)
  {
    id: 'salami_milano',
    name: 'Salami Milano (Kultura T-SPX)',
    titleKey: 'presets.salamiMilano',
    titlePl: 'Salami Milano (Kultura T-SPX)',
    category: 'dry_cured',
    meatType: 'pork',
    cutType: 'Szynka I kl. (60%) + Boczek twardy (40%)',
    curingMethod: 'equilibrium',
    cureType: 'eq_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 26,
    saltRatioPct: 2.6,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.5,
    targetLossPercent: 35,
    targetLossPct: 35,
    casingCaliber: 'collagen_55',
    spices: [
      { name: 'Pieprz biały drobno mielony', gramsPerKg: 3.0, gPerKg: 3.0 },
      { name: 'Czosnek świeży roztarty z solą', gramsPerKg: 2.5, gPerKg: 2.5 },
      { name: 'Glukoza (paliwo dla T-SPX)', gramsPerKg: 4.0, gPerKg: 4.0 },
      { name: 'Wino białe wytrawne (włoskie)', gramsPerKg: 15.0, gPerKg: 15.0 },
      { name: 'Kultura starterowa Bactoferm T-SPX', gramsPerKg: 0.3, gPerKg: 0.3 },
    ],
    summary: 'Drobno rozdrobnione salami mediolańskie fermentowane do pH 5.2 z łagodnym bukietem.',
    techniqueNotes: 'Fermentuj 48h w 22°C i 92% RH do osiągnięcia pH ≤ 5.3. Następnie dojrzewaj w 12°C i 78% RH do -35% masy.',
  },

  // 3. Polędwica Łososiowa Wędzona na Zimno (BR-RECP-001 #3)
  {
    id: 'poledwica_lososiowa',
    name: 'Polędwica Łososiowa Wędzona na Zimno',
    titleKey: 'presets.poledwicaLososiowa',
    titlePl: 'Polędwica Łososiowa Wędzona na Zimno',
    category: 'smoked',
    meatType: 'pork',
    cutType: 'Schab środkowy starannie okrojony z mizdry',
    curingMethod: 'equilibrium',
    cureType: 'eq_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 25,
    saltRatioPct: 2.5,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.3,
    targetLossPercent: 20,
    targetLossPct: 20,
    recommendedWood: 'alder',
    spices: [
      { name: 'Pieprz czarny łamany', gramsPerKg: 2.0, gPerKg: 2.0 },
      { name: 'Cukier trzcinowy', gramsPerKg: 3.0, gPerKg: 3.0 },
      { name: 'Ziele angielskie tłuczone', gramsPerKg: 1.0, gPerKg: 1.0 },
      { name: 'Jałowiec leśny gnieciony', gramsPerKg: 1.5, gPerKg: 1.5 },
    ],
    summary: 'Surowy schab wędzony zimnym dymem (16–20°C), o barwie łososia i aksamitnej strukturze.',
    techniqueNotes: 'Pekluj 10 dni metodą EQ. Osadzaj 24h w 4°C. Wędź zimnym dymem 16–20°C przez 3–4 dni po 6h dziennie.',
  },

  // 4. Kiełbasa Krakowska Sucha Pieczona (BR-RECP-001 #1)
  {
    id: 'krakowska_sucha',
    name: 'Kiełbasa Krakowska Sucha Pieczona',
    titleKey: 'presets.krakowskaSucha',
    titlePl: 'Kiełbasa Krakowska Sucha Pieczona',
    category: 'cured_smoked',
    meatType: 'pork',
    cutType: 'Szynka I kl. (gruborąbana) + II kl.',
    curingMethod: 'dry',
    cureType: 'traditional_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 20,
    saltRatioPct: 2.0,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.2,
    targetLossPercent: 30,
    targetLossPct: 30,
    targetCoreTemp: 72,
    targetCoreTempC: 72,
    recommendedWood: 'beech',
    casingCaliber: 'collagen_55',
    spices: [
      { name: 'Pieprz czarny drobny', gramsPerKg: 2.0, gPerKg: 2.0 },
      { name: 'Czosnek świeży rozgnieciony', gramsPerKg: 3.0, gPerKg: 3.0 },
      { name: 'Kminek mielony', gramsPerKg: 0.5, gPerKg: 0.5 },
      { name: 'Gałka muszkatołowa', gramsPerKg: 0.5, gPerKg: 0.5 },
    ],
    summary: 'Klasyczna polska krakowska z widocznymi kawałkami chudej szynki, pieczona i podsuszana.',
    techniqueNotes: 'Nadziewaj w osłonki białkowe 55 mm, piecz w wędzarni w 85°C do 72°C w środku, po czym susz 5 dni.',
  },

  // 5. Boczek Wędzony Parzony (BR-RECP-001 #5)
  {
    id: 'boczek_wedzony',
    name: 'Boczek Wędzony Parzony',
    titleKey: 'presets.boczekWedzony',
    titlePl: 'Boczek Wędzony Parzony',
    category: 'cured_smoked',
    meatType: 'pork',
    cutType: 'Boczek bez kości ze skórą',
    curingMethod: 'wet',
    cureType: 'wet_brine',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 22,
    saltRatioPct: 2.2,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.3,
    waterRatioPct: 40,
    targetLossPercent: 12,
    targetLossPct: 12,
    targetCoreTemp: 72,
    targetCoreTempC: 72,
    recommendedWood: 'beech',
    spices: [
      { name: 'Liść laurowy kruszony', gramsPerKg: 1.0, gPerKg: 1.0 },
      { name: 'Ziele angielskie ziarno', gramsPerKg: 1.5, gPerKg: 1.5 },
      { name: 'Czosnek świeży miażdżony', gramsPerKg: 4.0, gPerKg: 4.0 },
      { name: 'Pieprz czarny średni', gramsPerKg: 2.5, gPerKg: 2.5 },
      { name: 'Majeranek otarty', gramsPerKg: 1.5, gPerKg: 1.5 },
    ],
    summary: 'Kruchy, aromatyczny boczek parzony w wodzie 75–80°C z głębokim dymem bukowym.',
    techniqueNotes: 'Mokra solanka 6–7 dni w 4°C. Osuszaj do suchości pergaminu. Wędź w 55°C przez 3h, parz do 72°C w rdzeniu.',
  },

  // 6. Kabanosy Staropolskie (BR-RECP-001 #6)
  {
    id: 'kabanosy_staropolskie',
    name: 'Kabanosy Staropolskie',
    titleKey: 'presets.kabanosyStaropolskie',
    titlePl: 'Kabanosy Staropolskie',
    category: 'cured_smoked',
    meatType: 'pork',
    cutType: 'Szynka kl. I + Boczek kl. II',
    curingMethod: 'dry',
    cureType: 'traditional_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 20,
    saltRatioPct: 2.0,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.2,
    targetLossPercent: 40,
    targetLossPct: 40,
    targetCoreTemp: 75,
    targetCoreTempC: 75,
    recommendedWood: 'cherry',
    casingCaliber: 'sheep_20_22',
    spices: [
      { name: 'Pieprz czarny mielony', gramsPerKg: 2.5, gPerKg: 2.5 },
      { name: 'Kminek cały', gramsPerKg: 1.0, gPerKg: 1.0 },
      { name: 'Gałka muszkatołowa', gramsPerKg: 0.5, gPerKg: 0.5 },
      { name: 'Cukier puder', gramsPerKg: 2.0, gPerKg: 2.0 },
    ],
    summary: 'Cienkie kabanosy w jelicie baranim 20/22 mm z charakterystycznym trzaskiem przy łamaniu.',
    techniqueNotes: 'Dopiekaj w wędzarni w 85°C do 75°C w rdzeniu, po czym podsuszaj 3-4 dni w przewiewnym miejscu do 40% ubytku.',
  },

  // 7. Bresaola Wołowa (BR-RECP-001 #7)
  {
    id: 'bresaola_wolowa',
    name: 'Bresaola Wołowa (Dojrzewająca Ligawa)',
    titleKey: 'presets.bresaolaWolowa',
    titlePl: 'Bresaola Wołowa (Dojrzewająca Ligawa)',
    category: 'dry_cured',
    meatType: 'beef',
    cutType: 'Ligawa wołowa (oko zrazowej) lub zrazowa górna',
    curingMethod: 'equilibrium',
    cureType: 'eq_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 28,
    saltRatioPct: 2.8,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.4,
    targetLossPercent: 38,
    targetLossPct: 38,
    spices: [
      { name: 'Pieprz czarny grubo tłuczony', gramsPerKg: 5.0, gPerKg: 5.0 },
      { name: 'Jałowiec leśny zmiażdżony', gramsPerKg: 3.0, gPerKg: 3.0 },
      { name: 'Rozmaryn suszony', gramsPerKg: 1.5, gPerKg: 1.5 },
      { name: 'Tymianek otarty', gramsPerKg: 1.5, gPerKg: 1.5 },
      { name: 'Liść laurowy drobno zmielony', gramsPerKg: 0.8, gPerKg: 0.8 },
      { name: 'Cynamon cejloński szczypta', gramsPerKg: 0.3, gPerKg: 0.3 },
    ],
    summary: 'Szlachetna włoska wędlina wołowa z alpejskim bukietem ziół, dojrzewająca do 38% ubytku.',
    techniqueNotes: 'Pekluj próżniowo EQ 14 dni, masując co 2 dni. Dojrzewaj w 11–13°C i 75–78% RH przez 6–8 tygodni.',
  },

  // 8. Pancetta Arrotolata (BR-RECP-001 #8)
  {
    id: 'pancetta_arrotolata',
    name: 'Pancetta Arrotolata (Boczek Rolowany)',
    titleKey: 'presets.pancettaArrotolata',
    titlePl: 'Pancetta Arrotolata (Boczek Rolowany)',
    category: 'dry_cured',
    meatType: 'pork',
    cutType: 'Boczek bez skóry',
    curingMethod: 'dry',
    cureType: 'eq_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 25,
    saltRatioPct: 2.5,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.3,
    targetLossPercent: 30,
    targetLossPct: 30,
    spices: [
      { name: 'Pieprz czarny świeżo mielony', gramsPerKg: 5.0, gPerKg: 5.0 },
      { name: 'Czosnek drobno posiekany', gramsPerKg: 3.0, gPerKg: 3.0 },
      { name: 'Tymianek otarty', gramsPerKg: 2.0, gPerKg: 2.0 },
      { name: 'Ziele angielskie mielone', gramsPerKg: 1.0, gPerKg: 1.0 },
      { name: 'Koper włoski (fenkuł)', gramsPerKg: 2.0, gPerKg: 2.0 },
    ],
    summary: 'Tradycyjny włoski boczek rolowany z ziołami, dojrzewający 6–8 tygodni.',
    techniqueNotes: 'Boczek zroluj ciasno, usuwając pęcherze powietrza, i zaszepsuj sznurkiem co 1.5 cm.',
  },

  // 9. Szynka Szynkowarowa Drobiowa (BR-RECP-001 #9)
  {
    id: 'szynkowar_drob',
    name: 'Szynka Szynkowarowa Drobiowa (Czysty Skład)',
    titleKey: 'presets.szynkowarDrob',
    titlePl: 'Szynka Szynkowarowa Drobiowa (Czysty Skład)',
    category: 'steamed',
    meatType: 'poultry',
    cutType: 'Pierś z indyka (70%) + udziec z indyka (30%)',
    curingMethod: 'dry',
    cureType: 'traditional_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 18,
    saltRatioPct: 1.8,
    peklosolRatio: 0.8,
    sugarRatioPct: 0.3,
    targetLossPercent: 8,
    targetLossPct: 8,
    targetCoreTemp: 74,
    targetCoreTempC: 74,
    spices: [
      { name: 'Czosnek granulowany', gramsPerKg: 2.5, gPerKg: 2.5 },
      { name: 'Pieprz biały drobny', gramsPerKg: 1.5, gPerKg: 1.5 },
      { name: 'Kolendra mielona', gramsPerKg: 1.0, gPerKg: 1.0 },
      { name: 'Majeranek otarty', gramsPerKg: 1.0, gPerKg: 1.0 },
      { name: 'Woda lodowata z żelatyną (emulsja)', gramsPerKg: 40.0, gPerKg: 40.0 },
    ],
    summary: 'Soczysta domowa wędlina dla dzieci i rodziny, bez fosforanów, parzona w szynkowarze.',
    techniqueNotes: 'Krojenie w kostkę 3x3 cm, energiczne wyrabianie do kleistości. Parzenie w kąpieli 75–78°C do 74°C w rdzeniu.',
  },

  // 10. Lonzino Dojrzewające (BR-RECP-001 #10)
  {
    id: 'lonzino_dojrzewajace',
    name: 'Lonzino (Polędwica Wieprzowa Dojrzewająca)',
    titleKey: 'presets.lonzinoDojrzewajace',
    titlePl: 'Lonzino (Polędwica Wieprzowa Dojrzewająca)',
    category: 'dry_cured',
    meatType: 'pork',
    cutType: 'Schab bez kości',
    curingMethod: 'equilibrium',
    cureType: 'eq_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 28,
    saltRatioPct: 2.8,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.4,
    targetLossPercent: 35,
    targetLossPct: 35,
    spices: [
      { name: 'Pieprz czarny grubo łamany', gramsPerKg: 4.0, gPerKg: 4.0 },
      { name: 'Czosnek granulowany', gramsPerKg: 2.0, gPerKg: 2.0 },
      { name: 'Jałowiec tłuczony', gramsPerKg: 1.5, gPerKg: 1.5 },
      { name: 'Cukier trzcinowy', gramsPerKg: 4.0, gPerKg: 4.0 },
    ],
    summary: 'Szlachetny, delikatny schab długodojrzewający z 35% ubytkiem masy wodnej.',
    techniqueNotes: '10 dni peklowania próżniowego EQ. Dojrzewanie w 11–13°C i 78% RH. Pilnuj alarmu Case Hardening!',
  },

  // 11. Biała Kiełbasa Parzona Wielkanocna (BR-RECP-001 #11)
  {
    id: 'biala_kielbasa',
    name: 'Biała Kiełbasa Parzona Wielkanocna',
    titleKey: 'presets.bialaKielbasa',
    titlePl: 'Biała Kiełbasa Parzona Wielkanocna',
    category: 'cured_smoked',
    meatType: 'pork',
    cutType: 'Łopatka I kl. (60%) + Boczek II kl. (30%) + Pręga wołowa III kl. (10%)',
    curingMethod: 'dry',
    cureType: 'traditional_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 19,
    saltRatioPct: 1.9,
    peklosolRatio: 0.0, // 100% czysta sól kamienna (tradycyjnie szara/biała)
    sugarRatioPct: 0.2,
    targetLossPercent: 10,
    targetLossPct: 10,
    targetCoreTemp: 68,
    targetCoreTempC: 68,
    casingCaliber: 'pork_28_30',
    spices: [
      { name: 'Majeranek otarty (podstawa aromatu)', gramsPerKg: 4.0, gPerKg: 4.0 },
      { name: 'Czosnek świeży ząbki roztarte', gramsPerKg: 5.0, gPerKg: 5.0 },
      { name: 'Pieprz czarny świeżo mielony', gramsPerKg: 2.5, gPerKg: 2.5 },
      { name: 'Woda lodowata (wyrabianie)', gramsPerKg: 80.0, gPerKg: 80.0 },
    ],
    summary: 'Królowa wielkanocnego stołu — naturalna biała kiełbasa bez dodatku azotynu, parzona w 75°C.',
    techniqueNotes: 'Wyrabiaj mięso III kl. z lodem do kleistości. Nadziewaj luźno w jelita wieprzowe 28/30. Parz w 75°C przez 25 min do 68°C w środku.',
  },

  // 12. Baleron Wędzony Parzony w Kątnicy (BR-RECP-001 #12)
  {
    id: 'baleron_wedzony',
    name: 'Baleron Wędzony Parzony w Kątnicy',
    titleKey: 'presets.baleronWedzony',
    titlePl: 'Baleron Wędzony Parzony w Kątnicy',
    category: 'cured_smoked',
    meatType: 'pork',
    cutType: 'Karkówka zwarta okrojona',
    curingMethod: 'wet',
    cureType: 'wet_injection',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 22,
    saltRatioPct: 2.2,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.3,
    waterRatioPct: 40,
    targetLossPercent: 12,
    targetLossPct: 12,
    targetCoreTemp: 70,
    targetCoreTempC: 70,
    recommendedWood: 'alder',
    casingCaliber: 'collagen_55',
    spices: [
      { name: 'Ziele angielskie tłuczone', gramsPerKg: 1.5, gPerKg: 1.5 },
      { name: 'Liść laurowy kruszony', gramsPerKg: 1.0, gPerKg: 1.0 },
      { name: 'Czosnek świeży roztarty', gramsPerKg: 4.0, gPerKg: 4.0 },
      { name: 'Pieprz czarny ziarnisty', gramsPerKg: 2.0, gPerKg: 2.0 },
      { name: 'Kolendra mielona', gramsPerKg: 1.0, gPerKg: 1.0 },
    ],
    summary: 'Marmurkowana karkówka parzona w osłonce, o niezwykłej soczystości i głębokim smaku.',
    techniqueNotes: 'Peklowanie nastrzykowe 8 dni. Wsadź w kątnicę lub osłonkę kolagenową 55 mm, ciasno osznuruj. Wędź olchą i parz w 75°C do 70°C w środku.',
  },

  // --- Dodatkowe Specjały Rzemieślnicze (Artisanal Specialty Bonuses) ---
  {
    id: 'lonza_wieprzowa',
    name: 'Polędwica Dojrzewająca (Lonza)',
    titleKey: 'presets.poledwicaLonza',
    titlePl: 'Polędwica Dojrzewająca (Lonza)',
    category: 'dry_cured',
    meatType: 'pork',
    cutType: 'Schab bez kości',
    curingMethod: 'equilibrium',
    cureType: 'eq_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 28,
    saltRatioPct: 2.8,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.4,
    targetLossPercent: 35,
    targetLossPct: 35,
    spices: [
      { name: 'Pieprz czarny grubo łamany', gramsPerKg: 4.0, gPerKg: 4.0 },
      { name: 'Czosnek granulowany', gramsPerKg: 2.0, gPerKg: 2.0 },
      { name: 'Jałowiec tłuczony', gramsPerKg: 1.5, gPerKg: 1.5 },
      { name: 'Cukier trzcinowy', gramsPerKg: 4.0, gPerKg: 4.0 },
    ],
    summary: 'Szlachetny, delikatny schab długodojrzewający z 35% ubytkiem masy wodnej.',
    techniqueNotes: '10 dni peklowania próżniowego EQ. Dojrzewanie w 11–13°C i 78% RH. Pilnuj alarmu Case Hardening!',
  },
  {
    id: 'coppa_karkowka',
    name: 'Coppa Piacentina (Karkówka Dojrzewająca)',
    titleKey: 'presets.coppaKarkowka',
    titlePl: 'Coppa Piacentina (Karkówka Dojrzewająca)',
    category: 'dry_cured',
    meatType: 'pork',
    cutType: 'Karkówka zwarta',
    curingMethod: 'equilibrium',
    cureType: 'eq_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 26,
    saltRatioPct: 2.6,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.5,
    targetLossPercent: 38,
    targetLossPct: 38,
    casingCaliber: 'collagen_55',
    spices: [
      { name: 'Pieprz czarny Tellicherry', gramsPerKg: 4.5, gPerKg: 4.5 },
      { name: 'Gałka muszkatołowa', gramsPerKg: 1.0, gPerKg: 1.0 },
      { name: 'Cynamon cejloński', gramsPerKg: 0.3, gPerKg: 0.3 },
      { name: 'Rozmaryn suszony', gramsPerKg: 1.5, gPerKg: 1.5 },
      { name: 'Goździki mielone', gramsPerKg: 0.2, gPerKg: 0.2 },
    ],
    summary: 'Marmurkowana włoska karkówka dojrzewająca o głębokim, korzennym bukiecie smakowym.',
    techniqueNotes: 'Pakuj w kątnicę lub osłonkę białkową, ściśle sznuruj przędzą masarską co 2 cm.',
  },
  {
    id: 'kielbasa_swojska',
    name: 'Kiełbasa Swojska Czosnkowa',
    titleKey: 'presets.kielbasaSwojska',
    titlePl: 'Kiełbasa Swojska Czosnkowa',
    category: 'cured_smoked',
    meatType: 'pork',
    cutType: 'Łopatka + boczek + pachwina',
    curingMethod: 'dry',
    cureType: 'traditional_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 18,
    saltRatioPct: 1.8,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.2,
    targetLossPercent: 15,
    targetLossPct: 15,
    targetCoreTemp: 70,
    targetCoreTempC: 70,
    recommendedWood: 'alder',
    casingCaliber: 'pork_28_30',
    spices: [
      { name: 'Czosnek polski wyciskany', gramsPerKg: 6.0, gPerKg: 6.0 },
      { name: 'Pieprz czarny średnio mielony', gramsPerKg: 3.0, gPerKg: 3.0 },
      { name: 'Majeranek otarty', gramsPerKg: 2.5, gPerKg: 2.5 },
      { name: 'Woda lodowata (wyrabianie)', gramsPerKg: 50.0, gPerKg: 50.0 },
    ],
    summary: 'Królowa polskich stołów: aromatyczna kiełbasa w jelicie wieprzowym 28/30 mm.',
    techniqueNotes: 'Wyrabiaj farsz do idealnej kleistości. Osuszaj 60 min, dym 3h w 55°C, parz w 75°C do 70°C w środku.',
  },
  {
    id: 'kabanosy_tradycyjne',
    name: 'Kabanosy Staropolskie',
    titleKey: 'presets.kabanosyTradycyjne',
    titlePl: 'Kabanosy Staropolskie',
    category: 'cured_smoked',
    meatType: 'pork',
    cutType: 'Szynka + boczek',
    curingMethod: 'dry',
    cureType: 'traditional_dry',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 20,
    saltRatioPct: 2.0,
    peklosolRatio: 1.0,
    sugarRatioPct: 0.2,
    targetLossPercent: 40,
    targetLossPct: 40,
    targetCoreTemp: 75,
    targetCoreTempC: 75,
    recommendedWood: 'cherry',
    casingCaliber: 'sheep_20_22',
    spices: [
      { name: 'Pieprz czarny mielony', gramsPerKg: 2.5, gPerKg: 2.5 },
      { name: 'Kminek cały', gramsPerKg: 1.0, gPerKg: 1.0 },
      { name: 'Gałka muszkatołowa', gramsPerKg: 0.5, gPerKg: 0.5 },
      { name: 'Cukier puder', gramsPerKg: 2.0, gPerKg: 2.0 },
    ],
    summary: 'Cienkie kabanosy w jelicie baranim 20/22 mm z charakterystycznym trzaskiem przy łamaniu.',
    techniqueNotes: 'Dopiekaj w wędzarni w 85°C, a następnie podsuszaj 3-4 dni w przewiewnym miejscu.',
  },
  {
    id: 'pastrami_beef',
    name: 'Pastrami Wołowe z Mostka',
    titleKey: 'presets.pastramiBeef',
    titlePl: 'Pastrami Wołowe z Mostka',
    category: 'cured_smoked',
    meatType: 'beef',
    cutType: 'Mostek wołowy (brisket flat)',
    curingMethod: 'wet',
    cureType: 'wet_brine',
    cureSaltType: 'peklosol_pl',
    saltGramsPerKg: 24,
    saltRatioPct: 2.4,
    peklosolRatio: 1.0,
    sugarRatioPct: 1.0,
    waterRatioPct: 50,
    targetLossPercent: 18,
    targetLossPct: 18,
    targetCoreTemp: 93,
    targetCoreTempC: 93,
    recommendedWood: 'oak',
    spices: [
      { name: 'Pieprz czarny grubo młotkowany (rub)', gramsPerKg: 15.0, gPerKg: 15.0 },
      { name: 'Kolendra grubo tłuczona (rub)', gramsPerKg: 10.0, gPerKg: 10.0 },
      { name: 'Czosnek granulowany', gramsPerKg: 5.0, gPerKg: 5.0 },
      { name: 'Papryka wędzona słodka', gramsPerKg: 3.0, gPerKg: 3.0 },
      { name: 'Cukier brązowy Muscovado', gramsPerKg: 8.0, gPerKg: 8.0 },
    ],
    summary: 'Kultowe pastrami z peklowanego mostka wołowego, wędzone dębem i parowane do miękkości.',
    techniqueNotes: 'Pekluj 7 dni, odsalaj w wodzie 3h, nanieś gruby rub i wędź w 110°C, po czym paruj do 93°C w rdzeniu.',
  },
];

export const MASTERCLASS_PRESETS = MASTER_PRESETS;

export function getPresetById(id: string): MasterPreset | undefined {
  return MASTER_PRESETS.find((p) => p.id === id);
}

export function getPresetsByCategory(category: string): MasterPreset[] {
  return MASTER_PRESETS.filter((p) => p.category === category);
}

export function scalePresetToWeight(preset: MasterPreset, weightKg: number): ScaledRecipeResult {
  const totalSaltGrams = Number((preset.saltGramsPerKg * weightKg).toFixed(1));
  const cureSaltGrams = Number((totalSaltGrams * preset.peklosolRatio).toFixed(1));
  const pureSaltGrams = Number((totalSaltGrams - cureSaltGrams).toFixed(1));

  const scaledSpices: ScaledRecipeSpice[] = preset.spices.map((spice) => {
    const gPerKg = spice.gramsPerKg ?? spice.gPerKg ?? 0;
    return {
      name: spice.name,
      gramsPerKg: gPerKg,
      totalGrams: Number((gPerKg * weightKg).toFixed(2)),
    };
  });

  const waterVolumeMl = preset.waterRatioPct
    ? Math.round(weightKg * (preset.waterRatioPct / 100) * 1000)
    : undefined;

  return {
    presetId: preset.id,
    presetName: preset.name,
    meatWeightKg: weightKg,
    totalSaltGrams,
    pureSaltGrams,
    cureSaltGrams,
    waterVolumeMl,
    spices: scaledSpices,
  };
}
