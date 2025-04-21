
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tgxmuqvwwkxugvyspcwn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneG11cXZ3d2t4dWd2eXNwY3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA1MDUsImV4cCI6MjA2MDgzNjUwNX0.dImvfAModlvq8rqduR_5FOy-K4vDF22ko_uy6OiRc-0';

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl) && Boolean(supabaseAnonKey);
}

// Helper function to get the correct site URL for redirects
export const getSiteUrl = () => {
  // Production detection - add more domains as needed
  const isProd = window.location.hostname === 'vivaesportes.com.br';
  const productionUrl = 'https://vivaesportes.com.br';
  
  // Development or preview URL
  const developmentUrl = window.location.origin;
  
  console.log("Environment detection:", { isProd, url: isProd ? productionUrl : developmentUrl });
  return isProd ? productionUrl : developmentUrl;
};

// Get login redirect options - used for auth providers that require redirects
export const getLoginRedirectOptions = () => {
  const baseUrl = getSiteUrl();
  return {
    redirectTo: `${baseUrl}/login`,
  };
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'viva_auth_token',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
  },
});
