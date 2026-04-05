import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { useNotifications } from '../hooks/useNotifications';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useAuthStore } from '../store/authStore';

const queryClient = new QueryClient();

export default function RootLayout() {
  useNotifications();

  // Hydrate session once at app root — not inside index/login (prevents duplicate checkAuth + nav loops)
  useEffect(() => {
    void useAuthStore.getState().checkAuth();
  }, []);

  // CRITICAL FIX: To prevent "Attempted to navigate before mounting", the layout MUST
  // return a Navigator (like Stack) or Slot directly on the very first render.
  // We removed the nested `InitialLayout` component boundary which delayed mounting.
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0F172A' } }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
