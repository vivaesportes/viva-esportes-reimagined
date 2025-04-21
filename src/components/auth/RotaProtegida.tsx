
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/contexts/AuthContext";
import { Loader2, AlertTriangle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface RotaProtegidaProps {
  children: React.ReactNode;
  nivelRequerido?: UserRole;
}

const RotaProtegida = ({ children, nivelRequerido }: RotaProtegidaProps) => {
  const { isAuthenticated, loading, profile, isAdmin } = useAuth();
  const location = useLocation();

  // Logs detalhados para debug
  console.log("RotaProtegida - Caminho atual:", location.pathname);
  console.log("RotaProtegida - Perfil do usuário:", profile);
  console.log("RotaProtegida - É admin?", isAdmin, "Role do perfil:", profile?.role);
  console.log("RotaProtegida - Nível requerido:", nivelRequerido);

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-viva-blue" />
        <span className="ml-2 text-lg">Carregando...</span>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    console.log("Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Verificação específica para rotas de administrador
  if (nivelRequerido === 'admin') {
    console.log("Rota requer nível admin, verificando permissões...");
    
    if (!isAdmin) {
      console.error("Acesso negado: Usuário não é admin. Role:", profile?.role);
      console.error("Redirecionando para o painel do professor");
      return <Navigate to="/painel" replace />;
    }
    
    console.log("Usuário é admin, permitindo acesso à rota protegida");
  }

  // Verificação específica para rota /admin
  if (location.pathname === "/admin") {
    console.log("Tentativa de acesso ao caminho /admin");
    
    if (!isAdmin) {
      console.error("Tentativa de acesso ao painel admin por usuário não-admin");
      return <Navigate to="/painel" replace />;
    }
    
    console.log("Usuário é admin, permitindo acesso ao painel admin");
  }

  return <>{children}</>;
};

export default RotaProtegida;
