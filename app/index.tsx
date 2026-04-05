import { useRootNavigationState, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // 1. Defend against running logic before the router has established its mount hierarchy
    if (!rootNavigationState?.key) return;

    // 2. We also must wait until our app logic (auth) verifies we know WHERE to go
    if (isLoading) return;

    // 3. We use setTimeout of 0 to dispatch the replace to the NEXT event loop tick.
    // This perfectly allows React Navigation to finish its internal DOM commit, completely
    // eliminating the "Attempted to navigate before mounting" error.
    const navigationTimer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 0);

    return () => clearTimeout(navigationTimer);
  }, [isAuthenticated, isLoading, router, rootNavigationState?.key]);

  // Ensure this fallback maintains UI layout without blocking the underlying navigation tree
  return (
    <SafeAreaView className="flex-1 bg-[#0F172A] items-center justify-center">
      <ActivityIndicator size="large" color="#6366F1" />
      <Text className="text-gray-400 text-sm mt-4 tracking-wide font-medium">Starting up...</Text>
    </SafeAreaView>
  );
}
