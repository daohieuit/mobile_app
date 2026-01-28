import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Theme } from '../../constants/Theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: Theme.colors.white,
            borderTopLeftRadius: Theme.borderRadius.l,
            borderTopRightRadius: Theme.borderRadius.l,
            borderTopWidth: 0,
            ...Theme.shadows.clay,
            height: 80,
            paddingBottom: Theme.spacing.m,
          },
          default: {
            backgroundColor: Theme.colors.white,
            borderTopLeftRadius: Theme.borderRadius.l,
            borderTopRightRadius: Theme.borderRadius.l,
            borderTopWidth: 0,
            elevation: 10,
            height: 70,
            paddingBottom: Theme.spacing.s,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="docks"
        options={{
          title: 'My Docks',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="cards" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
