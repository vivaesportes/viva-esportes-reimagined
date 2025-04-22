
import React from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from 'lucide-react';
import { CreateUserFormFields } from './CreateUserFormFields';
import { useCreateUserForm } from '@/hooks/useCreateUserForm';

interface CreateUserFormData {
  nome: string;
  email: string;
  senha: string;
  role: string;
}

interface CreateUserDialogProps {
  onSubmit: (data: CreateUserFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const CreateUserDialog = ({ onSubmit, onCancel, loading }: CreateUserDialogProps) => {
  const { formData, setFormData, resetForm } = useCreateUserForm();

  const handleSubmit = async () => {
    await onSubmit(formData);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
        <DialogDescription>
          Preencha os dados para criar uma nova conta de usuário.
        </DialogDescription>
      </DialogHeader>
      <CreateUserFormFields 
        formData={formData}
        setFormData={setFormData}
      />
      <DialogFooter>
        <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
          Criar Usuário
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
