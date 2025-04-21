
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from './types';
import { toast } from '@/hooks/use-toast';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔎 Buscando perfil para o usuário ID:', userId);
      setProfileError(null);
      setProfileLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error.message);
        setProfileError(`Erro ao buscar perfil: ${error.message}`);
        
        // Tentar criar um novo perfil
        return await createProfile(userId);
      }

      if (data) {
        console.log('✅ Perfil encontrado:', data);
        setProfile(data as UserProfile);
        setProfileLoading(false);
        return data as UserProfile;
      } else {
        console.log('⚠️ Perfil não encontrado. Criando novo perfil...');
        // Perfil não encontrado, vamos criar um
        return await createProfile(userId);
      }
    } catch (error: any) {
      console.error('❌ Erro inesperado ao buscar perfil:', error.message);
      setProfileError(`Erro ao buscar perfil: ${error.message}`);
      
      // Tentar criar um perfil mesmo em caso de erro inesperado
      try {
        return await createProfile(userId);
      } catch (createError: any) {
        console.error('❌ Erro também ao tentar criar perfil:', createError.message);
        setProfileError(`Erro ao criar perfil: ${createError.message}`);
        setProfileLoading(false);
        throw createError;
      }
    }
  };

  const createProfile = async (userId: string) => {
    try {
      console.log('🔧 Criando perfil para o usuário:', userId);
      setProfileLoading(true);
      
      // Busca informações do usuário
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ Erro ao buscar dados do usuário:', userError.message);
        setProfileError(`Erro ao buscar dados do usuário: ${userError.message}`);
        setProfileLoading(false);
        throw userError;
      }
      
      const email = userData.user?.email || '';
      
      // Verificar se o perfil já existe antes de tentar criar (para evitar duplicação)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (existingProfile) {
        console.log('⚠️ Perfil já existe, retornando o existente:', existingProfile);
        setProfile(existingProfile as UserProfile);
        setProfileLoading(false);
        return existingProfile as UserProfile;
      }
      
      // Cria um novo perfil
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          { 
            id: userId,
            email: email,
            nome: email.split('@')[0], // Nome temporário baseado no email
            role: 'professor' // Role padrão
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao criar perfil:', error.message);
        setProfileError(`Erro ao criar perfil: ${error.message}`);
        setProfileLoading(false);
        throw error;
      }
      
      console.log('✅ Perfil criado com sucesso:', data);
      setProfile(data as UserProfile);
      setProfileLoading(false);
      
      toast({
        title: "Perfil criado",
        description: "Seu perfil foi criado automaticamente.",
      });
      
      return data as UserProfile;
      
    } catch (error: any) {
      console.error('❌ Erro ao criar perfil:', error.message);
      setProfileError(`Erro ao criar perfil: ${error.message}`);
      setProfileLoading(false);
      throw error;
    }
  };

  const clearProfile = () => {
    setProfile(null);
    setProfileError(null);
    setProfileLoading(false);
  };

  return { 
    profile, 
    setProfile, 
    fetchProfile, 
    profileError, 
    profileLoading,
    createProfile,
    clearProfile
  };
};
