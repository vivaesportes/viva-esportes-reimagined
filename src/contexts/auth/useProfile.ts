
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from './types';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔎 Buscando perfil para o usuário ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error.message);
        throw error;
      }

      if (data) {
        console.log('✅ Perfil encontrado:', data);
        console.log('🔐 Role do usuário:', data.role);
        setProfile(data as UserProfile);
      } else {
        console.warn('❓ Nenhum perfil encontrado para o usuário ID:', userId);
      }
    } catch (error: any) {
      console.error('❌ Erro ao buscar perfil:', error.message);
    }
  };

  return { profile, setProfile, fetchProfile };
};
