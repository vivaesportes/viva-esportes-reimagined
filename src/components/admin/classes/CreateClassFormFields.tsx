
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiasSemanaSelector, DiasSemana } from './DiasSemanaSelector';
import { FormItem } from '@/components/ui/form';

interface CreateClassFormFieldsProps {
  novaTurma: {
    nome: string;
    modalidade: string;
    horario: string;
    local: string;
    professor_id: string;
  };
  onTurmaChange: (field: string, value: string) => void;
  diasSemana: DiasSemana[];
  onDiaChange: (id: string, checked: boolean) => void;
  usuarios: {
    id: string;
    nome: string;
    role: string;
  }[];
}

export const CreateClassFormFields = ({
  novaTurma,
  onTurmaChange,
  diasSemana,
  onDiaChange,
  usuarios
}: CreateClassFormFieldsProps) => {
  // Get all users with professor role
  const professores = usuarios.filter(u => u.role === 'professor');
  
  return (
    <div className="grid gap-5 py-4">
      <FormItem className="grid gap-2">
        <Label htmlFor="nome-turma" className="font-medium">Nome da Turma</Label>
        <Input
          id="nome-turma"
          value={novaTurma.nome}
          onChange={(e) => onTurmaChange('nome', e.target.value)}
          placeholder="Ex: Ballet Infantil"
          className="w-full"
        />
      </FormItem>
      
      <FormItem className="grid gap-2">
        <Label htmlFor="modalidade" className="font-medium">Modalidade</Label>
        <Input
          id="modalidade"
          value={novaTurma.modalidade}
          onChange={(e) => onTurmaChange('modalidade', e.target.value)}
          placeholder="Ex: Ballet, Judô, Futebol"
          className="w-full"
        />
      </FormItem>
      
      <DiasSemanaSelector 
        diasSemana={diasSemana}
        onDiaChange={onDiaChange}
      />

      <FormItem className="grid gap-2">
        <Label htmlFor="horario" className="font-medium">Horário</Label>
        <Input
          id="horario"
          value={novaTurma.horario}
          onChange={(e) => onTurmaChange('horario', e.target.value)}
          placeholder="Ex: 14:00 - 15:30"
          className="w-full"
        />
      </FormItem>
      
      <FormItem className="grid gap-2">
        <Label htmlFor="local" className="font-medium">Local</Label>
        <Input
          id="local"
          value={novaTurma.local}
          onChange={(e) => onTurmaChange('local', e.target.value)}
          placeholder="Ex: Sala 3, Quadra A"
          className="w-full"
        />
      </FormItem>
      
      <FormItem className="grid gap-2">
        <Label htmlFor="professor" className="font-medium">Professor (opcional)</Label>
        <Select
          value={novaTurma.professor_id}
          onValueChange={(value) => onTurmaChange('professor_id', value)}
        >
          <SelectTrigger id="professor" className="w-full">
            <SelectValue placeholder="Selecione um professor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sem_professor">-- Sem professor --</SelectItem>
            {professores.map(professor => (
              <SelectItem key={professor.id} value={professor.id}>
                {professor.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>
    </div>
  );
};
