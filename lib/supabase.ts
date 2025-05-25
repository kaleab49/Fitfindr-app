import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://jzyuqqcduuzujucyzkqi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eXVxcWNkdXV6dWp1Y3l6a3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTczODQsImV4cCI6MjA2MDQ5MzM4NH0.DlQHtvLF7axFKpChHKori535eHvcPqvGli-4EbWq24g';

// Create a custom storage adapter that safely handles SSR
const customStorage = {
  getItem: async (key: string) => {
    try {
      if (typeof window === 'undefined') {
        return null;
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 