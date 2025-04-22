
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = () => (
  <div className="flex justify-center py-8">
    <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
  </div>
);

export const EmptyState = () => (
  <div className="text-center py-8 text-gray-500">
    Nenhum usuário encontrado no sistema.
  </div>
);
