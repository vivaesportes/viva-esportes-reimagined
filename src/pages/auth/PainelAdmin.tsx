
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import PainelLayout from '@/components/auth/PainelLayout';
import { 
  Users, 
  UserPlus, 
  Settings, 
  ShieldCheck,
  Trash2,
  UserX,
  Key,
  Eye,
  Plus,
  Edit,
  Lock,
  Unlock,
  BookOpen
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  created_at: string;
}

interface Turma {
  id: string;
  nome: string;
  modalidade: string;
  horario: string;
  dia_semana: string;
  local: string;
  professor_id: string | null;
}

const PainelAdmin = () => {
  const { profile } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [turmasLoading, setTurmasLoading] = useState(true);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'professor'
  });
  const [novaTurma, setNovaTurma] = useState({
    nome: '',
    modalidade: '',
    horario: '',
    dia_semana: '',
    local: '',
    professor_id: ''
  });
  const [resetSenha, setResetSenha] = useState({
    email: '',
    id: ''
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openTurmaDialog, setOpenTurmaDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);

  useEffect(() => {
    console.log("PainelAdmin - Componente montado");
    console.log("PainelAdmin - Perfil do usuário:", profile);
    
    const carregarUsuarios = async () => {
      try {
        if (!profile?.id) return;

        setLoading(true);
        console.log("PainelAdmin - Carregando usuários...");
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        console.log("PainelAdmin - Usuários carregados:", data);
        setUsuarios(data || []);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        toast({
          title: "Erro ao carregar usuários",
          description: "Não foi possível carregar a lista de usuários",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const carregarTurmas = async () => {
      try {
        setTurmasLoading(true);
        const { data, error } = await supabase
          .from('turmas')
          .select('*')
          .order('nome', { ascending: true });

        if (error) throw error;
        setTurmas(data || []);
      } catch (error) {
        console.error('Erro ao carregar turmas:', error);
        toast({
          title: "Erro ao carregar turmas",
          description: "Não foi possível carregar a lista de turmas",
          variant: "destructive",
        });
      } finally {
        setTurmasLoading(false);
      }
    };

    carregarUsuarios();
    carregarTurmas();
  }, [profile?.id]);

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

      setLoading(true);
      
      // 1. Criar o usuário no supabase auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: novoUsuario.email,
        password: novoUsuario.senha,
        email_confirm: true,
        user_metadata: { nome: novoUsuario.nome }
      });

      if (authError) throw authError;

      // 2. Atualizar o perfil com o role correto (o trigger já criou o perfil básico)
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

      // Recarregar a lista de usuários
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);

      // Limpar o formulário e fechar o diálogo
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
      setLoading(false);
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

      setLoading(true);
      
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
      setLoading(false);
    }
  };

  const handleExcluirUsuario = async (userId: string) => {
    try {
      setLoading(true);
      
      // Excluir o usuário do Auth (isso também exclui o perfil devido à cascata)
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      // Atualizar a lista local de usuários
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
      setLoading(false);
    }
  };

  const handleCriarTurma = async () => {
    try {
      if (!novaTurma.nome || !novaTurma.modalidade || !novaTurma.horario || !novaTurma.dia_semana || !novaTurma.local) {
        toast({
          title: "Dados incompletos",
          description: "Preencha todos os campos obrigatórios da turma",
          variant: "destructive",
        });
        return;
      }

      setTurmasLoading(true);
      
      // Criar a turma
      const { data, error } = await supabase
        .from('turmas')
        .insert([
          {
            nome: novaTurma.nome,
            modalidade: novaTurma.modalidade,
            horario: novaTurma.horario,
            dia_semana: novaTurma.dia_semana,
            local: novaTurma.local,
            professor_id: novaTurma.professor_id || null
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Turma criada com sucesso",
        description: `A turma ${novaTurma.nome} foi adicionada`,
      });

      // Adicionar a nova turma à lista
      if (data && data.length > 0) {
        setTurmas([...turmas, data[0]]);
      }

      // Limpar o formulário e fechar o diálogo
      setNovaTurma({
        nome: '',
        modalidade: '',
        horario: '',
        dia_semana: '',
        local: '',
        professor_id: ''
      });
      setOpenTurmaDialog(false);
    } catch (error: any) {
      console.error('Erro ao criar turma:', error);
      toast({
        title: "Erro ao criar turma",
        description: error.message || "Ocorreu um erro ao criar a turma",
        variant: "destructive",
      });
    } finally {
      setTurmasLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
      </div>
    );
  }

  return (
    <PainelLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <ShieldCheck className="mr-2 h-6 w-6 text-purple-600" />
          Painel de Administração
        </h1>
        <p className="text-gray-500">Gerencie usuários, turmas e configurações do sistema</p>
      </div>

      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="usuarios" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="turmas" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Turmas
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios">
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
                    <Button onClick={handleCriarUsuario} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
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
          </Card>

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
                <Button onClick={handleResetarSenha} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Key className="h-4 w-4 mr-2" />}
                  Enviar Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="turmas">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gerenciar Turmas</CardTitle>
                <CardDescription>
                  Lista de todas as turmas cadastradas no sistema
                </CardDescription>
              </div>
              <Dialog open={openTurmaDialog} onOpenChange={setOpenTurmaDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Turma
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Turma</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar uma nova turma.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome-turma">Nome da Turma</Label>
                      <Input
                        id="nome-turma"
                        value={novaTurma.nome}
                        onChange={(e) => setNovaTurma({...novaTurma, nome: e.target.value})}
                        placeholder="Ex: Ballet Infantil"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="modalidade">Modalidade</Label>
                      <Input
                        id="modalidade"
                        value={novaTurma.modalidade}
                        onChange={(e) => setNovaTurma({...novaTurma, modalidade: e.target.value})}
                        placeholder="Ex: Ballet, Judô, Futebol"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="dia-semana">Dia da Semana</Label>
                        <Select
                          value={novaTurma.dia_semana}
                          onValueChange={(value) => setNovaTurma({...novaTurma, dia_semana: value})}
                        >
                          <SelectTrigger id="dia-semana">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Segunda">Segunda</SelectItem>
                            <SelectItem value="Terça">Terça</SelectItem>
                            <SelectItem value="Quarta">Quarta</SelectItem>
                            <SelectItem value="Quinta">Quinta</SelectItem>
                            <SelectItem value="Sexta">Sexta</SelectItem>
                            <SelectItem value="Sábado">Sábado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="horario">Horário</Label>
                        <Input
                          id="horario"
                          value={novaTurma.horario}
                          onChange={(e) => setNovaTurma({...novaTurma, horario: e.target.value})}
                          placeholder="Ex: 14:00 - 15:30"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="local">Local</Label>
                      <Input
                        id="local"
                        value={novaTurma.local}
                        onChange={(e) => setNovaTurma({...novaTurma, local: e.target.value})}
                        placeholder="Ex: Sala 3, Quadra A"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="professor">Professor (opcional)</Label>
                      <Select
                        value={novaTurma.professor_id}
                        onValueChange={(value) => setNovaTurma({...novaTurma, professor_id: value})}
                      >
                        <SelectTrigger id="professor">
                          <SelectValue placeholder="Selecione um professor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">-- Sem professor --</SelectItem>
                          {usuarios
                            .filter(u => u.role === 'professor')
                            .map(professor => (
                              <SelectItem key={professor.id} value={professor.id}>
                                {professor.nome}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenTurmaDialog(false)}>Cancelar</Button>
                    <Button onClick={handleCriarTurma} disabled={turmasLoading}>
                      {turmasLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                      Criar Turma
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {turmasLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
                </div>
              ) : turmas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma turma encontrada no sistema.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {turmas.map((turma) => {
                    const professor = usuarios.find(u => u.id === turma.professor_id);
                    
                    return (
                      <Card key={turma.id} className="overflow-hidden">
                        <div className="bg-viva-blue/10 px-4 py-2 flex justify-between items-center">
                          <h3 className="font-medium">{turma.nome}</h3>
                          <span className="badge bg-viva-blue text-white px-2 py-1 rounded-full text-xs">
                            {turma.modalidade}
                          </span>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Dia:</span>
                              <span className="font-medium">{turma.dia_semana}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Horário:</span>
                              <span className="font-medium">{turma.horario}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Local:</span>
                              <span className="font-medium">{turma.local}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Professor:</span>
                              <span className="font-medium">{professor?.nome || "Não atribuído"}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 p-2 bg-gray-50 border-t">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a turma {turma.nome}? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configurações gerais para a plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-lg">Backup do Sistema</h3>
                    <p className="text-gray-500 text-sm">Faça o download de um backup completo dos dados</p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Baixar Backup
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-lg">Manutenção do Sistema</h3>
                    <p className="text-gray-500 text-sm">Ative o modo de manutenção para bloquear o acesso ao site</p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Unlock className="h-4 w-4" />
                    Ativar Manutenção
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-lg">Notificações</h3>
                    <p className="text-gray-500 text-sm">Configure as notificações por e-mail do sistema</p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PainelLayout>
  );
};

export default PainelAdmin;
