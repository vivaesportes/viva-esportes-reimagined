
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
import Layout from '@/components/ui/layout/Layout';
import Logo from '@/components/ui/Logo';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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
        
        if (error) {
          console.error('Erro ao verificar admin:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setAdminExiste(true);
          console.log("Admin já existe no sistema");
        } else {
          console.log("Nenhum admin encontrado, formulário disponível");
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
      console.log("Iniciando criação de admin com:", { email, nome });
      
      // 1. Criar usuário na autenticação
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

      // 2. Criar o perfil com role de admin
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

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-viva-blue/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Logo size={80} />
              </div>
              <CardTitle className="text-2xl font-bold">
                {adminExiste ? "Acesso Restrito" : "Primeiro Acesso - Administrador"}
              </CardTitle>
              <CardDescription>
                {adminExiste 
                  ? "Esta página não está mais disponível" 
                  : "Crie sua conta de administrador inicial"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adminExiste ? (
                <>
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Acesso Negado</AlertTitle>
                    <AlertDescription>
                      Um administrador já existe no sistema. Esta página é apenas para a configuração inicial.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={() => navigate('/login')} 
                    className="w-full"
                  >
                    Ir para Login
                  </Button>
                </>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PrimeiroAcesso;
