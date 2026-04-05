import { create } from 'zustand';
import { saveItem, getItem } from '../utils/asyncStorage';
import { ASYNC_KEYS } from '../utils/constants';

interface PreferenceState {
  lastOpenedAt: string | null;
  hasOnboarded: boolean;
  theme: 'light' | 'dark' | 'system';
}

interface PreferenceActions {
  updateLastOpened: () => Promise<void>;
  setOnboarded: (value: boolean) => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  loadPreferences: () => Promise<void>;
}

export const usePreferenceStore = create<PreferenceState & PreferenceActions>((set) => ({
  lastOpenedAt: null,
  hasOnboarded: false,
  theme: 'system',

  updateLastOpened: async () => {
    const now = new Date().toISOString();
    set({ lastOpenedAt: now });
    await saveItem(ASYNC_KEYS.LAST_OPENED_KEY, now);
  },

  setOnboarded: async (value: boolean) => {
    set({ hasOnboarded: value });
    
    // Save to unified PREFERENCES_KEY
    const prefs = await getItem<Partial<PreferenceState>>(ASYNC_KEYS.PREFERENCES_KEY) || {};
    await saveItem(ASYNC_KEYS.PREFERENCES_KEY, { ...prefs, hasOnboarded: value });
  },

  setTheme: async (theme: 'light' | 'dark' | 'system') => {
    set({ theme });
    
    const prefs = await getItem<Partial<PreferenceState>>(ASYNC_KEYS.PREFERENCES_KEY) || {};
    await saveItem(ASYNC_KEYS.PREFERENCES_KEY, { ...prefs, theme });
  },

  loadPreferences: async () => {
    try {
      const lastOpened = await getItem<string>(ASYNC_KEYS.LAST_OPENED_KEY);
      const prefs = await getItem<Partial<PreferenceState>>(ASYNC_KEYS.PREFERENCES_KEY);
      
      set({
        lastOpenedAt: lastOpened || null,
        hasOnboarded: prefs?.hasOnboarded ?? false,
        theme: prefs?.theme ?? 'system',
      });
    } catch {
      // keep defaults if preference loading fails
    }
  }
}));
