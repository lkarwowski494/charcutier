/**
 * CHARCUTIER — PDF Label & QR Generator Tests
 * Apps4Brew Studio
 */

import { escapeHtml, generateBatchLabelsHtml, printBatchLabels } from '../../src/services/label-generator';
import { Batch } from '../../src/types';

jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn().mockResolvedValue({ uri: 'file:///tmp/labels.pdf' }),
  printAsync: jest.fn().mockResolvedValue(true),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(false),
  shareAsync: jest.fn().mockResolvedValue(true),
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockQrCode'),
}));

describe('label-generator: HTML escaping and PDF template', () => {
  test('escapeHtml properly sanitizes HTML characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(escapeHtml("Pork & Beef 'Prime'")).toBe('Pork &amp; Beef &#39;Prime&#39;');
    expect(escapeHtml('')).toBe('');
    expect(escapeHtml(null as any)).toBe('');
  });

  test('generateBatchLabelsHtml sanitizes dynamic batch fields in generated HTML', async () => {
    const maliciousBatch: Batch = {
      id: 'batch_malicious_123',
      name: '<img src=x onerror=alert(1)> Schab Tradycyjny & Syn',
      meat_type: 'pork',
      cut_type: 'Schab <Special>',
      initial_weight_g: 2000,
      target_loss_pct: 35,
      cure_type: 'eq_dry',
      status: 'curing',
      created_at: 1776345600000,
      updated_at: 1776345600000,
      notes: null,
    };

    const html = await generateBatchLabelsHtml([maliciousBatch]);

    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt; Schab Tradycyjny &amp; Syn');
    expect(html).toContain('Schab &lt;Special&gt;');
    expect(html).not.toContain('<img src=x onerror=alert(1)>');
    expect(html).toContain('CHARCUTIER QR');
  });

  test('printBatchLabels throws when batch list is empty', async () => {
    await expect(printBatchLabels([])).rejects.toThrow();
  });

  test('printBatchLabels triggers Print.printAsync when Sharing is unavailable', async () => {
    const Print = require('expo-print');
    const mockBatch: Batch = {
      id: 'batch_print_1',
      name: 'Polędwica',
      meat_type: 'pork',
      cut_type: 'Polędwica',
      initial_weight_g: 1500,
      target_loss_pct: 35,
      cure_type: 'eq_dry',
      status: 'maturing',
      created_at: Date.now(),
      updated_at: Date.now(),
      notes: null,
    };

    await printBatchLabels([mockBatch]);
    expect(Print.printAsync).toHaveBeenCalled();
  });

  test('printBatchLabels triggers Sharing.shareAsync when Sharing is available', async () => {
    const Sharing = require('expo-sharing');
    Sharing.isAvailableAsync.mockResolvedValueOnce(true);

    const mockBatch: Batch = {
      id: 'batch_print_2',
      name: 'Boczek',
      meat_type: 'pork',
      cut_type: 'Boczek',
      initial_weight_g: 1500,
      target_loss_pct: 35,
      cure_type: 'eq_dry',
      status: 'maturing',
      created_at: Date.now(),
      updated_at: Date.now(),
      notes: null,
    };

    await printBatchLabels([mockBatch]);
    expect(Sharing.shareAsync).toHaveBeenCalled();
  });
});
