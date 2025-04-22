
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { UserActions } from './UserActions';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  created_at: string;
}

interface UserTableRowProps {
  usuario: Usuario;
  onResetPassword: (email: string, id: string) => void;
  onDeleteUser: (userId: string) => void;
  isDeleting?: boolean;
}

export const UserTableRow = ({ 
  usuario, 
  onResetPassword, 
  onDeleteUser, 
  isDeleting = false 
}: UserTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{usuario.nome}</TableCell>
      <TableCell>{usuario.email}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-xs ${
          usuario.role === 'admin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {usuario.role === 'admin' ? 'Administrador' : 'Professor'}
        </span>
      </TableCell>
      <TableCell>
        {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
      </TableCell>
      <TableCell>
        <UserActions 
          usuario={usuario}
          onResetPassword={onResetPassword}
          onDeleteUser={onDeleteUser}
          isDeleting={isDeleting}
        />
      </TableCell>
    </TableRow>
  );
};
