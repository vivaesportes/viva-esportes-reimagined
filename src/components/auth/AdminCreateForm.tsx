
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AdminCreateFormProps {
  onSuccess?: () => void;
}

const AdminCreateForm = ({ onSuccess }: AdminCreateFormProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const criarPrimeiroAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setError(null);
    
    try {
      console.log("Iniciando criação de admin com:", { email, nome });
      
      // Passo 1: Criar usuário na autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome,
            role: 'admin',
          },
        },
      });

      if (authError) {
        console.error("Erro na autenticação:", authError);
        setError(authError.message);
        throw authError;
      }
      
      if (!authData.user) {
        const errorMsg = "Erro ao criar usuário";
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      console.log("Usuário criado com sucesso:", authData.user.id);

      // Passo 2: Criar perfil no banco de dados com a role de admin
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
        setError(profileError.message);
        
        // Tentativa de limpar o usuário criado caso o perfil falhe
        try {
          // Este método requer permissões administrativas, pode não funcionar
          await supabase.auth.admin.deleteUser(authData.user.id);
          console.log("Usuário deletado após falha ao criar perfil");
        } catch (deleteError) {
          console.error("Não foi possível deletar o usuário após falha:", deleteError);
        }
        
        throw profileError;
      }

      console.log("Perfil de admin criado com sucesso");

      toast({
        title: "Usuário Administrador Criado",
        description: "Faça login com suas novas credenciais",
      });

      // Redirecionar para a página de login
      navigate('/login');
      onSuccess?.();

    } catch (error: any) {
      console.error('Erro ao criar admin:', error);
      setError(error.message || "Ocorreu um erro inesperado");
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
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
