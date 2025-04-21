
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/contexts/auth/types";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { Button } from "@/components/ui/button";

interface RotaProtegidaProps {
  children: React.ReactNode;
  nivelRequerido?: UserRole;
}

const RotaProtegida = ({ children, nivelRequerido }: RotaProtegidaProps) => {
  const { isAuthenticated, loading, profile, isAdmin, resetAuthState } = useAuth();
  const location = useLocation();
  const [showDebug, setShowDebug] = useState(false);
  const [longWait, setLongWait] = useState(false);

  // Set a timeout to show additional UI if loading takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLongWait(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

  // Debug info logging
  useEffect(() => {
    console.log("Protected Route - Auth state:", { 
      isAuthenticated, 
      profileRole: profile?.role,
      isAdmin,
      path: location.pathname
    });
  }, [isAuthenticated, profile, isAdmin, location]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 text-viva-blue animate-spin mb-4" />
        <h2 className="text-xl font-bold mb-2">Verificando autenticação...</h2>
        
        {longWait && (
          <div className="mt-8 max-w-md">
            <p className="text-orange-600 mb-4">
              Está demorando mais que o esperado. Isso pode ocorrer devido a problemas de conexão.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDebug(!showDebug)}
              >
                {showDebug ? "Ocultar detalhes" : "Mostrar detalhes"}
              </Button>
              <Button 
                variant="destructive" 
                onClick={resetAuthState}
              >
                Resetar autenticação
              </Button>
            </div>
            
            {showDebug && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md text-xs font-mono overflow-auto max-h-64">
                <p>Caminho: {location.pathname}</p>
                <p>Autenticado: {isAuthenticated ? "Sim" : "Não"}</p>
                <p>Admin: {isAdmin ? "Sim" : "Não"}</p>
                <p>Perfil: {profile ? JSON.stringify(profile, null, 2) : "Não carregado"}</p>
              </div>
            )}
          </div>
        )}
      </div>
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
