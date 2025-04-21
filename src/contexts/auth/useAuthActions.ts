
import { supabase, getLoginRedirectOptions } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/supabase';
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
      // Não estamos usando a opção redirectTo aqui no login com senha
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

  const signOut = async () => {
    try {
      if (!isSupabaseConfigured()) {
        toast({
          title: "Erro ao fazer logout",
          description: "O Supabase não está configurado corretamente.",
          variant: "destructive",
        });
        return;
      }

      await supabase.auth.signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado",
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  return { signIn, signOut };
};
