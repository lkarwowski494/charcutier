/**
 * CHARCUTIER — Tabs Layout
 * Apps4Craft Studio Standard
 *
 * 4 Core Craft Pillars (Reduced Bottom Navigation):
 * 1. Warsztat (Kalkulator & Szynkowar)
 * 2. Dojrzewalnia (Partie & Salami)
 * 3. Spiżarnia (Jelita & Przyprawy)
 * 4. Akademia (Atlas wad, drewna, kultur)
 *
 * Header Right:
 * Atelier / Settings button (Profile, Custom Equipment, Backups, Apps4Brew Pass)
 */

import React, { useState, useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { colors } from '../../src/theme/colors';
import { t, getLanguage, subscribeLanguageChange } from '../../src/i18n';
import {
  CraftIcon,
  CellarIcon,
  PantryIcon,
  AtlasIcon,
  AtelierIcon,
} from '../../src/components/CraftIcons';

export default function TabsLayout() {
  const router = useRouter();
  const [lang, setLang] = useState(getLanguage());

  useEffect(() => {
    return subscribeLanguageChange((newLang) => {
      setLang(newLang);
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.surfaceLight,
        },
        headerTitleStyle: {
          color: colors.textPrimary,
          fontWeight: '800',
          fontSize: 18,
        },
        headerTintColor: colors.amberPrimary,
        headerRight: () => (
          <TouchableOpacity
            style={styles.atelierBtn}
            onPress={() => router.push('/settings')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel={t('navigation.settings')}
          >
            <AtelierIcon color={colors.amberPrimary} size={22} />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.surfaceLight,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.amberPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      {/* 1. Warsztat / Kalkulator */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.calculator'),
          tabBarIcon: ({ color }) => <CraftIcon color={color} size={22} />,
          headerTitle: 'CHARCUTIER · ' + t('calculator.title'),
        }}
      />

      {/* 2. Dojrzewalnia / Partie */}
      <Tabs.Screen
        name="batches"
        options={{
          title: t('navigation.batches'),
          tabBarIcon: ({ color }) => <CellarIcon color={color} size={22} />,
          headerTitle: t('batches.title'),
        }}
      />

      {/* 3. Spiżarnia */}
      <Tabs.Screen
        name="pantry"
        options={{
          title: t('navigation.pantry'),
          tabBarIcon: ({ color }) => <PantryIcon color={color} size={22} />,
          headerTitle: t('pantry.title'),
        }}
      />

      {/* 4. Akademia / Atlas */}
      <Tabs.Screen
        name="guide"
        options={{
          title: t('navigation.guide'),
          tabBarIcon: ({ color }) => <AtlasIcon color={color} size={22} />,
          headerTitle: t('guide.title'),
        }}
      />

      {/* Dynamic sub-routes hidden from tab bar */}
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          title: t('navigation.settings'),
          headerTitle: t('settings.title'),
        }}
      />
      <Tabs.Screen
        name="batches/[id]"
        options={{
          href: null,
          title: t('batches.passportTitle'),
          headerTitle: t('batches.passportTitle'),
        }}
      />
      <Tabs.Screen
        name="smoking/[id]"
        options={{
          href: null,
          title: t('smoking.title'),
          headerTitle: t('smoking.headerTitle'),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  atelierBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    padding: 6,
    borderRadius: 8,
  },
});
