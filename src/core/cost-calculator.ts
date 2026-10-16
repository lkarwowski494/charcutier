/**
 * CHARCUTIER — Batch Cost & Moisture-Loss Yield Calculator
 * Apps4Brew Studio (Adapted from Napar / Słoik Cost Calculator)
 *
 * Computes:
 * - Total batch financial cost (raw meat + seasonings + casings + smoking wood/energy)
 * - True yield cost per kg after water loss shrinkage
 * - Craft artisanal benchmark comparison and household savings
 */

export interface BatchCostInput {
  rawMeatWeightKg: number;
  rawMeatPricePerKg: number;
  cureAndSpicesCost: number;     // Cost of salts, curing salts, herbs
  casingsCost: number;           // Cost of casings, twine, vacuum bags
  smokingWoodEnergyCost: number; // Cost of wood chips, charcoal, gas/electricity
  targetLossPct: number;         // e.g. 35% for dry cured, 15% for smoked/poached ham
  artisanalMarketPricePerKg?: number; // Benchmark market price (e.g. 110 PLN/kg)
}

export interface BatchCostOutput {
  totalBatchCost: number;
  finalYieldWeightKg: number;
  waterLossWeightKg: number;
  trueCostPerKgFinished: number;
  costPer100gSlice: number;
  marketBenchmarkTotal: number;
  estimatedSavings: number;
  savingsPercentage: number;
}

export function calculateBatchCost(input: BatchCostInput): BatchCostOutput {
  const {
    rawMeatWeightKg,
    rawMeatPricePerKg,
    cureAndSpicesCost = 0,
    casingsCost = 0,
    smokingWoodEnergyCost = 0,
    targetLossPct = 0,
    artisanalMarketPricePerKg = 110, // default typical Polish artisanal charcuterie price
  } = input;

  if (rawMeatWeightKg <= 0) {
    return {
      totalBatchCost: 0,
      finalYieldWeightKg: 0,
      waterLossWeightKg: 0,
      trueCostPerKgFinished: 0,
      costPer100gSlice: 0,
      marketBenchmarkTotal: 0,
      estimatedSavings: 0,
      savingsPercentage: 0,
    };
  }

  const rawMeatTotal = rawMeatWeightKg * rawMeatPricePerKg;
  const totalBatchCost =
    rawMeatTotal + cureAndSpicesCost + casingsCost + smokingWoodEnergyCost;

  const waterLossWeightKg = rawMeatWeightKg * (targetLossPct / 100);
  const finalYieldWeightKg = Math.max(0.1, rawMeatWeightKg - waterLossWeightKg);

  const trueCostPerKgFinished = Math.round((totalBatchCost / finalYieldWeightKg) * 100) / 100;
  const costPer100gSlice = Math.round((trueCostPerKgFinished / 10) * 100) / 100;

  const marketBenchmarkTotal =
    Math.round(finalYieldWeightKg * artisanalMarketPricePerKg * 100) / 100;
  const estimatedSavings =
    Math.round((marketBenchmarkTotal - totalBatchCost) * 100) / 100;
  const savingsPercentage =
    marketBenchmarkTotal > 0
      ? Math.max(0, Math.round((estimatedSavings / marketBenchmarkTotal) * 100))
      : 0;

  return {
    totalBatchCost: Math.round(totalBatchCost * 100) / 100,
    finalYieldWeightKg: Math.round(finalYieldWeightKg * 100) / 100,
    waterLossWeightKg: Math.round(waterLossWeightKg * 100) / 100,
    trueCostPerKgFinished,
    costPer100gSlice,
    marketBenchmarkTotal,
    estimatedSavings,
    savingsPercentage,
  };
}
