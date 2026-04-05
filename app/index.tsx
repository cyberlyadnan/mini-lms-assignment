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
    // Wait until the root layout has mounted and authentication check completes
    if (isLoading || !rootNavigationState?.key) return;

    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, router, rootNavigationState?.key]);

  return (
    <SafeAreaView className="flex-1 bg-[#0F172A] items-center justify-center">
      <ActivityIndicator size="large" color="#6366F1" />
      <Text className="text-white text-lg mt-4">Loading application...</Text>
    </SafeAreaView>
  );
}
