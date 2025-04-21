
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from './types';
import { toast } from '@/hooks/use-toast';

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
        
        // Verifica se o erro é porque o perfil não foi encontrado
        if (error.code === 'PGRST116') {
          console.log('⚠️ Perfil não encontrado. Tentando criar um perfil para o usuário:', userId);
          // Tenta criar um perfil para o usuário
          await createProfile(userId);
          return;
        }
        
        throw error;
      }

      if (data) {
        console.log('✅ Perfil encontrado:', data);
        console.log('🔐 Role do usuário:', data.role);
        setProfile(data as UserProfile);
      } else {
        console.warn('❓ Nenhum perfil encontrado para o usuário ID:', userId);
        // Tenta criar um perfil para o usuário
        await createProfile(userId);
      }
    } catch (error: any) {
      console.error('❌ Erro ao buscar perfil:', error.message);
      toast({
        title: "Erro ao carregar perfil",
        description: "Ocorreu um erro ao buscar seu perfil. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const createProfile = async (userId: string) => {
    try {
      console.log('🔧 Tentando criar perfil para o usuário:', userId);
      
      // Busca informações do usuário
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ Erro ao buscar dados do usuário:', userError.message);
        throw userError;
      }
      
      const email = userData.user?.email || '';
      
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
        throw error;
      }
      
      console.log('✅ Perfil criado com sucesso:', data);
      setProfile(data as UserProfile);
      
      toast({
        title: "Perfil criado",
        description: "Seu perfil foi criado automaticamente.",
      });
      
    } catch (error: any) {
      console.error('❌ Erro ao criar perfil:', error.message);
    }
  };

  return { profile, setProfile, fetchProfile };
};
