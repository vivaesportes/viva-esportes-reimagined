
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tgxmuqvwwkxugvyspcwn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneG11cXZ3d2t4dWd2eXNwY3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA1MDUsImV4cCI6MjA2MDgzNjUwNX0.dImvfAModlvq8rqduR_5FOy-K4vDF22ko_uy6OiRc-0';

export function isSupabaseConfigured() {
  return supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'viva_auth_token',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
