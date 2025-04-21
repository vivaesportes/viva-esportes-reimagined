
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { CreateUserDialog } from './users/CreateUserDialog';
import { ResetPasswordDialog } from './users/ResetPasswordDialog';
import { UserTable } from './users/UserTable';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  created_at: string;
}

export const UserManagement = ({ usuarios, loading, setUsuarios }: { 
  usuarios: Usuario[], 
  loading: boolean,
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [resetSenha, setResetSenha] = useState({ email: '', id: '' });

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
        return;
      }

      setActionLoading(true);
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.senha,
        email_confirm: true,
        user_metadata: { nome: formData.nome }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: formData.role })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Usuário criado com sucesso",
        description: `${formData.nome} foi adicionado como ${formData.role === 'admin' ? 'administrador' : 'professor'}`,
      });

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
      setOpenDialog(false);
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro ao criar o usuário",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetarSenha = async () => {
    try {
      if (!resetSenha.email) {
        toast({
          title: "E-mail não informado",
          description: "Informe o e-mail do usuário",
          variant: "destructive",
        });
        return;
      }

      setActionLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetSenha.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Link de redefinição enviado",
        description: "Um e-mail com instruções foi enviado para o usuário",
      });

      setResetSenha({ email: '', id: '' });
      setOpenResetDialog(false);
    } catch (error: any) {
      console.error('Erro ao enviar link de redefinição:', error);
      toast({
        title: "Erro ao enviar link",
        description: error.message || "Ocorreu um erro ao enviar o link de redefinição",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExcluirUsuario = async (userId: string) => {
    try {
      setActionLoading(true);
      
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      setUsuarios(usuarios.filter(user => user.id !== userId));

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciar Usuários</CardTitle>
          <CardDescription>
            Lista de todos os usuários cadastrados no sistema
          </CardDescription>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <CreateUserDialog 
            onSubmit={handleCriarUsuario}
            onCancel={() => setOpenDialog(false)}
            loading={actionLoading}
          />
        </Dialog>
      </CardHeader>
      <CardContent>
        <UserTable 
          usuarios={usuarios}
          loading={loading}
          onResetPassword={(email, id) => {
            setResetSenha({ email, id });
            setOpenResetDialog(true);
          }}
          onDeleteUser={handleExcluirUsuario}
        />
      </CardContent>

      <Dialog open={openResetDialog} onOpenChange={setOpenResetDialog}>
        <ResetPasswordDialog
          email={resetSenha.email}
          onSubmit={handleResetarSenha}
          onCancel={() => setOpenResetDialog(false)}
          loading={actionLoading}
        />
      </Dialog>
    </Card>
  );
};
