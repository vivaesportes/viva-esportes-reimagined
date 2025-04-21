
import React from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key, Loader2 } from 'lucide-react';

interface ResetPasswordDialogProps {
  email: string;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const ResetPasswordDialog = ({ email, onSubmit, onCancel, loading }: ResetPasswordDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Redefinir Senha</DialogTitle>
        <DialogDescription>
          Será enviado um e-mail com instruções para redefinir a senha.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <Label htmlFor="resetEmail">E-mail do usuário</Label>
        <Input
          id="resetEmail"
          type="email"
          value={email}
          readOnly
          className="bg-gray-50"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={onSubmit} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Key className="h-4 w-4 mr-2" />}
          Enviar Link
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
