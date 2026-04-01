import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveItem = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error: unknown) {
    throw new Error(`Failed to save async storage item [${key}]: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
  } catch (error: unknown) {
    throw new Error(`Failed to get async storage item [${key}]: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error: unknown) {
    throw new Error(`Failed to remove async storage item [${key}]: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error: unknown) {
    throw new Error(`Failed to clear async storage: ${error instanceof Error ? error.message : String(error)}`);
  }
};
