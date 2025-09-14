import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://rmrbmjttzrwlbaiegttc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcmJtanR0enJ3bGJhaWVndHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjUxMjgsImV4cCI6MjA3MjY0MTEyOH0.-d_NCqtWEszAJKzrDC1fkGkZj3eOq8-PwEdtaPP7x3Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: {
      getItem: async (key: string) => {
        // Use AsyncStorage for React Native
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        return await AsyncStorage.getItem(key);
      },
      setItem: async (key: string, value: string) => {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem(key, value);
      },
      removeItem: async (key: string) => {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.removeItem(key);
      },
    },
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Database types
export interface UserProfile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseExpense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}