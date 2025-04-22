
import { useState } from 'react';

interface CreateUserFormData {
  nome: string;
  email: string;
  senha: string;
  role: string;
}

export const useCreateUserForm = () => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    nome: '',
    email: '',
    senha: '',
    role: 'professor'
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
      role: 'professor'
    });
  };

  return {
    formData,
    setFormData,
    resetForm
  };
};
