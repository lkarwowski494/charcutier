/**
 * CHARCUTIER — Root Layout
 * Apps4Brew Studio (Expo 57 / React Native 0.86.3)
 */

import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase, getSetting } from '../src/db/database';
import { setLanguage } from '../src/i18n';
import { colors } from '../src/theme/colors';
import { AppLanguage } from '../src/types';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        const savedLang = await getSetting('app_lang');
        if (savedLang === 'pl' || savedLang === 'en') {
          setLanguage(savedLang as AppLanguage);
        }
      } catch (err: any) {
        console.warn('Database initialization warning:', err);
        setInitError(err?.message || 'Database init warning');
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.amberPrimary} />
        <Text style={styles.loadingText}>CHARCUTIER</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.amberPrimary,
          headerTitleStyle: {
            fontWeight: '800',
            color: colors.textPrimary,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.amberPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
