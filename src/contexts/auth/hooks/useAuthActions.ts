
import { supabase, getLoginRedirectOptions, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const useAuthActions = () => {
  const signIn = async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured()) {
        toast({
          title: "Erro ao fazer login",
          description: "O Supabase não está configurado corretamente.",
          variant: "destructive",
        });
        return { error: new Error("Supabase não configurado"), data: null };
      }

      console.log("Tentando login com e-mail:", email);
      console.log("URL de redirecionamento:", getLoginRedirectOptions().redirectTo);
      
      // Tentar login com e-mail e senha
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro durante o login:", error.message);
        let mensagemErro = error.message;
        
        if (error.message === "Email not confirmed") {
          mensagemErro = "Email não confirmado. Verifique sua caixa de entrada para confirmação.";
        }
        
        toast({
          title: "Erro ao fazer login",
          description: mensagemErro,
          variant: "destructive",
        });
        return { error, data: null };
      }

      if (data.user) {
        console.log("Login bem-sucedido para o usuário:", data.user.id);
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      }

      return { data, error: null };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      if (!isSupabaseConfigured()) {
        toast({
          title: "Erro ao fazer logout",
          description: "O Supabase não está configurado corretamente.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Iniciando processo de logout...");
      
      // Executa o logout no Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      console.log("Logout concluído com sucesso no Supabase");
      
      // Limpar qualquer dado de autenticação persistente
      localStorage.removeItem('viva_auth_token');
      localStorage.removeItem('supabase.auth.token');
      
      // Informar usuário do logout bem-sucedido
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado",
      });
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  return { signIn, signOut };
};
