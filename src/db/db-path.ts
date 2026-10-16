/**
 * CHARCUTIER — Database & Backup Storage Path Resolver
 * Apps4Brew Studio (SEC-09: /Library/Application Support/SQLite/charcutier.db)
 */

import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export const DB_FILENAME = 'charcutier.db';
export const APP_ID = 'charcutier';

/**
 * Returns the exact platform-specific directory where SQLite database files must be stored.
 * On iOS: /Library/Application Support/SQLite/
 * On Android / Others: standard documents directory / SQLite
 */
export function getDatabaseDirectory(): string {
  if (Platform.OS === 'ios') {
    const docDir = FileSystem.documentDirectory;
    if (docDir) {
      // In iOS sandbox, Document directory ends with "/Documents/"
      // Application Support is located at "../Library/Application Support/SQLite/"
      return docDir.replace(/\/Documents\/?$/, '/Library/Application Support/SQLite/');
    }
    return '/Library/Application Support/SQLite/';
  }

  // Android or default fallback
  const base = FileSystem.documentDirectory || FileSystem.cacheDirectory || './';
  return `${base}SQLite/`;
}

/**
 * Returns full path to charcutier.db
 */
export function getDatabasePath(): string {
  return `${getDatabaseDirectory()}${DB_FILENAME}`;
}

/**
 * Returns the directory dedicated to rolling JSON backups
 * On iOS: /Library/Application Support/Backups/
 */
export function getBackupDirectory(): string {
  if (Platform.OS === 'ios') {
    const docDir = FileSystem.documentDirectory;
    if (docDir) {
      return docDir.replace(/\/Documents\/?$/, '/Library/Application Support/Backups/');
    }
    return '/Library/Application Support/Backups/';
  }

  const base = FileSystem.documentDirectory || FileSystem.cacheDirectory || './';
  return `${base}Backups/`;
}

/**
 * Ensures required directories exist on disk before file operations
 */
export async function ensureDatabaseDirectories(): Promise<void> {
  const dbDir = getDatabaseDirectory();
  const backupDir = getBackupDirectory();

  try {
    const dbInfo = await FileSystem.getInfoAsync(dbDir);
    if (!dbInfo.exists) {
      await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
    }

    const backupInfo = await FileSystem.getInfoAsync(backupDir);
    if (!backupInfo.exists) {
      await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
    }
  } catch (error) {
    console.warn('Could not ensure directories via FileSystem (may be in test environment):', error);
  }
}
