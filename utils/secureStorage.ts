import * as SecureStore from 'expo-secure-store';
import { SECURE_KEYS } from './constants';

export const saveSecureItem = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error: unknown) {
    throw new Error(`Failed to save secure item [${key}]: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error: unknown) {
    throw new Error(`Failed to get secure item [${key}]: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const removeSecureItem = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error: unknown) {
    throw new Error(`Failed to remove secure item [${key}]: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const saveToken = async (token: string): Promise<void> => {
  return saveSecureItem(SECURE_KEYS.TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return getSecureItem(SECURE_KEYS.TOKEN_KEY);
};

export const removeToken = async (): Promise<void> => {
  return removeSecureItem(SECURE_KEYS.TOKEN_KEY);
};
