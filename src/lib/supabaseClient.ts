import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const _supabaseUrl = supabaseUrl;
const _supabaseKey = supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured. ' +
    'The app will continue using mock data. Create a .env file in the project root to connect to Supabase.'
  );
  document.title = `[NO SUPABASE] EdTech Platform`;
} else {
  document.title = `[SUPABASE OK] EdTech Platform`;
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
