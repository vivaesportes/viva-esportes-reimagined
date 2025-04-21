
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import PainelLayout from "@/components/auth/PainelLayout";
import { UserCircle, UsersRound, BookOpen, LogOut } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Turma {
  id: string;
  nome: string;
  modalidade: string;
  horario: string;
  dia_semana: string;
  local: string;
}

const PainelProfessor = () => {
  const { profile, signOut } = useAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarTurmas = async () => {
      try {
        if (!profile?.id) return;

        const { data, error } = await supabase
          .from('turmas')
          .select('*')
          .eq('professor_id', profile.id);

        if (error) throw error;
        setTurmas(data || []);
      } catch (error) {
        console.error('Erro ao carregar turmas:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarTurmas();
  }, [profile?.id]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
      </div>
    );
  }

  return (
    <PainelLayout>
      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="perfil" className="flex items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            Meu Perfil
          </TabsTrigger>
          <TabsTrigger value="turmas" className="flex items-center">
            <UsersRound className="mr-2 h-4 w-4" />
            Minhas Turmas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
              <CardDescription>
                Suas informações cadastrais na Viva Esportes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center py-2 border-b">
                <span className="font-medium w-32">Nome:</span>
                <span>{profile.nome}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center py-2 border-b">
                <span className="font-medium w-32">E-mail:</span>
                <span>{profile.email}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center py-2 border-b">
                <span className="font-medium w-32">Função:</span>
                <span>{profile.role === 'admin' ? 'Administrador' : 'Professor'}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center py-2">
                <span className="font-medium w-32">Desde:</span>
                <span>{new Date(profile.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={signOut} variant="outline" className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="turmas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Minhas Turmas
              </CardTitle>
              <CardDescription>
                Lista de turmas sob sua responsabilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
                </div>
              ) : turmas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Você ainda não possui turmas atribuídas.
                </div>
              ) : (
                <div className="grid gap-4">
                  {turmas.map((turma) => (
                    <Card key={turma.id} className="overflow-hidden">
                      <div className="bg-viva-blue/10 px-4 py-2 flex justify-between items-center">
                        <h3 className="font-medium">{turma.nome}</h3>
                        <span className="badge bg-viva-blue text-white px-2 py-1 rounded-full text-xs">
                          {turma.modalidade}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <span className="text-sm text-gray-500">Dia:</span>{" "}
                            <span className="font-medium">{turma.dia_semana}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Horário:</span>{" "}
                            <span className="font-medium">{turma.horario}</span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-sm text-gray-500">Local:</span>{" "}
                            <span className="font-medium">{turma.local}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PainelLayout>
  );
};

export default PainelProfessor;
