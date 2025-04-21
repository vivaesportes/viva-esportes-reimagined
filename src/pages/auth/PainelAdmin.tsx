
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import PainelLayout from '@/components/auth/PainelLayout';
import { Users, UserPlus, Settings, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  created_at: string;
}

const PainelAdmin = () => {
  const { profile } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

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

    carregarUsuarios();
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <ShieldCheck className="mr-2 h-6 w-6 text-purple-600" />
          Painel de Administração
        </h1>
        <p className="text-gray-500">Gerencie usuários e configurações do sistema</p>
      </div>

      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="usuarios" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Usuários
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
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Novo Usuário
              </Button>
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
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
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

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configurações gerais para a plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Configurações serão implementadas em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PainelLayout>
  );
};

export default PainelAdmin;
