
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from 'lucide-react';
import { CreateClassDialog } from './classes/CreateClassDialog';
import { ClassCard } from './classes/ClassCard';
import { useClassManagement } from '@/hooks/useClassManagement';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
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

export const ClassManagement = ({ 
  turmas: initialTurmas, 
  usuarios,
  turmasLoading,
  setTurmas: setTurmasGlobal 
}: { 
  turmas: Turma[], 
  usuarios: Usuario[],
  turmasLoading: boolean,
  setTurmas: React.Dispatch<React.SetStateAction<Turma[]>>
}) => {
  const {
    turmas,
    openTurmaDialog,
    setOpenTurmaDialog,
    actionLoading,
    handleDeleteTurma,
    handleEditTurma,
    handleAddTurma,
    reloadTurmas
  } = useClassManagement({ initialTurmas });

  // Carrega as turmas ao montar o componente
  useEffect(() => {
    reloadTurmas();
  }, []);

  // Mantém o estado global sincronizado
  useEffect(() => {
    setTurmasGlobal(turmas);
  }, [turmas, setTurmasGlobal]);

  // Find professor by ID function to get the name
  const findProfessorById = (professorId: string | null) => {
    if (!professorId) return null;
    return usuarios.find(u => u.id === professorId);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciar Turmas</CardTitle>
          <CardDescription>
            Lista de todas as turmas cadastradas no sistema
          </CardDescription>
        </div>
        <Dialog open={openTurmaDialog} onOpenChange={setOpenTurmaDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Turma
            </Button>
          </DialogTrigger>
          <CreateClassDialog
            usuarios={usuarios}
            onSuccess={handleAddTurma}
            onCancel={() => setOpenTurmaDialog(false)}
          />
        </Dialog>
      </CardHeader>
      <CardContent>
        {turmasLoading || actionLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
          </div>
        ) : turmas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma turma encontrada no sistema.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turmas.map((turma) => {
              // Find the professor object to pass to ClassCard
              const professor = findProfessorById(turma.professor_id);
              return (
                <ClassCard
                  key={turma.id}
                  turma={turma}
                  professor={professor}
                  onDelete={handleDeleteTurma}
                  onEdit={handleEditTurma}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
