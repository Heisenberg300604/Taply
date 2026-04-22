import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import '../globals.css';

import { useAuthStore } from '@/store/authStore';
import AnimatedSplashScreen from '../components/AnimatedSplashScreen';

SplashScreen.preventAutoHideAsync();

// ─── Navigation Guard ────────────────────────────────────────────────────────
// Placed AFTER <Stack> in the tree so the navigator is guaranteed to be
// mounted before any router.replace() call is made.
function NavigationGuard() {
  const { session, isLoading, hasCompletedOnboarding } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!session) {
      // No session — must be in onboarding or auth flow
      if (!inAuthGroup && !inOnboardingGroup) {
        // Landed somewhere else (e.g. tabs) — send to onboarding/intro
        router.replace('/onboarding/onboarding1');
      }
      // Already in auth or onboarding — let them stay; no redirect needed
    } else if (!hasCompletedOnboarding) {
      // Logged in but hasn't finished onboarding yet
      if (!inOnboardingGroup) {
        router.replace('/onboarding/onboarding1');
      }
      // Already in onboarding — let them proceed
    } else {
      // Fully authenticated AND onboarding complete — go to main app
      if (inAuthGroup || inOnboardingGroup) {
        router.replace('/(tabs)/home');
      }
      // Already in tabs — stay put
    }
  }, [session, isLoading, hasCompletedOnboarding, segments]);

  return null;
}

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout() {
  const { initialize } = useAuthStore();
  const [fontsLoaded] = useFonts({
    Manrope: Manrope_800ExtraBold,
    ManropeRegular: Manrope_400Regular,
    ManropeSemiBold: Manrope_600SemiBold,
    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      const timer = setTimeout(() => setShowSplash(false), 2400);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  if (showSplash) {
    return <AnimatedSplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
        <NavigationGuard />
        <LoadingOverlay />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function LoadingOverlay() {
  const { isLoading } = useAuthStore();
  if (!isLoading) return null;
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(252, 249, 248, 0.8)', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#3525cd" />
    </View>
  );
}
