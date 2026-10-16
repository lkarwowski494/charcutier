/**
 * CHARCUTIER — PDF Label Sheet & QR Code Generator
 * Apps4Brew Studio
 *
 * Implements JTBD-C11: Printable waterproof chamber labels (A4) with QR codes
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import QRCode from 'qrcode';
import { Batch } from '../types';
import { t } from '../i18n';

/**
 * Escapes HTML entities to prevent malformed tags and injection
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generates an A4 HTML printable sheet with QR code passports for batches
 */
export async function generateBatchLabelsHtml(batches: Batch[]): Promise<string> {
  // Generate Base64 QR code for each batch
  const batchCardsHtml = await Promise.all(
    batches.map(async (b) => {
      const qrDataUrl = await QRCode.toDataURL(`charcutier://batch/${b.id}`, {
        width: 140,
        margin: 1,
        color: {
          dark: '#1C1917',
          light: '#FFFFFF',
        },
      });

      const dateStr = new Date(b.created_at).toLocaleDateString();
      const meatLabel = t(`calculator.types.${b.meat_type}` as any) || escapeHtml(b.meat_type);
      const cureLabel = t(`calculator.methods.${b.cure_type}` as any) || escapeHtml(b.cure_type);

      return `
        <div class="label-card">
          <div class="header">
            <span class="brand">CHARCUTIER</span>
            <span class="batch-id">${escapeHtml(b.id.slice(0, 12))}</span>
          </div>
          <div class="content">
            <div class="details">
              <div class="name">${escapeHtml(b.name)}</div>
              <div class="meta"><b>${t('batches.cutType')}:</b> ${escapeHtml(b.cut_type)} (${meatLabel})</div>
              <div class="meta"><b>${t('batches.initialWeight')}:</b> ${b.initial_weight_g.toFixed(0)} g</div>
              <div class="meta"><b>${t('batches.targetLoss')}:</b> ${b.target_loss_pct.toFixed(0)}%</div>
              <div class="meta"><b>${t('calculator.cureMethod')}:</b> ${cureLabel}</div>
              <div class="meta"><b>${t('scheduler.startCuringAt')}:</b> ${dateStr}</div>
            </div>
            <div class="qr-col">
              <img src="${qrDataUrl}" class="qr-img" />
              <div class="qr-sub">CHARCUTIER QR</div>
            </div>
          </div>
        </div>
      `;
    })
  );

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>CHARCUTIER — Paszporty Partii</title>
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #1c1917;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8mm;
          }
          .label-card {
            border: 1.5px dashed #78350f;
            border-radius: 8px;
            padding: 10px 14px;
            box-sizing: border-box;
            background: #fffefb;
            page-break-inside: avoid;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e7e5e4;
            padding-bottom: 4px;
            margin-bottom: 8px;
          }
          .brand {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #b45309;
          }
          .batch-id {
            font-size: 9px;
            color: #78716c;
            font-family: monospace;
          }
          .content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .details {
            flex: 1;
          }
          .name {
            font-size: 14px;
            font-weight: 800;
            color: #1c1917;
            margin-bottom: 4px;
          }
          .meta {
            font-size: 10.5px;
            color: #44403c;
            line-height: 1.4;
          }
          .qr-col {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: 10px;
          }
          .qr-img {
            width: 72px;
            height: 72px;
          }
          .qr-sub {
            font-size: 7.5px;
            color: #78716c;
            margin-top: 2px;
          }
        </style>
      </head>
      <body>
        <div class="grid">
          ${batchCardsHtml.join('')}
        </div>
      </body>
    </html>
  `;
}

/**
 * Triggers PDF generation and system print / share dialogue
 */
export async function printBatchLabels(batches: Batch[]): Promise<void> {
  if (batches.length === 0) {
    throw new Error(t('pantry.noBatchesDesc'));
  }

  const html = await generateBatchLabelsHtml(batches);
  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } else {
    await Print.printAsync({ html });
  }
}
