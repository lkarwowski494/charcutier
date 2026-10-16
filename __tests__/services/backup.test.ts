/**
 * CHARCUTIER — Backup Engine & CSV Export Tests
 * Apps4Brew Studio
 */

import { restoreBackup, exportBatchesToCsv } from '../../src/services/backup';

jest.mock('expo-file-system/legacy', () => ({
  writeAsStringAsync: jest.fn().mockResolvedValue(true),
  readAsStringAsync: jest.fn().mockResolvedValue('{}'),
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true }),
  readDirectoryAsync: jest.fn().mockResolvedValue([]),
  deleteAsync: jest.fn().mockResolvedValue(true),
  EncodingType: { UTF8: 'utf8' },
}));

jest.mock('../../src/db/database', () => ({
  getDatabase: jest.fn().mockResolvedValue({
    withTransactionAsync: jest.fn().mockImplementation(async (cb) => cb()),
    execAsync: jest.fn().mockResolvedValue(true),
    getAllAsync: jest.fn().mockResolvedValue([]),
    getFirstAsync: jest.fn().mockResolvedValue({
      weight_g: 1300,
      loss_pct: 35.0,
      recorded_at: Date.now(),
    }),
  }),
  getAllSettings: jest.fn().mockResolvedValue({}),
  setSetting: jest.fn().mockResolvedValue(true),
  getAllBatches: jest.fn().mockResolvedValue([
    {
      id: 'batch_csv_1',
      name: 'Schab "Tradycyjny" & Wyborny',
      meat_type: 'pork',
      cut_type: 'Schab "Klasyk"',
      initial_weight_g: 2000,
      target_loss_pct: 35,
      cure_type: 'eq_dry',
      status: 'maturing',
      created_at: 1776345600000,
      updated_at: 1776345600000,
      notes: null,
    },
  ]),
  getAllPantryItems: jest.fn().mockResolvedValue([]),
  getAllRecipes: jest.fn().mockResolvedValue([]),
  createBatch: jest.fn().mockResolvedValue(true),
  createCuringLog: jest.fn().mockResolvedValue(true),
  createWeightLog: jest.fn().mockResolvedValue(true),
  createSmokeSession: jest.fn().mockResolvedValue(true),
  upsertPantryItem: jest.fn().mockResolvedValue(true),
  createRecipe: jest.fn().mockResolvedValue(true),
}));

describe('backup-engine: restore validation & CSV sanitization', () => {
  test('restoreBackup rejects null, undefined, or empty objects', async () => {
    await expect(restoreBackup(null as any)).rejects.toThrow(/Invalid backup file/);
    await expect(restoreBackup(undefined as any)).rejects.toThrow(/Invalid backup file/);
    await expect(restoreBackup({} as any)).rejects.toThrow(/Invalid backup file/);
  });

  test('restoreBackup rejects foreign app backups', async () => {
    const foreignBackup = {
      version: 1,
      app: 'sloik',
      created_at: new Date().toISOString(),
      timestamp: Date.now(),
    };
    await expect(restoreBackup(foreignBackup as any)).rejects.toThrow(/Invalid backup file/);
  });

  test('restoreBackup successfully restores valid snapshot with safety backup', async () => {
    const validBackup = {
      version: 1,
      app: 'charcutier',
      created_at: new Date().toISOString(),
      timestamp: Date.now(),
      settings: { language: 'pl' },
      batches: [],
      curing_logs: [],
      weight_logs: [],
      smoke_sessions: [],
      pantry_items: [],
      recipes: [],
    };
    await expect(restoreBackup(validBackup as any)).resolves.not.toThrow();
  });

  test('exportBatchesToCsv properly escapes quotes in batch names and elements', async () => {
    const csv = await exportBatchesToCsv();
    expect(csv).toContain('"Schab ""Tradycyjny"" & Wyborny"');
    expect(csv).toContain('"Schab ""Klasyk"""');
    expect(csv).toContain('ID,Nazwa,Gatunek,Element');
  });
});
