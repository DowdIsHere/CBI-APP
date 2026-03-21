import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

const SUPABASE_URL: string = extra.supabaseUrl;
const SUPABASE_ANON_KEY: string = extra.supabaseAnonKey;

export const isDemoMode = !SUPABASE_URL || !SUPABASE_ANON_KEY;

if (isDemoMode) {
  console.warn(
    'Supabase credentials missing — running in demo mode.'
  );
}

export const supabase: SupabaseClient = isDemoMode
  ? (null as unknown as SupabaseClient)
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
