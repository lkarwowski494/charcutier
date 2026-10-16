/**
 * CHARCUTIER — Craft Timer PCM WAV Audio Generator
 * Apps4Brew Studio
 *
 * Generates an authentic dual-tone acoustic chime (587Hz D5 + 880Hz A5)
 * in pure 16-bit PCM RIFF/WAVE format with exponential acoustic decay (>2500 bytes).
 * Plays sound via expo-av and triggers haptic vibration via expo-haptics.
 */

import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';

let cachedWavBase64: string | null = null;
let activeSound: AudioPlayer | null = null;

/**
 * Encodes array buffer to Base64 string in pure JS (cross-platform)
 */
function bufferToBase64(buffer: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  const len = buffer.length;

  for (let i = 0; i < len; i += 3) {
    const b1 = buffer[i];
    const b2 = i + 1 < len ? buffer[i + 1] : 0;
    const b3 = i + 2 < len ? buffer[i + 2] : 0;

    const enc1 = b1 >> 2;
    const enc2 = ((b1 & 3) << 4) | (b2 >> 4);
    let enc3 = ((b2 & 15) << 2) | (b3 >> 6);
    let enc4 = b3 & 63;

    if (i + 1 >= len) {
      enc3 = 64;
      enc4 = 64;
    } else if (i + 2 >= len) {
      enc4 = 64;
    }

    result +=
      chars.charAt(enc1) +
      chars.charAt(enc2) +
      (enc3 === 64 ? '=' : chars.charAt(enc3)) +
      (enc4 === 64 ? '=' : chars.charAt(enc4));
  }

  return result;
}

/**
 * Generates a dual-tone 16-bit PCM WAV (587Hz + 880Hz) with decay
 */
export function generateCraftChimeWavBase64(): string {
  if (cachedWavBase64) return cachedWavBase64;

  const sampleRate = 22050; // 22.05 kHz
  const durationSec = 1.2;  // 1.2 seconds chime
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2; // 16-bit = 2 bytes per sample
  const fileSize = 36 + dataSize;

  const buffer = new Uint8Array(44 + dataSize);
  const view = new DataView(buffer.buffer);

  // 1. RIFF chunk descriptor
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, fileSize, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // 2. fmt sub-chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);          // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);           // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true);           // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true);  // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true);           // BlockAlign
  view.setUint16(34, 16, true);          // BitsPerSample

  // 3. data sub-chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataSize, true);

  // Generate dual acoustic chime: D5 (587.33 Hz) and A5 (880.00 Hz)
  const freq1 = 587.33;
  const freq2 = 880.00;
  const twoPi = 2 * Math.PI;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Acoustic exponential decay envelope: e^(-3 * t)
    const envelope = Math.exp(-3.2 * t);
    // Combine two pure sine waves with harmonic warmth
    const wave =
      0.65 * Math.sin(twoPi * freq1 * t) +
      0.35 * Math.sin(twoPi * freq2 * t);

    // 16-bit signed integer range: -32768 to 32767
    const sample = Math.max(-32767, Math.min(32767, Math.floor(wave * envelope * 28000)));
    view.setInt16(44 + i * 2, sample, true);
  }

  const base64Data = bufferToBase64(buffer);
  cachedWavBase64 = `data:audio/wav;base64,${base64Data}`;
  return cachedWavBase64;
}

/**
 * Plays the craft butcher timer chime and triggers heavy haptic feedback
 */
export async function playTimerChime(): Promise<void> {
  try {
    // 1. Haptic feedback
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Haptics optional on web / unsupported hardware
    }

    // 2. Audio playback
    if (activeSound) {
      try {
        activeSound.remove();
      } catch {
        // ignore
      }
      activeSound = null;
    }

    const uri = generateCraftChimeWavBase64();
    const player = createAudioPlayer(uri);
    player.play();
    activeSound = player;
  } catch (error) {
    console.warn('Could not play audio chime (silently continuing):', error);
  }
}
