
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '../../types';
import { toast } from '@/hooks/use-toast';

export const useCreateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProfile = async (userId: string) => {
    try {
      console.log('🔧 Criando perfil para o usuário:', userId);
      setLoading(true);
      setError(null);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ Erro ao buscar dados do usuário:', userError.message);
        setError(`Erro ao buscar dados do usuário: ${userError.message}`);
        throw userError;
      }
      
      const email = userData.user?.email || '';
      
      // Limpa perfis existentes
      await cleanExistingProfile(userId);
      
      // Tenta criar perfil com retry
      const profileData = await retryProfileCreation(userId, email);
      
      if (!profileData) {
        throw new Error('Falha ao criar perfil após várias tentativas');
      }
      
      console.log('✅ Perfil criado com sucesso:', profileData);
      toast({
        title: "Perfil criado",
        description: "Seu perfil foi criado automaticamente.",
      });
      
      return profileData as UserProfile;
    } catch (error: any) {
      console.error('❌ Erro ao criar perfil:', error.message);
      setError(`Erro ao criar perfil: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cleanExistingProfile = async (userId: string) => {
    console.log('🧹 Limpando perfil existente para evitar conflitos');
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
      
    if (deleteError) {
      console.warn('⚠️ Erro ao limpar perfil existente:', deleteError.message);
    }
  };

  const retryProfileCreation = async (userId: string, email: string) => {
    let retryCount = 0;
    const maxRetries = 3;
    let profileData = null;
    
    while (retryCount < maxRetries && !profileData) {
      try {
        console.log(`🔄 Tentativa ${retryCount + 1} de criar perfil`);
        
        const { data, error } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId,
            email: email,
            nome: email.split('@')[0],
            role: 'professor'
          }])
          .select()
          .maybeSingle();
        
        if (error) throw error;
        profileData = data;
        break;
      } catch (error) {
        console.error(`❌ Erro na tentativa ${retryCount + 1}:`, error);
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return profileData;
  };

  return {
    createProfile,
    loading,
    error
  };
};
