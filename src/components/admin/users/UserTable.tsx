
import React from 'react';
import { UserActions } from './UserActions';
import { Loader2 } from 'lucide-react';

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
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum usuário encontrado no sistema.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="py-3 px-4 text-left font-medium text-gray-500">Nome</th>
            <th className="py-3 px-4 text-left font-medium text-gray-500">Email</th>
            <th className="py-3 px-4 text-left font-medium text-gray-500">Função</th>
            <th className="py-3 px-4 text-left font-medium text-gray-500">Criado em</th>
            <th className="py-3 px-4 text-left font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{usuario.nome}</td>
              <td className="py-3 px-4">{usuario.email}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  usuario.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {usuario.role === 'admin' ? 'Administrador' : 'Professor'}
                </span>
              </td>
              <td className="py-3 px-4">
                {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
              </td>
              <td className="py-3 px-4">
                <UserActions 
                  usuario={usuario}
                  onResetPassword={onResetPassword}
                  onDeleteUser={onDeleteUser}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
