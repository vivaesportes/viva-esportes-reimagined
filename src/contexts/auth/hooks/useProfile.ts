
import { useState } from 'react';
import { UserProfile } from '../types';
import { useCreateProfile } from './profile/useCreateProfile';
import { useFetchProfile } from './profile/useFetchProfile';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { createProfile, loading: createLoading, error: createError } = useCreateProfile();
  const { fetchProfile, loading: fetchLoading, error: fetchError } = useFetchProfile();

  const fetchProfileWithFallback = async (userId: string) => {
    try {
      const profileData = await fetchProfile(userId);
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.log('⚠️ Perfil não encontrado. Criando novo perfil...');
      const newProfile = await createProfile(userId);
      setProfile(newProfile);
      return newProfile;
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
