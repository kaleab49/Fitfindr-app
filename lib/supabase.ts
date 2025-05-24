import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://jzyuqqcduuzujucyzkqi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eXVxcWNkdXV6dWp1Y3l6a3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTczODQsImV4cCI6MjA2MDQ5MzM4NH0.DlQHtvLF7axFKpChHKori535eHvcPqvGli-4EbWq24g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 