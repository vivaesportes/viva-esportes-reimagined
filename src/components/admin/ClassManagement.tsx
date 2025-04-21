
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { CreateClassDialog } from './classes/CreateClassDialog';
import { ClassCard } from './classes/ClassCard';

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
  turmas, 
  usuarios,
  turmasLoading,
  setTurmas 
}: { 
  turmas: Turma[], 
  usuarios: Usuario[],
  turmasLoading: boolean,
  setTurmas: React.Dispatch<React.SetStateAction<Turma[]>>
}) => {
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
            onSuccess={(newTurma) => {
              setTurmas([...turmas, newTurma]);
              setOpenTurmaDialog(false);
            }}
            onCancel={() => setOpenTurmaDialog(false)}
          />
        </Dialog>
      </CardHeader>
      <CardContent>
        {turmasLoading ? (
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
              const professor = usuarios.find(u => u.id === turma.professor_id);
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
