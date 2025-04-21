
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '../../types';
import { toast } from '@/hooks/use-toast';

export const useFetchProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔎 Buscando perfil para o usuário ID:', userId);
      setError(null);
      setLoading(true);
      
      // First, verify that the user is actually authenticated
      const { data: authUserData, error: authUserError } = await supabase.auth.getUser();
      
      if (authUserError) {
        console.error('❌ Erro ao verificar usuário autenticado:', authUserError.message);
        throw authUserError;
      }
      
      if (!authUserData.user) {
        console.error('❌ Nenhum usuário autenticado encontrado');
        throw new Error('Nenhum usuário autenticado encontrado');
      }
      
      console.log('✅ Usuário autenticado confirmado:', authUserData.user.id);
      
      // Then check if the profile exists
      console.log('🔎 Verificando se perfil existe:', userId);
      const { data: profileExists, error: existsError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      if (existsError) {
        console.error('❌ Erro ao verificar existência do perfil:', existsError.message);
        throw existsError;
      }
      
      // If profile doesn't exist, throw an error to trigger profile creation
      if (!profileExists) {
        console.error('❌ Perfil não encontrado');
        throw new Error('Perfil não encontrado');
      }
      
      console.log('✅ Perfil existe, buscando dados completos');
      
      // Get the full profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error.message);
        throw error;
      }

      if (!data) {
        console.error('❌ Dados do perfil vazios');
        throw new Error('Dados do perfil vazios');
      }

      console.log('✅ Perfil carregado com sucesso:', data);
      return data as UserProfile;
    } catch (error: any) {
      console.error('❌ Erro inesperado ao buscar perfil:', error.message);
      setError(`Erro ao buscar perfil: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProfile,
    loading,
    error
  };
};
