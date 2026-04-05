import { useAuthStore } from "../store/authStore";
import type { AuthUser } from "../types/auth.types";
import { LoginRequest, RegisterRequest } from "../types/auth.types";

interface UseAuthResult {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
}

/**
 * Read-only auth state + actions. Session hydration runs once in `app/_layout.tsx`
 * so this hook never re-triggers `checkAuth` on mount (avoids redirect loops).
 */
export const useAuth = (): UseAuthResult => {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    logout,
    register,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    logout,
    register,
  };
};
