
import React, { useState } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { CreateClassFormFields } from './CreateClassFormFields';
import type { DiasSemana } from './DiasSemanaSelector';

interface CreateClassDialogProps {
  usuarios: {
    id: string;
    nome: string;
    role: string;
  }[];
  onSuccess: (newTurma: any) => void;
  onCancel: () => void;
}

export const CreateClassDialog = ({ usuarios, onSuccess, onCancel }: CreateClassDialogProps) => {
  const [novaTurma, setNovaTurma] = useState({
    nome: '',
    modalidade: '',
    horario: '',
    dia_semana: '',
    local: '',
    professor_id: ''
  });

  const [diasSemana, setDiasSemana] = useState<DiasSemana[]>([
    { id: "segunda", label: "Segunda", checked: false },
    { id: "terca", label: "Terça", checked: false },
    { id: "quarta", label: "Quarta", checked: false },
    { id: "quinta", label: "Quinta", checked: false },
    { id: "sexta", label: "Sexta", checked: false },
  ]);

  const [loading, setLoading] = useState(false);

  const handleDiasSemanaChange = (id: string, checked: boolean) => {
    setDiasSemana(dias => 
      dias.map(dia => 
        dia.id === id ? { ...dia, checked } : dia
      )
    );
  };

  const handleTurmaChange = (field: string, value: string) => {
    setNovaTurma(prev => ({ ...prev, [field]: value }));
  };

  const getDiasSelecionados = () => {
    return diasSemana
      .filter(dia => dia.checked)
      .map(dia => dia.label)
      .join(", ");
  };

  const handleCreate = async () => {
    try {
      const diasSelecionados = getDiasSelecionados();
      
      if (!novaTurma.nome || !novaTurma.modalidade || !novaTurma.horario || !diasSelecionados || !novaTurma.local) {
        toast({
          title: "Dados incompletos",
          description: "Preencha todos os campos obrigatórios da turma",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      
      const { data, error } = await supabase
        .from('turmas')
        .insert([{
          nome: novaTurma.nome,
          modalidade: novaTurma.modalidade,
          horario: novaTurma.horario,
          dia_semana: diasSelecionados,
          local: novaTurma.local,
          professor_id: novaTurma.professor_id === "sem_professor" ? null : novaTurma.professor_id
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Turma criada com sucesso",
        description: `A turma ${novaTurma.nome} foi adicionada`,
      });

      if (data && data.length > 0) {
        onSuccess(data[0]);
      }
    } catch (error: any) {
      console.error('Erro ao criar turma:', error);
      toast({
        title: "Erro ao criar turma",
        description: error.message || "Ocorreu um erro ao criar a turma",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Adicionar Nova Turma</DialogTitle>
        <DialogDescription>
          Preencha os dados para criar uma nova turma.
        </DialogDescription>
      </DialogHeader>
      
      <CreateClassFormFields
        novaTurma={novaTurma}
        onTurmaChange={handleTurmaChange}
        diasSemana={diasSemana}
        onDiaChange={handleDiasSemanaChange}
        usuarios={usuarios}
      />

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          Criar Turma
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
