
import { useState } from 'react';

interface AdminFormData {
  nome: string;
  email: string;
  senha: string;
}

export const useAdminForm = () => {
  const [formData, setFormData] = useState<AdminFormData>({
    nome: '',
    email: '',
    senha: ''
  });

  const updateField = (field: keyof AdminFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) return 'Nome é obrigatório';
    if (!formData.email.trim()) return 'Email é obrigatório';
    if (!formData.senha.trim()) return 'Senha é obrigatória';
    if (formData.senha.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
    return null;
  };

  return {
    formData,
    updateField,
    validateForm
  };
};
