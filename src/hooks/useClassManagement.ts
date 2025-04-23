
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface Turma {
  id: string;
  nome: string;
  modalidade: string;
  horario: string;
  dia_semana: string;
  local: string;
  professor_id: string | null;
}

interface UseClassManagementProps {
  initialTurmas: Turma[];
}

export const useClassManagement = ({ initialTurmas }: UseClassManagementProps) => {
  const [turmas, setTurmas] = useState<Turma[]>(initialTurmas);
  const [openTurmaDialog, setOpenTurmaDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleDeleteTurma = async (id: string) => {
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from('turmas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTurmas(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Turma excluída",
        description: "A turma foi excluída com sucesso",
      });
    } catch (error: any) {
      console.error('Erro ao excluir turma:', error);
      toast({
        title: "Erro ao excluir turma",
        description: error.message || "Ocorreu um erro ao excluir a turma",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTurma = async (turma: Turma) => {
    try {
      setActionLoading(true);
      const { error } = await supabase
        .from('turmas')
        .update({
          nome: turma.nome,
          modalidade: turma.modalidade,
          horario: turma.horario,
          dia_semana: turma.dia_semana,
          local: turma.local,
          professor_id: turma.professor_id
        })
        .eq('id', turma.id);

      if (error) throw error;

      setTurmas(prev => prev.map(t => t.id === turma.id ? turma : t));
      toast({
        title: "Turma atualizada",
        description: "A turma foi atualizada com sucesso",
      });
    } catch (error: any) {
      console.error('Erro ao editar turma:', error);
      toast({
        title: "Erro ao editar turma",
        description: error.message || "Ocorreu um erro ao editar a turma",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddTurma = async (newTurma: any) => {
    // Add the new turma to the state
    setTurmas(prev => [...prev, newTurma]);
    setOpenTurmaDialog(false);
    
    return newTurma;
  };

  const reloadTurmas = async () => {
    try {
      setActionLoading(true);
      const { data, error } = await supabase
        .from('turmas')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;

      setTurmas(data || []);
    } catch (error: any) {
      console.error('Erro ao recarregar turmas:', error);
      toast({
        title: "Erro ao carregar turmas",
        description: error.message || "Ocorreu um erro ao carregar as turmas",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return {
    turmas,
    openTurmaDialog,
    setOpenTurmaDialog,
    actionLoading,
    handleDeleteTurma,
    handleEditTurma,
    handleAddTurma,
    reloadTurmas
  };
};
