import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const CHUNK_SIZE = 1800;

const LargeSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const chunkCountStr = await SecureStore.getItemAsync(`${key}_count`);
      if (chunkCountStr) {
        const count = parseInt(chunkCountStr, 10);
        let fullValue = '';
        for (let i = 0; i < count; i++) {
          const chunk = await SecureStore.getItemAsync(`${key}_${i}`);
          if (chunk === null) {
            return null;
          }
          fullValue += chunk;
        }
        return fullValue;
      }
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.warn('LargeSecureStoreAdapter getItem error:', err);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (value.length <= CHUNK_SIZE) {
        await SecureStore.setItemAsync(key, value);
        // Clean up previous chunks if existed
        const chunkCountStr = await SecureStore.getItemAsync(`${key}_count`);
        if (chunkCountStr) {
          const count = parseInt(chunkCountStr, 10);
          for (let i = 0; i < count; i++) {
            await SecureStore.deleteItemAsync(`${key}_${i}`);
          }
          await SecureStore.deleteItemAsync(`${key}_count`);
        }
        return;
      }

      const prevCountStr = await SecureStore.getItemAsync(`${key}_count`);
      const prevCount = prevCountStr ? parseInt(prevCountStr, 10) : 0;

      const chunks: string[] = [];
      for (let i = 0; i < value.length; i += CHUNK_SIZE) {
        chunks.push(value.slice(i, i + CHUNK_SIZE));
      }

      await SecureStore.setItemAsync(`${key}_count`, String(chunks.length));
      for (let i = 0; i < chunks.length; i++) {
        await SecureStore.setItemAsync(`${key}_${i}`, chunks[i]);
      }

      // Delete any surplus chunks if previous value was longer
      for (let i = chunks.length; i < prevCount; i++) {
        await SecureStore.deleteItemAsync(`${key}_${i}`);
      }

      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.warn('LargeSecureStoreAdapter setItem error:', err);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      const chunkCountStr = await SecureStore.getItemAsync(`${key}_count`);
      if (chunkCountStr) {
        const count = parseInt(chunkCountStr, 10);
        for (let i = 0; i < count; i++) {
          await SecureStore.deleteItemAsync(`${key}_${i}`);
        }
        await SecureStore.deleteItemAsync(`${key}_count`);
      }
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.warn('LargeSecureStoreAdapter removeItem error:', err);
    }
  },
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: LargeSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);