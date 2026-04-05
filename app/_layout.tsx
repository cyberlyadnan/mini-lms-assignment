import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, usePathname, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/ErrorBoundary';
import '../global.css';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { useAuthStore } from '../store/authStore';

const queryClient = new QueryClient();

function AuthRedirector() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const lastTarget = useRef<string | null>(null);

  useEffect(() => {
    if (!rootNavigationState?.key) {
      return;
    }

    if (!segments || !pathname) {
      return;
    }

    if (!isInitialized || isLoading) {
      return;
    }

    const firstSegment = segments[0] ?? '';
    const isAuthRoute = firstSegment === '(auth)';
    const isRootRoute = pathname === '/' || pathname === '';

    let target: string | null = null;

    if (isRootRoute) {
      target = isAuthenticated ? '/(tabs)' : '/(auth)/login';
    } else if (isAuthenticated && isAuthRoute) {
      target = '/(tabs)';
    } else if (!isAuthenticated && !isAuthRoute) {
      target = '/(auth)/login';
    }

    if (!target || target === pathname) {
      return;
    }

    if (lastTarget.current === target) {
      return;
    }

    lastTarget.current = target;
    requestAnimationFrame(() => {
      void router.replace(target);
    });
  }, [pathname, isAuthenticated, isInitialized, isLoading, router, rootNavigationState?.key]);

  return null;
}

export default function RootLayout() {
  useNotifications();

  useEffect(() => {
    void useAuthStore.getState().checkAuth();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <>
            <Slot />
            <AuthRedirector />
          </>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
