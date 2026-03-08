import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ccwtaqwnnsmmjfjmcfns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjd3RhcXdubnNtbWpmam1jZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNTY0MDAsImV4cCI6MjA1NjYzMjQwMH0.placeholder';

// IMPORTANT: Replace SUPABASE_ANON_KEY above with your actual anon/public key
// from Supabase Dashboard > Settings > API > anon public key
// The URL above matches your project. The key needs to be the JWT anon key (starts with eyJ...)

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
