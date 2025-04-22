
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const UserTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Função</TableHead>
        <TableHead>Criado em</TableHead>
        <TableHead>Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};
