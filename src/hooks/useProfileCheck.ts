
import { supabase } from '@/lib/supabase';

export const checkProfileExists = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao verificar perfil:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Erro ao verificar existência do perfil:', error);
    return false;
  }
};
