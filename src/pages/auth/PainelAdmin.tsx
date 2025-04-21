
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const PrimeiroAcesso = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const criarPrimeiroAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    } catch (error: any) {
      console.error('Erro ao criar admin:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
              <Label>Nome Completo</Label>
              <Input 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                placeholder="Seu nome completo" 
                required 
              />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="seu.email@exemplo.com" 
                required 
              />
            </div>
            <div>
              <Label>Senha</Label>
              <Input 
                type="password" 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
                placeholder="Senha de acesso" 
                required 
              />
            </div>
            <Button type="submit" className="w-full">
              Criar Conta de Administrador
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrimeiroAcesso;
