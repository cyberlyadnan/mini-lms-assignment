import { create } from "zustand";
import { authService } from "../services/authService";
import {
  ApiResponse,
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";
import { SECURE_KEYS } from "../utils/constants";
import {
  getSecureItem,
  getToken,
  removeSecureItem,
  removeToken,
  saveSecureItem,
} from "../utils/secureStorage";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
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
  isInitialized: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });

    try {
      const res = await authService.login(
        credentials.email || "",
        credentials.password,
      );

      const authPayload = (res as ApiResponse<AuthResponse>).data ?? res;
      const token = authPayload?.accessToken ?? null;
      const user = authPayload?.user ?? null;

      if (user) {
        await saveSecureItem(SECURE_KEYS.USER_KEY, JSON.stringify(user));
      }

      set({
        user,
        token,
        isAuthenticated: !!token,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error: any) {
      set({
        error: error.message || "Login failed",
        isLoading: false,
        isInitialized: true,
      });
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(
        data.username,
        data.fullName,
        data.email,
        data.password,
      );
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, isAuthenticated: false });
    try {
      await authService.logout();
      await removeToken().catch(() => undefined);
      await removeSecureItem(SECURE_KEYS.USER_KEY).catch(() => undefined);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      await removeToken().catch(() => undefined);
      await removeSecureItem(SECURE_KEYS.USER_KEY).catch(() => undefined);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Logout failed",
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = await getToken();

      if (!token) {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      } else {
        const userStr = await getSecureItem(SECURE_KEYS.USER_KEY);

        let user: AuthUser | null = null;
        try {
          user = userStr ? JSON.parse(userStr) : null;
        } catch {
          user = null;
        }

        set({
          token,
          user,
          isAuthenticated: true,
        });

        // Background refresh (NO return here)
        const isLocalSession = token.startsWith("local-token-");

        if (!isLocalSession) {
          void (async () => {
            try {
              const res = await authService.getCurrentUser();
              if (res.data) {
                await saveSecureItem(
                  SECURE_KEYS.USER_KEY,
                  JSON.stringify(res.data),
                );
                set({ user: res.data });
              }
            } catch {
              // silent fail
            }
          })();
        }
      }
    } catch {
      await removeToken();
      await removeSecureItem(SECURE_KEYS.USER_KEY);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: "Session expired",
      });
    } finally {
      set({
        isLoading: false,
        isInitialized: true, // 🔥 ALWAYS RUNS NOW
      });
    }
  },
}));
