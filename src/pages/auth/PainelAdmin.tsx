import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import PainelLayout from '@/components/auth/PainelLayout';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTabs } from '@/components/admin/AdminTabs';

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
      <AdminHeader 
        title="Painel de Administração"
        description="Gerencie usuários, turmas e configurações do sistema"
      />
      <AdminTabs
        usuarios={usuarios}
        turmas={turmas}
        loading={loading}
        turmasLoading={turmasLoading}
        setUsuarios={setUsuarios}
        setTurmas={setTurmas}
      />
    </PainelLayout>
  );
};

export default PainelAdmin;
