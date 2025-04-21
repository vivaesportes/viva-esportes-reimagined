import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import PainelLayout from '@/components/auth/PainelLayout';
import { ShieldCheck, Users, BookOpen, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { UserManagement } from '@/components/admin/UserManagement';
import { ClassManagement } from '@/components/admin/ClassManagement';
import { SystemSettings } from '@/components/admin/SystemSettings';

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
          <UserManagement 
            usuarios={usuarios} 
            loading={loading} 
            setUsuarios={setUsuarios}
          />
        </TabsContent>

        <TabsContent value="turmas">
          <ClassManagement
            turmas={turmas}
            usuarios={usuarios}
            turmasLoading={turmasLoading}
            setTurmas={setTurmas}
          />
        </TabsContent>

        <TabsContent value="config">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </PainelLayout>
  );
};

export default PainelAdmin;
