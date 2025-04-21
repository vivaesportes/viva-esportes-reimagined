
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
  const [novaTurma, setNovaTurma] = useState({
    nome: '',
    modalidade: '',
    horario: '',
    dia_semana: '',
    local: '',
    professor_id: ''
  });
  const [openTurmaDialog, setOpenTurmaDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCriarTurma = async () => {
    try {
      if (!novaTurma.nome || !novaTurma.modalidade || !novaTurma.horario || !novaTurma.dia_semana || !novaTurma.local) {
        toast({
          title: "Dados incompletos",
          description: "Preencha todos os campos obrigatórios da turma",
          variant: "destructive",
        });
        return;
      }

      setActionLoading(true);
      
      const { data, error } = await supabase
        .from('turmas')
        .insert([
          {
            nome: novaTurma.nome,
            modalidade: novaTurma.modalidade,
            horario: novaTurma.horario,
            dia_semana: novaTurma.dia_semana,
            local: novaTurma.local,
            professor_id: novaTurma.professor_id || null
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Turma criada com sucesso",
        description: `A turma ${novaTurma.nome} foi adicionada`,
      });

      if (data && data.length > 0) {
        setTurmas([...turmas, data[0]]);
      }

      setNovaTurma({
        nome: '',
        modalidade: '',
        horario: '',
        dia_semana: '',
        local: '',
        professor_id: ''
      });
      setOpenTurmaDialog(false);
    } catch (error: any) {
      console.error('Erro ao criar turma:', error);
      toast({
        title: "Erro ao criar turma",
        description: error.message || "Ocorreu um erro ao criar a turma",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
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
          <DialogContent>
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
                    <SelectItem value="">-- Sem professor --</SelectItem>
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
              <Button variant="outline" onClick={() => setOpenTurmaDialog(false)}>Cancelar</Button>
              <Button onClick={handleCriarTurma} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Criar Turma
              </Button>
            </DialogFooter>
          </DialogContent>
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
                    <Button variant="outline" size="sm">
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
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
