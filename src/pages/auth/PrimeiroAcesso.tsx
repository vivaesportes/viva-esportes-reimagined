
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PrimeiroAcesso = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [adminExiste, setAdminExiste] = useState(false);
  const navigate = useNavigate();

  // Verificar se já existe um admin
  useEffect(() => {
    const verificarAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setAdminExiste(true);
        }
      } catch (error) {
        console.error('Erro ao verificar admin:', error);
      }
    };

    verificarAdmin();
  }, []);

  const criarPrimeiroAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    
    try {
      // 1. Criar usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Erro ao criar usuário");
      }

      // 2. Criar o perfil com role de admin
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email,
          nome,
          role: 'admin',
          created_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      toast({
        title: "Usuário Administrador Criado",
        description: "Faça login com suas novas credenciais",
      });

      // Redirecionar para a página de login
      navigate('/login');

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

  if (adminExiste) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Esta página não está mais disponível
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Acesso Negado</AlertTitle>
              <AlertDescription>
                Um administrador já existe no sistema. Esta página é apenas para a configuração inicial.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full"
              >
                Ir para Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Primeiro Acesso - Administrador</CardTitle>
          <CardDescription>
            Crie sua conta de administrador inicial
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              className="w-full"
              disabled={carregando}
            >
              {carregando ? 'Criando...' : 'Criar Conta de Administrador'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrimeiroAcesso;
