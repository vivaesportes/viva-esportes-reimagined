
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
      loading
    });
  }, [isAuthenticated, profile, isAdmin, location, loading]);

  // Handlers for loading state actions
  const handleRetry = async () => {
    setRetrying(true);
    try {
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

  // Check if we're in a loading state
  if (loading || (isAuthenticated && !profile)) {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (nivelRequerido === 'admin' && !isAdmin) {
    console.error("Acesso negado: Usuário não é admin. Role:", profile?.role);
    return <Navigate to="/painel" replace />;
  }

  return <>{children}</>;
};

export default RotaProtegida;
