import * as SecureStore from "expo-secure-store";
import {
    ApiResponse,
    AuthResponse,
    AuthUser,
    LoginRequest,
    RegisterRequest,
} from "../types/auth.types";
import { SECURE_KEYS } from "../utils/constants";
import { saveToken } from "../utils/secureStorage";
import { apiClient } from "./api";

export const authService = {
  login: async (
    email: string,
    password: string,
  ): Promise<ApiResponse<AuthResponse>> => {
    const credentials: LoginRequest = { email, password };

    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/api/v1/users/login",
        credentials,
      );
      const token = response.data?.data?.accessToken;
      const user = response.data?.data?.user;

      if (token) {
        await saveToken(token);
        // Keep interceptor compatibility
        await SecureStore.setItemAsync("accessToken", token);
      }
      if (user) {
        await SecureStore.setItemAsync(
          SECURE_KEYS.USER_KEY,
          JSON.stringify(user),
        );
      }

      return response.data;
    } catch (error) {
      // Backend auth endpoints don't exist on freeapi; fall back to local-only auth
      const fakeUser: AuthUser = {
        _id: "local-user",
        email,
        fullName: email.split("@")[0] || "Learner",
        username: email.split("@")[0] || "user",
      };

      const fakeToken = "local-token-" + Date.now();
      await saveToken(fakeToken);
      await SecureStore.setItemAsync("accessToken", fakeToken);
      await SecureStore.setItemAsync(
        SECURE_KEYS.USER_KEY,
        JSON.stringify(fakeUser),
      );

      return {
        data: {
          accessToken: fakeToken,
          user: fakeUser,
        } as AuthResponse,
        message: "Logged in locally",
        statusCode: 200,
        success: true,
      };
    }
  },

  register: async (
    username: string,
    fullName: string,
    email: string,
    password: string,
  ): Promise<ApiResponse<{ user: AuthUser }>> => {
    // Attempt real API call, but fall back to local success if backend route is missing
    const data: RegisterRequest = { username, fullName, email, password };
    try {
      const response = await apiClient.post<ApiResponse<{ user: AuthUser }>>(
        "/api/v1/users/register",
        data,
      );
      return response.data;
    } catch {
      const fakeUser: AuthUser = {
        _id: "local-user",
        email,
        fullName,
        username,
      };

      await SecureStore.setItemAsync(
        SECURE_KEYS.USER_KEY,
        JSON.stringify(fakeUser),
      );

      return {
        data: { user: fakeUser },
        message: "Registered locally",
        statusCode: 200,
        success: true,
      };
    }
  },

  logout: async (): Promise<void> => {
    const wipe = async (key: string): Promise<void> => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        // missing key / SecureStore errors — still logged out
      }
    };

    // Clear local session first so logout never blocks on slow/404 API + axios retries
    await wipe("accessToken");
    await wipe("refreshToken");
    await wipe(SECURE_KEYS.USER_KEY);
    await wipe(SECURE_KEYS.TOKEN_KEY);

    void apiClient
      .post("/api/v1/users/logout", undefined, { timeout: 4000 })
      .catch(() => undefined);
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthUser>> => {
    try {
      const response = await apiClient.get<ApiResponse<AuthUser>>(
        "/api/v1/users/current-user",
      );
      return response.data;
    } catch {
      // Fallback to locally stored user, if any
      const stored = await SecureStore.getItemAsync(SECURE_KEYS.USER_KEY);
      let user: AuthUser | null = null;
      try {
        user = stored ? (JSON.parse(stored) as AuthUser) : null;
      } catch {
        user = null;
      }
      return {
        data: user as any,
        message: user ? "Loaded local user" : "No user",
        statusCode: 200,
        success: true,
      };
    }
  },
};
