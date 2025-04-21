
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { UserRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

interface RotaProtegidaProps {
  children: React.ReactNode;
  nivelRequerido?: UserRole;
}

const RotaProtegida = ({ children, nivelRequerido }: RotaProtegidaProps) => {
  const { isAuthenticated, loading, profile } = useAuth();

  // Verifica se o Supabase está configurado
  const supabaseConfigured = isSupabaseConfigured();

  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Erro de Configuração</h2>
          <p className="text-red-600 mb-4">
            As variáveis de ambiente do Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) não estão configuradas.
          </p>
          <p className="text-gray-600 text-sm">
            Por favor, verifique as configurações do projeto no painel do Supabase e atualize as variáveis de ambiente.
          </p>
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar nível de acesso, se necessário
  if (nivelRequerido && profile?.role !== nivelRequerido) {
    return <Navigate to="/painel" replace />;
  }

  return <>{children}</>;
};

export default RotaProtegida;
