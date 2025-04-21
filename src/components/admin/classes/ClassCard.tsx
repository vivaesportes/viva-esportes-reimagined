
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from 'lucide-react';

interface ClassCardProps {
  turma: {
    id: string;
    nome: string;
    modalidade: string;
    horario: string;
    dia_semana: string;
    local: string;
    professor_id: string | null;
  };
  professor?: {
    id: string;
    nome: string;
  };
  onDelete: (id: string) => void;
  onEdit: (turma: any) => void;
}

export const ClassCard = ({ turma, professor, onDelete, onEdit }: ClassCardProps) => {
  return (
    <Card key={turma.id} className="overflow-hidden">
      <div className="bg-viva-blue/10 px-4 py-2 flex justify-between items-center">
        <h3 className="font-medium">{turma.nome}</h3>
        <span className="badge bg-viva-blue text-white px-2 py-1 rounded-full text-xs">
          {turma.modalidade}
        </span>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Dia:</span>
            <span className="font-medium">{turma.dia_semana}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Horário:</span>
            <span className="font-medium">{turma.horario}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Local:</span>
            <span className="font-medium">{turma.local}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Professor:</span>
            <span className="font-medium">{professor?.nome || "Não atribuído"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-2 bg-gray-50 border-t">
        <Button variant="outline" size="sm" onClick={() => onEdit(turma)}>
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a turma {turma.nome}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => onDelete(turma.id)}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
