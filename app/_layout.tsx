import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { AppwriteProvider, useAppwrite } from '../contexts/AppwriteContext';

import { Theme } from '../constants/Theme';

// Separate component to handle the hook usage safely inside Provider
const InitialLayout = () => {
  const { user, loading } = useAppwrite();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (loading) return;

    // @ts-ignore
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // If not logged in and not in auth group, redirect to sign-in
      // @ts-ignore
      router.replace('/(auth)/sign-in');
    } else if (user && inAuthGroup && pathname !== '/forgot-password' && pathname !== '/sign-up') {
      // If logged in and in auth group, redirect to home (except when in mid-auth flow)
      // @ts-ignore
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background }}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="learn" options={{ presentation: 'card' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      {!['/', '/index', '/profile', '/docks', '/sign-in', '/sign-up', '/settings', '/forgot-password'].includes(pathname) && (
        <TouchableOpacity
          style={[styles.backButton, { top: (insets.top || 20) + Theme.spacing.s }]}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require('../assets/images/return.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: Theme.spacing.m,
    zIndex: 100,
    padding: Theme.spacing.s,
    // Ensure it has a background if needed, or transparent? 
    // Usually transparent for just an icon.
  },
  backIcon: {
    width: 24,
    height: 24,
    opacity: 0.5,
    resizeMode: 'contain',
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <AppwriteProvider>
          <InitialLayout />
        </AppwriteProvider>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
