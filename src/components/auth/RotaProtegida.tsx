
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/contexts/auth/types";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { LoadingState } from "./LoadingState";
import { supabase } from "@/lib/supabase";
import { useLoadingTimeout } from "@/hooks/useLoadingTimeout";

interface RotaProtegidaProps {
  children: React.ReactNode;
  nivelRequerido?: UserRole;
}

const RotaProtegida = ({ children, nivelRequerido }: RotaProtegidaProps) => {
  const { 
    isAuthenticated, 
    loading, 
    profile, 
    isAdmin, 
    resetAuthState, 
    retryProfileFetch, 
    authError,
    databaseCheck,
    checkingDatabase
  } = useAuth();
  
  const location = useLocation();
  const [retrying, setRetrying] = useState(false);
  const [resetAttempted, setResetAttempted] = useState(false);
  const { loadingTimeout, longLoadingTimeout } = useLoadingTimeout(loading);

  // Debug info logging
  useEffect(() => {
    console.log("Protected Route - Auth state:", { 
      isAuthenticated, 
      profileRole: profile?.role,
      isAdmin,
      path: location.pathname,
      loading,
      authError
    });

    // Se estiver autenticado mas não tiver perfil, tente buscar o perfil novamente
    if (isAuthenticated && !profile && !loading && !retrying) {
      console.log("Usuário autenticado mas sem perfil. Tentando buscar perfil...");
      handleRetry();
    }
  }, [isAuthenticated, profile, isAdmin, location, loading, authError]);

  // Handlers for loading state actions
  const handleRetry = async () => {
    setRetrying(true);
    try {
      console.log("Tentando recarregar perfil...");
      await retryProfileFetch();
    } catch (error) {
      console.error("Erro ao recarregar perfil:", error);
    } finally {
      setTimeout(() => setRetrying(false), 2000);
    }
  };

  const handleReset = () => {
    setResetAttempted(true);
    resetAuthState();
    // Reset will be handled by auth state changes
  };

  const handleForceLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  // Se estiver carregando ou verificando o banco de dados
  if (loading || checkingDatabase) {
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
        checkingDatabase={checkingDatabase || false}
      />
    );
  }

  // Se não estiver autenticado após carregar, redirecione para login
  if (!isAuthenticated) {
    console.log("Usuário não autenticado. Redirecionando para login.");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Se estiver autenticado mas não tiver perfil
  if (isAuthenticated && !profile) {
    console.log("Usuário autenticado mas sem perfil. Exibindo estado de carregamento.");
    return (
      <LoadingState
        loadingTimeout={true}
        longLoadingTimeout={longLoadingTimeout}
        retrying={retrying}
        resetAttempted={resetAttempted}
        onRetry={handleRetry}
        onReset={handleReset}
        onForceLogout={handleForceLogout}
        authError="Perfil de usuário não encontrado"
        databaseCheck={databaseCheck}
        checkingDatabase={checkingDatabase || false}
      />
    );
  }

  // Verifica se o usuário tem o nível requerido
  if (nivelRequerido === 'admin' && !isAdmin) {
    console.error("Acesso negado: Usuário não é admin. Role:", profile?.role);
    return <Navigate to="/painel" replace />;
  }

  return <>{children}</>;
};

export default RotaProtegida;
