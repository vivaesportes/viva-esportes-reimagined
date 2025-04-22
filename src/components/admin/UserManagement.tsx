
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from "@/components/ui/dialog";
import { UserTable } from './users/UserTable';
import { ResetPasswordDialog } from './users/ResetPasswordDialog';
import { UserManagementHeader } from './users/UserManagementHeader';
import { useUserManagement } from '@/hooks/useUserManagement';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  created_at: string;
}

export const UserManagement = ({ 
  usuarios: initialUsuarios, 
  loading, 
  setUsuarios: setParentUsuarios 
}: { 
  usuarios: Usuario[], 
  loading: boolean,
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [resetSenha, setResetSenha] = useState({ email: '', id: '' });
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const {
    usuarios,
    actionLoading,
    handleCriarUsuario,
    handleExcluirUsuario,
    handleResetarSenha,
    reloadUsers
  } = useUserManagement(initialUsuarios);

  // Reload users when the component is mounted
  useEffect(() => {
    reloadUsers();
  }, []);

  // Synchronize state with parent component
  useEffect(() => {
    setParentUsuarios(usuarios);
  }, [usuarios, setParentUsuarios]);

  const handleDeleteUser = async (userId: string) => {
    setDeleteLoading(userId);
    try {
      await handleExcluirUsuario(userId);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <Card>
      <UserManagementHeader
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onCreateUser={async (formData) => {
          const success = await handleCriarUsuario(formData);
          if (success) setOpenDialog(false);
        }}
        actionLoading={actionLoading}
      />
      <CardContent>
        <UserTable 
          usuarios={usuarios}
          loading={loading || actionLoading}
          onResetPassword={(email, id) => {
            setResetSenha({ email, id });
            setOpenResetDialog(true);
          }}
          onDeleteUser={handleDeleteUser}
          deleteLoading={deleteLoading}
        />
      </CardContent>

      <Dialog open={openResetDialog} onOpenChange={setOpenResetDialog}>
        <ResetPasswordDialog
          email={resetSenha.email}
          onSubmit={async () => {
            const success = await handleResetarSenha(resetSenha.email);
            if (success) {
              setResetSenha({ email: '', id: '' });
              setOpenResetDialog(false);
            }
          }}
          onCancel={() => setOpenResetDialog(false)}
          loading={actionLoading}
        />
      </Dialog>
    </Card>
  );
};
