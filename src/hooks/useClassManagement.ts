
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

  const handleDeleteTurma = async (id: string) => {
    try {
      const { error } = await supabase
        .from('turmas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTurmas(turmas.filter(t => t.id !== id));
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
    }
  };

  const handleEditTurma = (turma: Turma) => {
    // TODO: Implementar edição de turma
    console.log('Editar turma:', turma);
  };

  const handleAddTurma = (newTurma: Turma) => {
    setTurmas([...turmas, newTurma]);
    setOpenTurmaDialog(false);
  };

  return {
    turmas,
    openTurmaDialog,
    setOpenTurmaDialog,
    handleDeleteTurma,
    handleEditTurma,
    handleAddTurma,
  };
};
