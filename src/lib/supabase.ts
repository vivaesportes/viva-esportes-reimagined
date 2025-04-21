
import { createClient } from '@supabase/supabase-js';

// Obtém as variáveis de ambiente do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Verifica se as variáveis de ambiente estão definidas e loga avisos
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error('ERRO: VITE_SUPABASE_URL não está definida no ambiente.');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('ERRO: VITE_SUPABASE_ANON_KEY não está definida no ambiente.');
}

// Cria o cliente Supabase com valores válidos
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Adiciona uma função para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
};
