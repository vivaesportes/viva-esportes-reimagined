
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserPlus, Key, UserX, Loader2, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'professor'
  });
  const [resetSenha, setResetSenha] = useState({
    email: '',
    id: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCriarUsuario = async () => {
    try {
      if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha) {
        toast({
          title: "Dados incompletos",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        });
        return;
      }

      setActionLoading(true);
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: novoUsuario.email,
        password: novoUsuario.senha,
        email_confirm: true,
        user_metadata: { nome: novoUsuario.nome }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: novoUsuario.role })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Usuário criado com sucesso",
        description: `${novoUsuario.nome} foi adicionado como ${novoUsuario.role === 'admin' ? 'administrador' : 'professor'}`,
      });

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);

      setNovoUsuario({
        nome: '',
        email: '',
        senha: '',
        role: 'professor'
      });
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

      setResetSenha({
        email: '',
        id: ''
      });
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova conta de usuário.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={novoUsuario.nome}
                  onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={novoUsuario.email}
                  onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={novoUsuario.senha}
                  onChange={(e) => setNovoUsuario({...novoUsuario, senha: e.target.value})}
                  placeholder="Senha segura"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Função</Label>
                <Select
                  value={novoUsuario.role}
                  onValueChange={(value) => setNovoUsuario({...novoUsuario, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button onClick={handleCriarUsuario} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                Criar Usuário
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum usuário encontrado no sistema.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Nome</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Email</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Função</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Criado em</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{usuario.nome}</td>
                    <td className="py-3 px-4">{usuario.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        usuario.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {usuario.role === 'admin' ? 'Administrador' : 'Professor'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setResetSenha({
                              email: usuario.email,
                              id: usuario.id
                            });
                            setOpenResetDialog(true);
                          }}
                        >
                          <Key className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Resetar senha</span>
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <UserX className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Excluir</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o usuário {usuario.nome}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleExcluirUsuario(usuario.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <Dialog open={openResetDialog} onOpenChange={setOpenResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir Senha</DialogTitle>
            <DialogDescription>
              Será enviado um e-mail com instruções para redefinir a senha.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="resetEmail">E-mail do usuário</Label>
            <Input
              id="resetEmail"
              type="email"
              value={resetSenha.email}
              onChange={(e) => setResetSenha({...resetSenha, email: e.target.value})}
              placeholder="email@exemplo.com"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenResetDialog(false)}>Cancelar</Button>
            <Button onClick={handleResetarSenha} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Key className="h-4 w-4 mr-2" />}
              Enviar Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
