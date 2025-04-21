
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
        .maybeSingle(); // Usando maybeSingle em vez de single para evitar erros

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error.message);
        
        // Se o erro não for de "não encontrado", registre e retorne o erro
        if (error.code !== 'PGRST116') {
          setProfileError(`Erro ao buscar perfil: ${error.message}`);
          toast({
            title: "Erro ao buscar perfil",
            description: "Ocorreu um erro ao carregar seu perfil. Tentaremos criar um novo.",
            variant: "destructive",
          });
          
          // Tenta criar um perfil para o usuário mesmo assim
          return await createProfile(userId);
        }
        
        console.log('⚠️ Perfil não encontrado. Tentando criar um perfil para o usuário:', userId);
        return await createProfile(userId);
      }

      if (data) {
        console.log('✅ Perfil encontrado:', data);
        console.log('🔐 Role do usuário:', data.role);
        setProfile(data as UserProfile);
        setProfileLoading(false);
        return data as UserProfile;
      } else {
        console.warn('❓ Nenhum perfil encontrado para o usuário ID:', userId);
        // Tenta criar um perfil para o usuário
        return await createProfile(userId);
      }
    } catch (error: any) {
      console.error('❌ Erro inesperado ao buscar perfil:', error.message);
      setProfileError(`Erro ao buscar perfil: ${error.message}`);
      toast({
        title: "Erro ao carregar perfil",
        description: "Ocorreu um erro inesperado. Estamos tentando criar um novo perfil.",
        variant: "destructive",
      });
      
      // Tenta criar um perfil mesmo em caso de erro inesperado
      try {
        return await createProfile(userId);
      } catch (createError: any) {
        console.error('❌ Erro também ao tentar criar perfil:', createError.message);
        setProfileError(`Erro ao criar perfil: ${createError.message}`);
        setProfileLoading(false);
        return null;
      }
    }
  };

  const createProfile = async (userId: string) => {
    try {
      console.log('🔧 Tentando criar perfil para o usuário:', userId);
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
        .maybeSingle();
      
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
      toast({
        title: "Erro ao criar perfil",
        description: error.message || "Ocorreu um erro ao criar seu perfil.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { 
    profile, 
    setProfile, 
    fetchProfile, 
    profileError, 
    profileLoading,
    createProfile 
  };
};
