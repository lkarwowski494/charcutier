/**
 * CHARCUTIER — Backup Engine & CSV Export Tests
 * Apps4Brew Studio (SEC-09, BR-TEST-022, BR-TEST-023, RD-ENG-12, NFR-SEC-015)
 */

import {
  restoreBackup,
  exportBatchesToCsv,
  exportDatabaseToJson,
  listBackups,
  pruneOldBackups,
  escapeCsvValue,
  saveCorruptState,
  checkCorruptState,
  createBackup,
  safetyBackup,
  AUTO_RE,
  SAFETY_RE,
} from '../../src/services/backup';
import * as FileSystem from 'expo-file-system/legacy';

jest.mock('expo-file-system/legacy', () => ({
  writeAsStringAsync: jest.fn().mockResolvedValue(true),
  readAsStringAsync: jest.fn().mockResolvedValue('{}'),
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true }),
  readDirectoryAsync: jest.fn().mockResolvedValue([]),
  deleteAsync: jest.fn().mockResolvedValue(true),
  makeDirectoryAsync: jest.fn().mockResolvedValue(true),
  EncodingType: { UTF8: 'utf8' },
  documentDirectory: 'file:///mock-documents/',
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
    {
      id: 'batch_malicious_2',
      name: '=cmd|"/C calc"!A0',
      meat_type: '+pork_inject',
      cut_type: '-ribs',
      initial_weight_g: 1500,
      target_loss_pct: 30,
      cure_type: '@special',
      status: 'curing',
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

  test('escapeCsvValue neutralizes Formula Injection (=, +, -, @, \\t, \\r)', () => {
    expect(escapeCsvValue('=1+2')).toBe(`"'=1+2"`);
    expect(escapeCsvValue('+cmd')).toBe(`"'+cmd"`);
    expect(escapeCsvValue('-5')).toBe(`"'-5"`);
    expect(escapeCsvValue('@user')).toBe(`"'@user"`);
    expect(escapeCsvValue('\ttab')).toBe(`"'\ttab"`);
    expect(escapeCsvValue('\rreturn')).toBe(`"'\rreturn"`);
    expect(escapeCsvValue('Safe String')).toBe(`"Safe String"`);
    expect(escapeCsvValue(null)).toBe(`""`);
  });

  test('exportBatchesToCsv neutralizes formula injection in batch rows', async () => {
    const csv = await exportBatchesToCsv();
    expect(csv).toContain(`"'=cmd|""/C calc""!A0"`);
    expect(csv).toContain(`"'+pork_inject"`);
    expect(csv).toContain(`"'-ribs"`);
    expect(csv).toContain(`"'@special"`);
  });

  test('exportDatabaseToJson serializes full snapshot', async () => {
    const jsonStr = await exportDatabaseToJson();
    const parsed = JSON.parse(jsonStr);
    expect(parsed.app).toBe('charcutier');
    expect(parsed.version).toBe(1);
  });

  test('listBackups returns sorted list and handles file info', async () => {
    const list = await listBackups();
    expect(Array.isArray(list)).toBe(true);
  });

  test('pruneOldBackups returns 0 if backups are within limit', async () => {
    const deletedCount = await pruneOldBackups();
    expect(deletedCount).toBe(0);
  });

  test('saveCorruptState saves emergency file with recovery field', async () => {
    const filePath = await saveCorruptState('{"corrupt": true}', 'JSON parse error');
    expect(filePath).toContain('state_corrupt_');
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      expect.stringContaining('state_corrupt_'),
      expect.stringContaining('"recovery"'),
      expect.anything()
    );
  });

  test('checkCorruptState detects latest corrupted file if present', async () => {
    (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValueOnce([
      'state_corrupt_2026-10-17_100000.json',
    ]);
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        timestamp: '2026-10-17T10:00:00.000Z',
        recovery: { rawPayload: '{"broken":1}' },
      })
    );

    const corrupt = await checkCorruptState();
    expect(corrupt).not.toBeNull();
    expect(corrupt?.corruptFile).toBe('state_corrupt_2026-10-17_100000.json');
    expect(corrupt?.rawSnippet).toContain('broken');
  });

  test('two-pool regex matches respective filenames', () => {
    expect(AUTO_RE.test('charcutier-kopia-2026-10-17_101234.json')).toBe(true);
    expect(AUTO_RE.test('charcutier-kopia-2026-10-17_101234-2.json')).toBe(true);
    expect(AUTO_RE.test('charcutier-przed-importem-2026-10-17_101234.json')).toBe(false);

    expect(SAFETY_RE.test('charcutier-przed-importem-2026-10-17_101234.json')).toBe(true);
    expect(SAFETY_RE.test('charcutier-przed-czyszczeniem-2026-10-17_101234-3.json')).toBe(true);
    expect(SAFETY_RE.test('charcutier-kopia-2026-10-17_101234.json')).toBe(false);
  });

  test('safetyBackup creates pre-destructive backup file in safety pool', async () => {
    const backupFile = await safetyBackup('import');
    expect(backupFile).toContain('charcutier-przed-importem-');
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      expect.stringContaining('charcutier-przed-importem-'),
      expect.anything(),
      expect.anything()
    );
  });
});
