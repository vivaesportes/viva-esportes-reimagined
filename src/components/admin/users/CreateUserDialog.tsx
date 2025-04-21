
import React, { useState } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from 'lucide-react';

interface CreateUserFormData {
  nome: string;
  email: string;
  senha: string;
  role: string;
}

interface CreateUserDialogProps {
  onSubmit: (data: CreateUserFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const CreateUserDialog = ({ onSubmit, onCancel, loading }: CreateUserDialogProps) => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    nome: '',
    email: '',
    senha: '',
    role: 'professor'
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
        <DialogDescription>
          Preencha os dados para criar uma nova conta de usuário.
        </DialogDescription>
      </DialogHeader>
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
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSubmit(formData)} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
          Criar Usuário
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
