
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '../types';
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
      
      // Verificar se o usuário existe em auth.users
      const { data: authUserData, error: authUserError } = await supabase.auth.getUser();
      
      if (authUserError) {
        console.error('❌ Erro ao verificar usuário autenticado:', authUserError.message);
        setProfileError(`Erro ao verificar autenticação: ${authUserError.message}`);
        setProfileLoading(false);
        throw authUserError;
      }
      
      if (!authUserData.user) {
        console.error('❌ Nenhum usuário autenticado encontrado');
        setProfileError('Nenhum usuário autenticado encontrado');
        setProfileLoading(false);
        throw new Error('Nenhum usuário autenticado encontrado');
      }
      
      console.log('✅ Usuário autenticado confirmado:', authUserData.user.id);
      
      // Verificar diretamente se o perfil existe com uma consulta simples
      console.log('🔎 Verificando se perfil existe:', userId);
      const { data: profileExists, error: existsError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      if (existsError) {
        console.error('❌ Erro ao verificar existência do perfil:', existsError.message);
        setProfileError(`Erro ao verificar existência do perfil: ${existsError.message}`);
        setProfileLoading(false);
        throw existsError;
      }
      
      if (!profileExists) {
        console.log('⚠️ Perfil não existe. Criando novo perfil...');
        return await createProfile(userId);
      }
      
      console.log('✅ Perfil existe, buscando dados completos');
      
      // Buscar perfil completo
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error.message);
        setProfileError(`Erro ao buscar perfil: ${error.message}`);
        setProfileLoading(false);
        throw error;
      }

      if (data) {
        console.log('✅ Perfil encontrado:', data);
        setProfile(data as UserProfile);
        setProfileLoading(false);
        return data as UserProfile;
      } else {
        console.log('⚠️ Dados do perfil ausentes. Criando novo perfil...');
        return await createProfile(userId);
      }
    } catch (error: any) {
      console.error('❌ Erro inesperado ao buscar perfil:', error.message);
      setProfileError(`Erro ao buscar perfil: ${error.message}`);
      setProfileLoading(false);
      throw error;
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
      
      // Tenta excluir qualquer perfil existente com esse ID para evitar conflitos
      console.log('🧹 Limpando qualquer perfil existente para evitar conflitos');
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (deleteError) {
        console.warn('⚠️ Erro ao limpar perfil existente:', deleteError.message);
        // Continuamos mesmo se houver erro na exclusão
      }
      
      // Cria um novo perfil com retry
      let retryCount = 0;
      const maxRetries = 3;
      let insertError = null;
      let profileData = null;
      
      while (retryCount < maxRetries && !profileData) {
        try {
          console.log(`🔄 Tentativa ${retryCount + 1} de criar perfil`);
          
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
            console.error(`❌ Erro na tentativa ${retryCount + 1}:`, error.message);
            insertError = error;
            retryCount++;
            
            // Pequeno delay antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            profileData = data;
            break;
          }
        } catch (e) {
          console.error(`❌ Exceção na tentativa ${retryCount + 1}:`, e);
          insertError = e;
          retryCount++;
          
          // Pequeno delay antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (!profileData) {
        console.error('❌ Todas as tentativas de criar perfil falharam:', insertError);
        setProfileError(`Erro ao criar perfil após ${maxRetries} tentativas: ${insertError?.message}`);
        setProfileLoading(false);
        throw insertError;
      }
      
      console.log('✅ Perfil criado com sucesso:', profileData);
      setProfile(profileData as UserProfile);
      setProfileLoading(false);
      
      toast({
        title: "Perfil criado",
        description: "Seu perfil foi criado automaticamente.",
      });
      
      return profileData as UserProfile;
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
