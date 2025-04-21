
import { useAuth } from "@/contexts/auth/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/contexts/auth/types";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RotaProtegidaProps {
  children: React.ReactNode;
  nivelRequerido?: UserRole;
}

const RotaProtegida = ({ children, nivelRequerido }: RotaProtegidaProps) => {
  const { isAuthenticated, loading, profile, isAdmin, authError } = useAuth();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Timeout para mostrar mensagem de erro se o carregamento demorar muito
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 segundos
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);

  // Logs detalhados para debug
  console.log("RotaProtegida - Caminho atual:", location.pathname);
  console.log("RotaProtegida - Perfil do usuário:", profile);
  console.log("RotaProtegida - É admin?", isAdmin, "Role do perfil:", profile?.role);
  console.log("RotaProtegida - Nível requerido:", nivelRequerido);
  console.log("RotaProtegida - Loading:", loading, "Loading timeout:", loadingTimeout);
  console.log("RotaProtegida - Erro de autenticação:", authError);

  // Verifica se o Supabase está configurado
  const supabaseConfigured = isSupabaseConfigured();

  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-xl w-full">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-red-700 mb-2 text-center">
            Erro de Configuração do Supabase
          </h2>
          <div className="space-y-4">
            <p className="text-red-600">
              As variáveis de ambiente do Supabase não estão configuradas. Para o sistema de login funcionar, você precisa configurar:
            </p>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
              <div className="mb-1">VITE_SUPABASE_URL</div>
              <div>VITE_SUPABASE_ANON_KEY</div>
            </div>
            <p className="text-gray-700">
              Para obter essas informações:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Acesse seu projeto no <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase</a></li>
              <li>Vá para <strong>Settings {'>'} API</strong></li>
              <li>Copie a <strong>Project URL</strong> (para VITE_SUPABASE_URL)</li>
              <li>Copie a <strong>anon public</strong> key (para VITE_SUPABASE_ANON_KEY)</li>
              <li>Configure essas variáveis no seu projeto Lovable</li>
            </ol>
            <div className="flex justify-center pt-2">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-red-600 hover:bg-red-700"
              >
                Voltar para a Página Inicial
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-viva-blue mb-6" />
        <span className="text-xl font-medium mb-4">Carregando...</span>
        
        {loadingTimeout && !authError && (
          <div className="mt-6 max-w-md text-center p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-4" />
            <p className="text-amber-700 text-lg font-medium mb-3">Está demorando mais do que o esperado</p>
            <p className="text-gray-600 mb-6">
              Isso pode acontecer se você está fazendo login pela primeira vez ou se houver problemas com a conexão.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2 items-center inline-flex"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
              <Button 
                variant="destructive" 
                size="lg"
                onClick={() => window.location.href = '/login'}
              >
                Voltar para o login
              </Button>
            </div>
          </div>
        )}
        
        {authError && (
          <Alert variant="destructive" className="mt-6 max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar perfil</AlertTitle>
            <AlertDescription>
              Ocorreu um erro ao buscar seu perfil. Tente novamente mais tarde.
              <div className="mt-2 pt-2 border-t border-red-200">
                <code className="text-xs opacity-70">{authError}</code>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-3 w-3" />
                  Tentar novamente
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => window.location.href = '/login'}
                >
                  Voltar para o login
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    console.log("Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Verificação específica para rotas que requerem nível admin
  if (nivelRequerido === 'admin') {
    console.log("Rota requer nível admin, verificando permissões...");
    
    if (!isAdmin) {
      console.error("Acesso negado: Usuário não é admin. Role:", profile?.role);
      console.error("Redirecionando para o painel do professor");
      return <Navigate to="/painel" replace />;
    }
    
    console.log("Usuário é admin, permitindo acesso à rota protegida");
  }

  return <>{children}</>;
};

export default RotaProtegida;
