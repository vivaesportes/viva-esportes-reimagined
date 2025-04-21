
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserRole } from "@/contexts/auth/types";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { LoadingState } from "./LoadingState";
import { SupabaseConfigCheck } from "./SupabaseConfigCheck";
import { useLoadingTimeout } from "@/hooks/useLoadingTimeout";
import { useDatabaseCheck } from "@/hooks/useDatabaseCheck";

interface RotaProtegidaProps {
  children: React.ReactNode;
  nivelRequerido?: UserRole;
}

const RotaProtegida = ({ children, nivelRequerido }: RotaProtegidaProps) => {
  const { isAuthenticated, loading, profile, isAdmin, authError, retryProfileFetch, resetAuthState, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [retrying, setRetrying] = useState(false);
  const [resetAttempted, setResetAttempted] = useState(false);
  
  const { loadingTimeout, longLoadingTimeout } = useLoadingTimeout(loading);
  const { databaseCheck, checkingDatabase, checkProfileInDatabase } = useDatabaseCheck();

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
      navigate('/login');
    }
  };

  // Verifica se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    return <SupabaseConfigCheck />;
  }

  if (loading) {
    return (
      <LoadingState
        loadingTimeout={loadingTimeout}
        longLoadingTimeout={longLoadingTimeout}
        retrying={retrying}
        resetAttempted={resetAttempted}
        onRetry={handleRetry}
        onReset={handleReset}
        onForceLogout={handleForceLogout}
        authError={authError}
        databaseCheck={databaseCheck}
        checkingDatabase={checkingDatabase}
      />
    );
  }

  if (!isAuthenticated) {
    console.log("Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (nivelRequerido === 'admin' && !isAdmin) {
    console.error("Acesso negado: Usuário não é admin. Role:", profile?.role);
    console.error("Redirecionando para o painel do professor");
    return <Navigate to="/painel" replace />;
  }

  return <>{children}</>;
};

export default RotaProtegida;
