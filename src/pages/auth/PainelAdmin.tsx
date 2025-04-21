
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import PainelLayout from "@/components/auth/PainelLayout";
import { UserPlus, Users, BookOpen, Trash2, Edit, Key } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface Turma {
  id: string;
  nome: string;
  modalidade: string;
  horario: string;
  dia_semana: string;
  local: string;
  professor_id: string;
  professor_nome?: string;
}

const PainelAdmin = () => {
  const { profile } = useAuth();
  const [professores, setProfessores] = useState<UserProfile[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoProfessorForm, setNovoProfessorForm] = useState({
    nome: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar professores
        const { data: professoresData, error: professoresError } = await supabase
          .from('profiles')
          .select('*')
          .order('nome');

        if (professoresError) throw professoresError;
        
        // Carregar turmas
        const { data: turmasData, error: turmasError } = await supabase
          .from('turmas')
          .select('*, profiles(nome)');

        if (turmasError) throw turmasError;

        // Formatar turmas com nome do professor
        const turmasFormatadas = turmasData.map((turma: any) => ({
          ...turma,
          professor_nome: turma.profiles?.nome || 'Sem professor'
        }));
        
        setProfessores(professoresData || []);
        setTurmas(turmasFormatadas || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do sistema",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const cadastrarProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Criar o usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: novoProfessorForm.email,
        password: novoProfessorForm.password,
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Erro ao criar usuário");
      }

      // 2. Criar o perfil na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: novoProfessorForm.email,
          nome: novoProfessorForm.nome,
          role: 'professor',
          created_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      toast({
        title: "Professor cadastrado com sucesso",
        description: `${novoProfessorForm.nome} foi adicionado ao sistema`,
      });

      // Reset form and refresh list
      setNovoProfessorForm({ nome: "", email: "", password: "" });
      setProfessores([...professores, {
        id: authData.user.id,
        email: novoProfessorForm.email,
        nome: novoProfessorForm.nome,
        role: 'professor',
        created_at: new Date().toISOString(),
      }]);

    } catch (error: any) {
      console.error('Erro ao cadastrar professor:', error);
      toast({
        title: "Erro ao cadastrar professor",
        description: error.message || "Ocorreu um erro ao cadastrar o professor",
        variant: "destructive",
      });
    }
  };

  const excluirProfessor = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o professor ${nome}?`)) {
      return;
    }

    try {
      // 1. Excluir o perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (profileError) throw profileError;

      // 2. Excluir o usuário da autenticação
      const { error: authError } = await supabase.auth.admin.deleteUser(id);

      if (authError) throw authError;

      toast({
        title: "Professor excluído com sucesso",
        description: `${nome} foi removido do sistema`,
      });

      // Atualizar lista de professores
      setProfessores(professores.filter(prof => prof.id !== id));

    } catch (error: any) {
      console.error('Erro ao excluir professor:', error);
      toast({
        title: "Erro ao excluir professor",
        description: error.message || "Ocorreu um erro ao excluir o professor",
        variant: "destructive",
      });
    }
  };

  const resetarSenha = async (email: string) => {
    if (!confirm(`Tem certeza que deseja resetar a senha para ${email}?`)) {
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      toast({
        title: "E-mail de redefinição enviado",
        description: `Um e-mail foi enviado para ${email} com instruções para redefinir a senha`,
      });

    } catch (error: any) {
      console.error('Erro ao resetar senha:', error);
      toast({
        title: "Erro ao resetar senha",
        description: error.message || "Ocorreu um erro ao resetar a senha",
        variant: "destructive",
      });
    }
  };

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Acesso Restrito</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <PainelLayout>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Painel Administrativo</h1>
      <p className="text-gray-500 mb-8">Gerencie professores e turmas da Viva Esportes</p>

      <Tabs defaultValue="professores" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="professores" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Professores
          </TabsTrigger>
          <TabsTrigger value="turmas" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Turmas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="professores">
          <div className="flex justify-end mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-viva-blue hover:bg-viva-darkBlue">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Professor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Professor</DialogTitle>
                </DialogHeader>
                <form onSubmit={cadastrarProfessor} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      placeholder="Nome completo"
                      value={novoProfessorForm.nome}
                      onChange={(e) => setNovoProfessorForm({...novoProfessorForm, nome: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={novoProfessorForm.email}
                      onChange={(e) => setNovoProfessorForm({...novoProfessorForm, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha inicial</Label>
                    <Input
                      id="password"
                      type="password"
                      value={novoProfessorForm.password}
                      onChange={(e) => setNovoProfessorForm({...novoProfessorForm, password: e.target.value})}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-viva-blue hover:bg-viva-darkBlue">
                      Cadastrar Professor
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Professores</CardTitle>
              <CardDescription>
                Gerencie os professores cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
                </div>
              ) : professores.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum professor cadastrado no sistema.
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-sm uppercase bg-gray-100">
                      <tr>
                        <th className="px-4 py-3">Nome</th>
                        <th className="px-4 py-3">E-mail</th>
                        <th className="px-4 py-3">Função</th>
                        <th className="px-4 py-3">Cadastro</th>
                        <th className="px-4 py-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {professores.map((professor) => (
                        <tr key={professor.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{professor.nome}</td>
                          <td className="px-4 py-3">{professor.email}</td>
                          <td className="px-4 py-3">
                            {professor.role === 'admin' ? 'Administrador' : 'Professor'}
                          </td>
                          <td className="px-4 py-3">
                            {new Date(professor.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => excluirProfessor(professor.id, professor.nome)}
                                disabled={professor.role === 'admin'}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => resetarSenha(professor.email)}
                              >
                                <Key className="h-4 w-4" />
                                <span className="sr-only">Resetar senha</span>
                              </Button>
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
        </TabsContent>

        <TabsContent value="turmas">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Turmas</CardTitle>
              <CardDescription>
                Visualize todas as turmas da Viva Esportes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
                </div>
              ) : turmas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma turma cadastrada no sistema.
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-sm uppercase bg-gray-100">
                      <tr>
                        <th className="px-4 py-3">Turma</th>
                        <th className="px-4 py-3">Modalidade</th>
                        <th className="px-4 py-3">Dia/Horário</th>
                        <th className="px-4 py-3">Local</th>
                        <th className="px-4 py-3">Professor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {turmas.map((turma) => (
                        <tr key={turma.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{turma.nome}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-viva-blue/10 text-viva-blue rounded-full text-xs">
                              {turma.modalidade}
                            </span>
                          </td>
                          <td className="px-4 py-3">{turma.dia_semana} - {turma.horario}</td>
                          <td className="px-4 py-3">{turma.local}</td>
                          <td className="px-4 py-3">{turma.professor_nome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PainelLayout>
  );
};

export default PainelAdmin;
