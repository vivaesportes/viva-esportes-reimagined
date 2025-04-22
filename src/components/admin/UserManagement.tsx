
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

  const {
    usuarios,
    actionLoading,
    handleCriarUsuario,
    handleExcluirUsuario,
    handleResetarSenha,
    reloadUsers
  } = useUserManagement(initialUsuarios);

  // Recarregar usuários quando o componente for montado
  useEffect(() => {
    reloadUsers();
  }, []);

  // Sincronizar estado com o componente pai
  useEffect(() => {
    setParentUsuarios(usuarios);
  }, [usuarios, setParentUsuarios]);

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
          onDeleteUser={handleExcluirUsuario}
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
