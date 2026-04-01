import { apiClient } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse, AuthUser } from '../types/auth.types';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const credentials: LoginRequest = { email, password };
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/v1/users/login', credentials);
    if (response.data?.data?.accessToken) {
      await SecureStore.setItemAsync('accessToken', response.data.data.accessToken);
    }
    if (response.data?.data?.refreshToken) {
      await SecureStore.setItemAsync('refreshToken', response.data.data.refreshToken);
    }
    return response.data;
  },

  register: async (username: string, fullName: string, email: string, password: string): Promise<ApiResponse<{ user: AuthUser }>> => {
    const data: RegisterRequest = { username, fullName, email, password };
    const response = await apiClient.post<ApiResponse<{ user: AuthUser }>>('/api/v1/users/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/api/v1/users/logout');
    } catch (error) {
      // Ignored if it fails due to network/token issues
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.get<ApiResponse<AuthUser>>('/api/v1/users/current-user');
    return response.data;
  }
};
