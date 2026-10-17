/**
 * Seed & Run Count Configuration for fast-check Property Tests
 * Standard: BR-TEST-008, BR-TEST-009, DEC-03
 */

const DEFAULT_SEED = 0x5eed1234;
const DEFAULT_RUNS = process.env.CI ? 200 : 100;

function resolveSeed() {
  const envSeed = process.env.PROP_SEED || process.env.MATRIX_SEED;
  if (!envSeed) {
    return DEFAULT_SEED;
  }
  if (envSeed === 'random') {
    return Math.floor(Math.random() * 0x7fffffff);
  }
  const parsed = parseInt(envSeed, 10);
  return Number.isNaN(parsed) ? DEFAULT_SEED : parsed;
}

function resolveRuns() {
  const envRuns = process.env.MATRIX_RUNS || process.env.FC_RUNS;
  if (!envRuns) {
    return DEFAULT_RUNS;
  }
  const parsed = parseInt(envRuns, 10);
  return Number.isNaN(parsed) ? DEFAULT_RUNS : parsed;
}

const PROP_SEED = resolveSeed();
const PROP_RUNS = resolveRuns();

module.exports = {
  PROP_SEED,
  PROP_RUNS,
  DEFAULT_SEED,
};
