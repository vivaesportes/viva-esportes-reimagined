
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '../../types';

export const useFetchProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔎 Buscando perfil para o usuário ID:', userId);
      setError(null);
      setLoading(true);
      
      await validateAuthUser();
      const profileExists = await checkProfileExists(userId);
      
      if (!profileExists) {
        throw new Error('Perfil não encontrado');
      }
      
      return await getFullProfile(userId);
    } catch (error: any) {
      console.error('❌ Erro inesperado ao buscar perfil:', error.message);
      setError(`Erro ao buscar perfil: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validateAuthUser = async () => {
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
    return authUserData.user;
  };

  const checkProfileExists = async (userId: string) => {
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
    
    return !!profileExists;
  };

  const getFullProfile = async (userId: string) => {
    console.log('✅ Perfil existe, buscando dados completos');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('❌ Erro ao buscar perfil:', error.message);
      throw error;
    }

    return data as UserProfile;
  };

  return {
    fetchProfile,
    loading,
    error
  };
};
