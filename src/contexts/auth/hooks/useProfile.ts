
import { useState } from 'react';
import { UserProfile } from '../types';
import { useCreateProfile } from './profile/useCreateProfile';
import { useFetchProfile } from './profile/useFetchProfile';
import { toast } from '@/hooks/use-toast';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { createProfile, loading: createLoading, error: createError } = useCreateProfile();
  const { fetchProfile, loading: fetchLoading, error: fetchError } = useFetchProfile();

  const fetchProfileWithFallback = async (userId: string) => {
    console.log('🔄 Iniciando busca de perfil com fallback para:', userId);
    
    try {
      // Try to fetch existing profile
      console.log('🔍 Tentando buscar perfil existente');
      const profileData = await fetchProfile(userId);
      console.log('✅ Perfil encontrado:', profileData);
      setProfile(profileData);
      return profileData;
    } catch (error: any) {
      console.log('⚠️ Perfil não encontrado. Erro:', error.message);
      
      // If profile not found, try to create a new one
      try {
        console.log('🆕 Criando novo perfil para:', userId);
        const newProfile = await createProfile(userId);
        console.log('✅ Novo perfil criado:', newProfile);
        setProfile(newProfile);
        toast({
          title: "Perfil criado",
          description: "Seu perfil foi criado com sucesso.",
        });
        return newProfile;
      } catch (createError: any) {
        console.error('❌ Erro ao criar perfil:', createError.message);
        toast({
          title: "Erro ao criar perfil",
          description: "Não foi possível criar seu perfil. Por favor tente novamente.",
          variant: "destructive",
        });
        throw createError;
      }
    }
  };

  const clearProfile = () => {
    setProfile(null);
  };

  return {
    profile,
    setProfile,
    fetchProfile: fetchProfileWithFallback,
    profileError: fetchError || createError,
    profileLoading: fetchLoading || createLoading,
    createProfile,
    clearProfile
  };
};
