
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/auth/AuthProvider";

const Login = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Login page - Auth state:", { isAuthenticated, isAdmin });
    
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/painel");
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
