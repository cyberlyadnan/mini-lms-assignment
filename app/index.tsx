import { useRootNavigationState, useRouter, type Href } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

/**
 * Splash / router entry: runs once per app session, then sends the user to tabs or login.
 * `hasRedirected` prevents re-running when `rootNavigationState.key` changes after logout/login
 * (that was causing an infinite replace loop on the login screen).
 */
export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) {
      return;
    }
    if (!rootNavigationState?.key) {
      return;
    }
    if (!isInitialized) {
      return;
    }
    if (isLoading) {
      return;
    }

    hasRedirected.current = true;

    const target: Href = isAuthenticated ? '/(tabs)' : '/(auth)/login';
    const navigationTimer = setTimeout(() => {
      router.replace(target);
    }, 0);

    return () => clearTimeout(navigationTimer);
  }, [isAuthenticated, isLoading, router, rootNavigationState?.key]);

  const isStartingUp = !isInitialized || isLoading;

  if (!isStartingUp) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A] items-center justify-center">
      <ActivityIndicator size="large" color="#6366F1" />
      <Text className="text-gray-400 text-sm mt-4 tracking-wide font-medium">Starting up…</Text>
    </SafeAreaView>
  );
}
