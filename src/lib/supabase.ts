
import { createClient } from '@supabase/supabase-js';

// Obtém as variáveis de ambiente do Supabase
const supabaseUrl = "https://tgxmuqvwwkxugvyspcwn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneG11cXZ3d2t4dWd2eXNwY3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA1MDUsImV4cCI6MjA2MDgzNjUwNX0.dImvfAModlvq8rqduR_5FOy-K4vDF22ko_uy6OiRc-0";

// Cria o cliente Supabase com valores válidos
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Adiciona uma função para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
