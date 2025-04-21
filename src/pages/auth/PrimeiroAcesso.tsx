
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Layout from '@/components/ui/layout/Layout';
import Logo from '@/components/ui/Logo';
import { motion } from 'framer-motion';
import AdminCreateForm from '@/components/auth/AdminCreateForm';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const PrimeiroAcesso = () => {
  const navigate = useNavigate();
  const { adminExiste, loading, error } = useAdminCheck();

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
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
                </div>
              ) : error ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro ao verificar admin</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : adminExiste ? (
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
                <AdminCreateForm />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PrimeiroAcesso;
