
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { LoadingState, EmptyState } from './UserTableStates';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  created_at: string;
}

interface UserTableProps {
  usuarios: Usuario[];
  loading: boolean;
  onResetPassword: (email: string, id: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserTable = ({ 
  usuarios, 
  loading, 
  onResetPassword,
  onDeleteUser 
}: UserTableProps) => {
  if (loading) {
    return <LoadingState />;
  }

  if (usuarios.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <UserTableHeader />
        <TableBody>
          {usuarios.map((usuario) => (
            <UserTableRow
              key={usuario.id}
              usuario={usuario}
              onResetPassword={onResetPassword}
              onDeleteUser={onDeleteUser}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
