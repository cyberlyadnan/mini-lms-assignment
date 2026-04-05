import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { LoginRequest, RegisterRequest } from '../types/auth.types';

interface UseAuthResult {
  user: ReturnType<typeof useAuthStore.getState>['user'];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
}

export const useAuth = (): UseAuthResult => {
  const { user, isAuthenticated, isLoading, login, logout, register, checkAuth } = useAuthStore();

  useEffect((): void => {
    void checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };
};

