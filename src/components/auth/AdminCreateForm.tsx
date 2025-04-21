
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AdminCreateFormProps {
  onSuccess?: () => void;
}

const AdminCreateForm = ({ onSuccess }: AdminCreateFormProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const criarPrimeiroAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    
    try {
      console.log("Iniciando criação de admin com:", { email, nome });
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (authError) {
        console.error("Erro na autenticação:", authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error("Erro ao criar usuário");
      }

      console.log("Usuário criado com sucesso:", authData.user.id);

      const profileData = {
        id: authData.user.id,
        email,
        nome,
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      
      console.log("Tentando criar perfil:", profileData);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        throw profileError;
      }

      console.log("Perfil de admin criado com sucesso");

      toast({
        title: "Usuário Administrador Criado",
        description: "Faça login com suas novas credenciais",
      });

      navigate('/login');
      onSuccess?.();

    } catch (error: any) {
      console.error('Erro ao criar admin:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={criarPrimeiroAdmin} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome Completo</Label>
        <Input 
          id="nome"
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          placeholder="Seu nome completo" 
          required 
        />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input 
          id="email"
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="seu.email@exemplo.com" 
          required 
        />
      </div>
      <div>
        <Label htmlFor="senha">Senha</Label>
        <Input 
          id="senha"
          type="password" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          placeholder="Senha de acesso" 
          required 
          minLength={6}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-viva-blue hover:bg-viva-darkBlue"
        disabled={carregando}
      >
        {carregando ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando...
          </>
        ) : (
          "Criar Conta de Administrador"
        )}
      </Button>
    </form>
  );
};

export default AdminCreateForm;
