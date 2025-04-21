
import { createClient } from '@supabase/supabase-js';

// Obtém as variáveis de ambiente do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl) {
  console.error('ERRO: VITE_SUPABASE_URL não está definida no ambiente.');
}

if (!supabaseAnonKey) {
  console.error('ERRO: VITE_SUPABASE_ANON_KEY não está definida no ambiente.');
}

// Cria o cliente Supabase com verificação de valores
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);

// Adiciona uma função para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
