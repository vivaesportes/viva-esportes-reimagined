
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiasSemanaSelector, DiasSemana } from './DiasSemanaSelector';

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
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="nome-turma">Nome da Turma</Label>
        <Input
          id="nome-turma"
          value={novaTurma.nome}
          onChange={(e) => onTurmaChange('nome', e.target.value)}
          placeholder="Ex: Ballet Infantil"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="modalidade">Modalidade</Label>
        <Input
          id="modalidade"
          value={novaTurma.modalidade}
          onChange={(e) => onTurmaChange('modalidade', e.target.value)}
          placeholder="Ex: Ballet, Judô, Futebol"
        />
      </div>
      
      <DiasSemanaSelector 
        diasSemana={diasSemana}
        onDiaChange={onDiaChange}
      />

      <div className="grid gap-2">
        <Label htmlFor="horario">Horário</Label>
        <Input
          id="horario"
          value={novaTurma.horario}
          onChange={(e) => onTurmaChange('horario', e.target.value)}
          placeholder="Ex: 14:00 - 15:30"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="local">Local</Label>
        <Input
          id="local"
          value={novaTurma.local}
          onChange={(e) => onTurmaChange('local', e.target.value)}
          placeholder="Ex: Sala 3, Quadra A"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="professor">Professor (opcional)</Label>
        <Select
          value={novaTurma.professor_id}
          onValueChange={(value) => onTurmaChange('professor_id', value)}
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
  );
};
