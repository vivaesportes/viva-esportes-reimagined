
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  created_at: string;
}

export const useUserManagement = (initialUsers: Usuario[]) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsers);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCriarUsuario = async (formData: {
    nome: string;
    email: string;
    senha: string;
    role: string;
  }) => {
    try {
      if (!formData.nome || !formData.email || !formData.senha) {
        toast({
          title: "Dados incompletos",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        });
        return false;
      }

      setActionLoading(true);
      
      // Primeira etapa: Criar o usuário diretamente no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.senha,
        email_confirm: true, // Isso confirma o email automaticamente
        user_metadata: {
          nome: formData.nome,
          role: formData.role
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: authData.user.id,
            email: formData.email,
            nome: formData.nome,
            role: formData.role
          }])
          .select();

        if (profileError) {
          console.warn("Aviso: O perfil pode ser criado automaticamente via trigger:", profileError);
        }
      }

      toast({
        title: "Usuário criado com sucesso",
        description: `${formData.nome} foi adicionado como ${formData.role === 'admin' ? 'administrador' : 'professor'}`,
      });

      await reloadUsers();
      return true;
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro ao criar o usuário",
        variant: "destructive",
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleExcluirUsuario = async (userId: string) => {
    try {
      setActionLoading(true);
      
      // Call the server-side function to delete the user
      const { error } = await supabase.rpc('delete_user', {
        user_id: userId
      });
      
      if (error) throw error;
      
      // Update the local state by removing the deleted user
      setUsuarios(prevUsuarios => prevUsuarios.filter(user => user.id !== userId));

      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso",
      });
      
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro ao excluir usuário",
        description: error.message || "Ocorreu um erro ao excluir o usuário",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetarSenha = async (email: string) => {
    try {
      if (!email) {
        toast({
          title: "E-mail não informado",
          description: "Informe o e-mail do usuário",
          variant: "destructive",
        });
        return false;
      }

      setActionLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Link de redefinição enviado",
        description: "Um e-mail com instruções foi enviado para o usuário",
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao enviar link de redefinição:', error);
      toast({
        title: "Erro ao enviar link",
        description: error.message || "Ocorreu um erro ao enviar o link de redefinição",
        variant: "destructive",
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const reloadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao recarregar lista de usuários:', error);
        throw error;
      }

      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao recarregar usuários:', error);
    }
  };

  return {
    usuarios,
    setUsuarios,
    actionLoading,
    handleCriarUsuario,
    handleExcluirUsuario,
    handleResetarSenha,
    reloadUsers
  };
};
