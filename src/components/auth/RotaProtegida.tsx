
import { useAuth } from "@/contexts/auth/AuthContext";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserRole } from "@/contexts/auth/types";
import { Loader2, AlertTriangle, RefreshCw, LogOut } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface RotaProtegidaProps {
  children: React.ReactNode;
  nivelRequerido?: UserRole;
}

const RotaProtegida = ({ children, nivelRequerido }: RotaProtegidaProps) => {
  const { isAuthenticated, loading, profile, isAdmin, authError, retryProfileFetch, resetAuthState, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [longLoadingTimeout, setLongLoadingTimeout] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [resetAttempted, setResetAttempted] = useState(false);
  const [databaseCheck, setDatabaseCheck] = useState<string | null>(null);
  const [checkingDatabase, setCheckingDatabase] = useState(false);

  // Timeout para mostrar mensagem de erro se o carregamento demorar muito
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let longTimeoutId: NodeJS.Timeout;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 3000); // 3 segundos
      
      longTimeoutId = setTimeout(() => {
        setLongLoadingTimeout(true);
      }, 10000); // 10 segundos
    } else {
      setLoadingTimeout(false);
      setLongLoadingTimeout(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (longTimeoutId) clearTimeout(longTimeoutId);
    };
  }, [loading]);

  // Logs detalhados para debug
  console.log("RotaProtegida - Caminho atual:", location.pathname);
  console.log("RotaProtegida - Perfil do usuário:", profile);
  console.log("RotaProtegida - É admin?", isAdmin, "Role do perfil:", profile?.role);
  console.log("RotaProtegida - Nível requerido:", nivelRequerido);
  console.log("RotaProtegida - Loading:", loading, "Loading timeout:", loadingTimeout);
  console.log("RotaProtegida - Erro de autenticação:", authError);
  console.log("RotaProtegida - Reset tentado:", resetAttempted);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await retryProfileFetch();
    } finally {
      setRetrying(false);
    }
  };

  const handleReset = () => {
    resetAuthState();
    setResetAttempted(true);
  };

  const handleForceLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout forçado",
        description: "Você foi desconectado. Por favor, faça login novamente.",
      });
      navigate('/login');
    } catch (error) {
      console.error("Erro ao forçar logout:", error);
      // Redirecionar mesmo se houver erro
      navigate('/login');
    }
  };

  const checkProfileInDatabase = async () => {
    if (!user?.id) {
      setDatabaseCheck("Nenhum usuário autenticado para verificar");
      return;
    }
    
    setCheckingDatabase(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) {
        setDatabaseCheck(`Erro ao verificar perfil: ${error.message}`);
      } else if (!data) {
        setDatabaseCheck("Perfil não encontrado no banco de dados");
      } else {
        setDatabaseCheck(`Perfil encontrado: ${JSON.stringify(data)}`);
      }
    } catch (error: any) {
      setDatabaseCheck(`Erro na verificação: ${error.message}`);
    } finally {
      setCheckingDatabase(false);
    }
  };

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
                onClick={() => navigate('/')}
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
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2 items-center inline-flex"
                onClick={handleRetry}
                disabled={retrying}
              >
                <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
                {retrying ? 'Tentando...' : 'Tentar novamente'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2 items-center inline-flex"
                onClick={handleReset}
                disabled={resetAttempted}
              >
                <RefreshCw className="h-4 w-4" />
                Resetar estado
              </Button>
              <Button 
                variant="destructive" 
                size="lg"
                onClick={handleForceLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Voltar para o login
              </Button>
            </div>
            
            {longLoadingTimeout && (
              <div className="mt-8 border-t border-amber-200 pt-6">
                <h3 className="font-medium text-amber-800 mb-4">Diagnóstico Avançado</h3>
                
                <div className="flex justify-center mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={checkProfileInDatabase}
                    disabled={checkingDatabase}
                    className="text-amber-700 border-amber-300"
                  >
                    {checkingDatabase ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        Verificando banco de dados...
                      </>
                    ) : (
                      'Verificar perfil no banco de dados'
                    )}
                  </Button>
                </div>
                
                {databaseCheck && (
                  <div className="bg-white p-3 rounded border border-amber-200 text-sm font-mono text-amber-800 max-h-32 overflow-y-auto">
                    {databaseCheck}
                  </div>
                )}
                
                <div className="mt-4 text-sm text-amber-700">
                  <p>Usuário atual: {user?.id || 'Nenhum'}</p>
                  <p>Email: {user?.email || 'Indisponível'}</p>
                  <p className="mt-2">Se o problema persistir, tente limpar o cache do navegador ou usar uma janela anônima.</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {authError && (
          <Alert variant="destructive" className="mt-6 max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar perfil</AlertTitle>
            <AlertDescription>
              Ocorreu um erro ao buscar seu perfil. Tente novamente ou volte para a tela de login.
              <div className="mt-2 pt-2 border-t border-red-200">
                <code className="text-xs opacity-70">{authError}</code>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1"
                  onClick={handleRetry}
                  disabled={retrying}
                >
                  <RefreshCw className={`h-3 w-3 ${retrying ? 'animate-spin' : ''}`} />
                  {retrying ? 'Tentando...' : 'Tentar novamente'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1"
                  onClick={handleReset}
                  disabled={resetAttempted}
                >
                  <RefreshCw className="h-3 w-3" />
                  Resetar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleForceLogout}
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
