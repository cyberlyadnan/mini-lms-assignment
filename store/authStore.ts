import { create } from 'zustand';
import { AuthUser, LoginRequest, RegisterRequest } from '../types/auth.types';
import { authService } from '../services/authService';
import { saveToken, removeToken, getToken, saveSecureItem, getSecureItem, removeSecureItem } from '../utils/secureStorage';
import { SECURE_KEYS } from '../utils/constants';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(credentials.email || '', credentials.password);
      const token = res.data?.accessToken || null;
      const user = res.data?.user || null;
      
      // authService.login already persists the token, but we ensure it matches state.
      // We manually persist user data since SecureStore handles simple strings securely.
      if (user) {
        await saveSecureItem(SECURE_KEYS.USER_KEY, JSON.stringify(user));
      }

      set({ 
        user, 
        token, 
        isAuthenticated: !!token, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(data.username, data.fullName, data.email, data.password);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout(); // Automatically clears Token in SecureStore
      await removeSecureItem(SECURE_KEYS.USER_KEY);
      
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Logout failed', 
        isLoading: false 
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      if (!token) {
        set({ isAuthenticated: false, user: null, token: null });
        return;
      }

      const userStr = await getSecureItem(SECURE_KEYS.USER_KEY);
      let user: AuthUser | null = null;
      try {
        user = userStr ? (JSON.parse(userStr) as AuthUser) : null;
      } catch {
        user = null;
      }

      set({
        token,
        user,
        isAuthenticated: true,
      });

      // Local-only auth: never hit the network on boot (avoids long retries / hangs).
      const isLocalSession = token.startsWith('local-token-');
      if (isLocalSession) {
        return;
      }

      // Remote session: refresh profile in background without blocking cold start forever
      void (async () => {
        try {
          const res = await authService.getCurrentUser();
          if (res.data) {
            await saveSecureItem(SECURE_KEYS.USER_KEY, JSON.stringify(res.data));
            set({ user: res.data });
          }
        } catch {
          // Keep cached user from SecureStore
        }
      })();
    } catch {
      await removeToken();
      await removeSecureItem(SECURE_KEYS.USER_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: 'Session expired',
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
