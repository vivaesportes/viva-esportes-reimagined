
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    console.log("Login page - Auth state:", { isAuthenticated, isAdmin, loading });
    
    if (isAuthenticated && !loading) {
      setRedirecting(true);
      const redirectTimeout = setTimeout(() => {
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/painel");
        }
      }, 500); // Small delay to prevent immediate redirects that might cause UI flicker
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [isAuthenticated, isAdmin, navigate, loading]);

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
