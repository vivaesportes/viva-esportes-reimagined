
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { isAuthenticated, isAdmin, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    console.log("Login page - Auth state:", { 
      isAuthenticated, 
      isAdmin, 
      profile, 
      loading 
    });
    
    if (isAuthenticated && !loading && profile) {
      console.log("Redirecionando usuário autenticado:", profile);
      setRedirecting(true);
      
      const redirectTimeout = setTimeout(() => {
        if (isAdmin) {
          console.log("Redirecionando para admin");
          navigate("/admin");
        } else {
          console.log("Redirecionando para painel");
          navigate("/painel");
        }
      }, 500);
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [isAuthenticated, isAdmin, navigate, loading, profile]);

  // Se já estiver autenticado mas ainda não tiver o perfil ou estiver carregando
  if (isAuthenticated && (loading || !profile)) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-viva-blue mb-4" />
          <p className="text-gray-600">Carregando seu perfil...</p>
        </div>
      </AuthLayout>
    );
  }

  // Se estiver redirecionando
  if (redirecting) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-viva-blue mb-4" />
          <p className="text-gray-600">Redirecionando para o painel...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
