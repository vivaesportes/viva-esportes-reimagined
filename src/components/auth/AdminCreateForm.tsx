
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import FormError from './FormError';
import { useAdminForm } from '@/hooks/useAdminForm';
import { useCooldown } from '@/hooks/useCooldown';
import { checkProfileExists } from '@/hooks/useProfileCheck';

interface AdminCreateFormProps {
  onSuccess?: () => void;
}

const AdminCreateForm = ({ onSuccess }: AdminCreateFormProps) => {
  const { formData, updateField, validateForm } = useAdminForm();
  const { cooldown, cooldownTimer, startCooldown } = useCooldown();
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRateLimitError = (message: string) => {
    const secondsMatch = message.match(/(\d+) second/);
    const waitTime = secondsMatch && secondsMatch[1] ? parseInt(secondsMatch[1], 10) : 30;
    startCooldown(waitTime);
    setError(`Por favor, aguarde ${waitTime} segundos antes de tentar novamente.`);
  };

  const criarPrimeiroAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldown) {
      toast({
        title: "Aguarde",
        description: `Por favor, espere ${cooldownTimer} segundos antes de tentar novamente.`,
        variant: "destructive",
      });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setCarregando(true);
    setError(null);
    
    try {
      console.log("Iniciando criação de admin com:", { email: formData.email, nome: formData.nome });
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome,
            role: 'admin',
          },
        },
      });

      if (authError) {
        console.error("Erro na autenticação:", authError);
        
        if (authError.message.includes("security purposes") || 
            authError.code === "over_email_send_rate_limit") {
          handleRateLimitError(authError.message);
          return;
        }
        
        setError(authError.message);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error("Erro ao criar usuário");
      }

      // Verificar se já existe um perfil
      const profileExists = await checkProfileExists(authData.user.id);
      
      // REST API constants
      const SUPABASE_URL = "https://tgxmuqvwwkxugvyspcwn.supabase.co";
      const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneG11cXZ3d2t4dWd2eXNwY3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjA1MDUsImV4cCI6MjA2MDgzNjUwNX0.dImvfAModlvq8rqduR_5FOy-K4vDF22ko_uy6OiRc-0";
      
      const profileData = {
        id: authData.user.id,
        email: formData.email,
        nome: formData.nome,
        role: 'admin',
        created_at: new Date().toISOString(),
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles${profileExists ? `?id=eq.${authData.user.id}` : ''}`, {
        method: profileExists ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(profileExists ? { role: 'admin', nome: formData.nome } : profileData)
      });

      if (!response.ok) {
        throw new Error("Erro ao criar/atualizar perfil de administrador");
      }

      toast({
        title: "Usuário Administrador Criado",
        description: "Faça login com suas novas credenciais",
      });

      navigate('/login');
      onSuccess?.();

    } catch (error: any) {
      console.error('Erro ao criar admin:', error);
      
      if (!cooldown) {
        setError(error.message || "Ocorreu um erro inesperado");
        toast({
          title: "Erro ao criar usuário",
          description: error.message || "Ocorreu um erro inesperado",
          variant: "destructive",
        });
      }
    } finally {
      if (!cooldown) {
        setCarregando(false);
      }
    }
  };

  return (
    <form onSubmit={criarPrimeiroAdmin} className="space-y-4">
      {error && <FormError message={error} />}
      
      {cooldown && (
        <FormError 
          title="Aguarde" 
          message={`Você poderá tentar novamente em ${cooldownTimer} segundos.`}
        />
      )}
      
      <div>
        <Label htmlFor="nome">Nome Completo</Label>
        <Input 
          id="nome"
          value={formData.nome} 
          onChange={(e) => updateField('nome', e.target.value)} 
          placeholder="Seu nome completo" 
          required 
          disabled={cooldown || carregando}
        />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input 
          id="email"
          type="email" 
          value={formData.email} 
          onChange={(e) => updateField('email', e.target.value)} 
          placeholder="seu.email@exemplo.com" 
          required 
          disabled={cooldown || carregando}
        />
      </div>
      <div>
        <Label htmlFor="senha">Senha</Label>
        <Input 
          id="senha"
          type="password" 
          value={formData.senha} 
          onChange={(e) => updateField('senha', e.target.value)} 
          placeholder="Senha de acesso" 
          required 
          minLength={6}
          disabled={cooldown || carregando}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-viva-blue hover:bg-viva-darkBlue"
        disabled={carregando || cooldown}
      >
        {carregando ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando...
          </>
        ) : cooldown ? (
          <>
            Aguarde {cooldownTimer}s...
          </>
        ) : (
          "Criar Conta de Administrador"
        )}
      </Button>
    </form>
  );
};

export default AdminCreateForm;
