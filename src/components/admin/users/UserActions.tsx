
import React from 'react';
import { Key, UserX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  created_at: string;
}

interface UserActionsProps {
  usuario: Usuario;
  onResetPassword: (email: string, id: string) => void;
  onDeleteUser: (userId: string) => void;
  isDeleting?: boolean;
}

export const UserActions = ({ 
  usuario, 
  onResetPassword, 
  onDeleteUser, 
  isDeleting = false 
}: UserActionsProps) => {
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    onDeleteUser(usuario.id);
    setOpen(false);
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onResetPassword(usuario.email, usuario.id)}
        disabled={isDeleting}
      >
        <Key className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Resetar senha</span>
      </Button>
      
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            size="sm" 
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                <span className="hidden sm:inline">Excluindo...</span>
              </>
            ) : (
              <>
                <UserX className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Excluir</span>
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário {usuario.nome}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
