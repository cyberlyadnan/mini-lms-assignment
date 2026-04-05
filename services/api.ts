import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { ApiError } from '../types/api.types';
import { useAuthStore } from '../store/authStore';

const BASE_URL = 'https://api.freeapi.app';
const TIMEOUT = 10000; // 10 seconds

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore token read errors to keep requests flowing
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite 401 loops
      try {
        await useAuthStore.getState().logout();
        router.replace('/(auth)/login');
      } catch {
        // ignore redirect failures
      }
      return Promise.reject(error);
    }

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Exponential Backoff Retry Logic (up to 3 retries)
    originalRequest.retryCount = originalRequest.retryCount || 0;

    if (originalRequest.retryCount < 3) {
      originalRequest.retryCount += 1;
      const backoffDelay = Math.pow(2, originalRequest.retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const isTimeout =
      error.code === 'ECONNABORTED' ||
      (typeof error.message === 'string' && error.message.toLowerCase().includes('timeout'));

    if (isTimeout) {
      return {
        message: 'Request timed out. Please check your internet and try again.',
        statusCode: 408,
      };
    }

    return {
      message: error.response?.data?.message || error.message || 'An expected error occurred',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };
  }
  return {
    message: typeof error === 'string' ? error : 'An unexpected error occurred',
    statusCode: 500,
  };
};
