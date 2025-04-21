
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { toast } from "@/hooks/use-toast";

export const useLoginForm = () => {
  const { signIn, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      console.log("Attempting login with:", email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error);
        setErrorMessage(error.message);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      setErrorMessage(error.message || "Ocorreu um erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    showPassword,
    setShowPassword,
    errorMessage,
    handleSubmit,
    isAuthenticated,
    isAdmin
  };
};
