
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/contexts/auth/types";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { LoadingState } from "./LoadingState";
import { supabase } from "@/lib/supabase";

interface RotaProtegidaProps {
  children: React.ReactNode;
  nivelRequerido?: UserRole;
}

const RotaProtegida = ({ children, nivelRequerido }: RotaProtegidaProps) => {
  const { isAuthenticated, loading, profile, isAdmin, resetAuthState, retryProfileFetch } = useAuth();
  const location = useLocation();
  const [showDebug, setShowDebug] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [longLoadingTimeout, setLongLoadingTimeout] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [resetAttempted, setResetAttempted] = useState(false);
  const [databaseCheck, setDatabaseCheck] = useState<string | null>(null);
  const [checkingDatabase, setCheckingDatabase] = useState(false);

  // Set timeouts for better UX during loading
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let longTimeoutId: NodeJS.Timeout | null = null;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 2000);
      
      longTimeoutId = setTimeout(() => {
        setLongLoadingTimeout(true);
        checkDatabaseConnection();
      }, 5000);
    } else {
      setLoadingTimeout(false);
      setLongLoadingTimeout(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (longTimeoutId) clearTimeout(longTimeoutId);
    };
  }, [loading]);

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

  // Function to check database connection
  const checkDatabaseConnection = async () => {
    try {
      setCheckingDatabase(true);
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        setDatabaseCheck(`Erro ao conectar com o banco: ${error.message}`);
      } else {
        setDatabaseCheck(`Conexão com banco de dados OK. Contagem: ${JSON.stringify(data)}`);
      }
    } catch (e: any) {
      setDatabaseCheck(`Erro ao verificar banco: ${e.message}`);
    } finally {
      setCheckingDatabase(false);
    }
  };

  // Handlers for loading state actions
  const handleRetry = async () => {
    setRetrying(true);
    await retryProfileFetch();
    setTimeout(() => setRetrying(false), 2000);
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
        authError={null}
        databaseCheck={databaseCheck}
        checkingDatabase={checkingDatabase}
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
