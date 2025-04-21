
import { createClient } from '@supabase/supabase-js';

// Obtém as variáveis de ambiente do Supabase
const supabaseUrl = "https://tgxmuqvwwkxugvyspcwn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneG11cXZ3d2t4dWd2eXNwY3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA1MDUsImV4cCI6MjA2MDgzNjUwNX0.dImvfAModlvq8rqduR_5FOy-K4vDF22ko_uy6OiRc-0";

// Configura as URLs com base no ambiente atual
const getSiteUrl = () => {
  // Verifica se estamos em produção (vivaesportes.com.br)
  if (window.location.hostname === 'vivaesportes.com.br') {
    return 'https://vivaesportes.com.br';
  }
  
  // Para desenvolvimento local ou ambiente Lovable
  const currentUrl = window.location.origin;
  console.log("URL atual detectada:", currentUrl);
  return currentUrl;
};

// Cria o cliente Supabase com valores válidos e configurações explícitas para autenticação
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  }
});

// Adiciona uma função para configurar o site de redirecionamento
export const getRedirectUrl = () => {
  const siteUrl = getSiteUrl();
  const redirectUrl = `${siteUrl}/login`;
  console.log("URL de redirecionamento configurada:", redirectUrl);
  return redirectUrl;
};

// Função para usar no processo de login
export const getLoginRedirectOptions = () => {
  return {
    redirectTo: getRedirectUrl()
  };
};

// Adiciona uma função para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
