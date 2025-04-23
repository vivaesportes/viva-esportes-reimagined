
import React, { useState } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      if (!novaTurma.nome || !novaTurma.modalidade || !novaTurma.horario || !novaTurma.dia_semana || !novaTurma.local) {
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
          dia_semana: novaTurma.dia_semana,
          local: novaTurma.local,
          professor_id: novaTurma.professor_id || null
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
              <SelectItem value="sem_professor">-- Sem professor --</SelectItem>
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
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          Criar Turma
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
