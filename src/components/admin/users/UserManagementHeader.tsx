
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from 'lucide-react';
import { CreateUserDialog } from './CreateUserDialog';

interface UserManagementHeaderProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  onCreateUser: (formData: any) => Promise<void>;
  actionLoading: boolean;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  openDialog,
  setOpenDialog,
  onCreateUser,
  actionLoading
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Gerenciar Usuários</CardTitle>
        <CardDescription>
          Lista de todos os usuários cadastrados no sistema
        </CardDescription>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </DialogTrigger>
        <CreateUserDialog 
          onSubmit={onCreateUser}
          onCancel={() => setOpenDialog(false)}
          loading={actionLoading}
        />
      </Dialog>
    </CardHeader>
  );
};
