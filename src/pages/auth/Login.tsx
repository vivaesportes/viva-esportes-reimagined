import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/auth/AuthContext';
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Layout from "@/components/ui/layout/Layout";
import Logo from "@/components/ui/Logo";
import { Loader2, Mail, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const { signIn, isAuthenticated, isAdmin, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Estado para verificar se houve erro na autenticação
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = location.state?.from?.pathname || "/painel";

  useEffect(() => {
    // Log detalhado para diagnóstico
    console.log("Login - Estado de autenticação:", { 
      isAuthenticated, 
      isAdmin, 
      profileRole: profile?.role,
      from,
      currentURL: window.location.href,
      host: window.location.host,
      origin: window.location.origin
    });
    
    // Verificar sessão atual manualmente
    const checkCurrentSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Sessão atual:", data.session);
      
      if (data.session) {
        // Já existe uma sessão, mas o estado React pode não refletir isso
        console.log("Sessão existente detectada, atualizando estado...");
      }
    };
    
    checkCurrentSession();
    
    // Redirecionar se já estiver autenticado
    if (isAuthenticated) {
      console.log("Login - Usuário autenticado");
      
      if (isAdmin) {
        console.log("Login - Usuário é admin, redirecionando para /admin");
        navigate("/admin");
      } else {
        console.log("Login - Usuário é professor, redirecionando para /painel");
        navigate("/painel");
      }
    }
  }, [isAuthenticated, isAdmin, profile, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      console.log("Login - Tentando login com:", email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Erro no login:", error);
        setErrorMessage(error.message);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Login bem-sucedido");
        // O redirecionamento será feito pelo useEffect quando isAuthenticated for atualizado
      }
    } catch (error: any) {
      console.error("Erro inesperado:", error);
      setErrorMessage(error.message || "Ocorreu um erro inesperado");
      toast({
        title: "Erro no login",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-viva-blue/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Logo size={80} />
              </div>
              <CardTitle className="text-2xl font-bold">
                Portal do Professor
              </CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar o painel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {errorMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-viva-blue hover:bg-viva-darkBlue"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-500">
                Esqueceu sua senha? Entre em contato com o administrador.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
