
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  nome: string;
  email: string;
  senha: string;
  role: string;
}

interface CreateUserFormFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const CreateUserFormFields = ({ formData, setFormData }: CreateUserFormFieldsProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({...formData, nome: e.target.value})}
          placeholder="Nome completo"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="email@exemplo.com"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          type="password"
          value={formData.senha}
          onChange={(e) => setFormData({...formData, senha: e.target.value})}
          placeholder="Senha segura"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Função</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({...formData, role: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professor">Professor</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
