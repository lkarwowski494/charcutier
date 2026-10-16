/**
 * CHARCUTIER — Tabs Layout
 * Apps4Brew Studio
 *
 * 5 Core Tabs:
 * 1. Kalkulator (1-Tap + Pro Accordion)
 * 2. Partie (Aktywne partie i komora)
 * 3. Spiżarnia (Jelita, przyprawy, paszporty PDF)
 * 4. Szkoła (Atlas wad, drewna, pleśni)
 * 5. Ustawienia (Apps4Brew Pass, 10 rotacyjnych backupów)
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Text, Platform, StyleSheet } from 'react-native';
import { colors } from '../../src/theme/colors';
import { t } from '../../src/i18n';

export default function TabsLayout() {
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
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.calculator'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🧮</Text>,
          headerTitle: 'CHARCUTIER · ' + t('calculator.title'),
        }}
      />
      <Tabs.Screen
        name="batches"
        options={{
          title: t('navigation.batches'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🥩</Text>,
          headerTitle: t('batches.title'),
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          title: t('navigation.pantry'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🧂</Text>,
          headerTitle: t('pantry.title'),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: t('navigation.guide'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📖</Text>,
          headerTitle: t('guide.title'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('navigation.settings'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>⚙️</Text>,
          headerTitle: t('settings.title'),
        }}
      />
      {/* Dynamic sub-routes hidden from tab bar */}
      <Tabs.Screen
        name="batches/[id]"
        options={{
          href: null,
          title: 'Paszport Partii',
          headerTitle: 'Paszport Partii',
        }}
      />
      <Tabs.Screen
        name="smoking/[id]"
        options={{
          href: null,
          title: 'Asystent Wędzenia',
          headerTitle: 'Wędzarnia & Parzenie',
        }}
      />
    </Tabs>
  );
}
