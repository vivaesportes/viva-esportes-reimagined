
import React, { useEffect, useState, useCallback } from 'react';
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

  const carregarUsuarios = useCallback(async () => {
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
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: error.message || "Não foi possível carregar a lista de usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  const carregarTurmas = useCallback(async () => {
    try {
      setTurmasLoading(true);
      console.log("PainelAdmin - Carregando turmas...");
      
      const { data, error } = await supabase
        .from('turmas')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      console.log("PainelAdmin - Turmas carregadas:", data);
      setTurmas(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar turmas:', error);
      toast({
        title: "Erro ao carregar turmas",
        description: error.message || "Não foi possível carregar a lista de turmas",
        variant: "destructive",
      });
    } finally {
      setTurmasLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("PainelAdmin - Componente montado");
    console.log("PainelAdmin - Perfil do usuário:", profile);
    
    if (profile?.id) {
      carregarUsuarios();
      carregarTurmas();
    }
  }, [profile?.id, carregarUsuarios, carregarTurmas]);

  // Configurar listener para atualizações de turmas
  useEffect(() => {
    const turmasSubscription = supabase
      .channel('turmas-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'turmas' 
      }, () => {
        console.log('Mudanças detectadas na tabela turmas, recarregando...');
        carregarTurmas();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(turmasSubscription);
    };
  }, [carregarTurmas]);

  // Configurar listener para atualizações de usuários
  useEffect(() => {
    const usuariosSubscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles' 
      }, () => {
        console.log('Mudanças detectadas na tabela profiles, recarregando...');
        carregarUsuarios();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(usuariosSubscription);
    };
  }, [carregarUsuarios]);

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
