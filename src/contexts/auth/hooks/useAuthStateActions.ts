
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '../types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface AuthStateActions {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  setAuthInitialized: (initialized: boolean) => void;
}

export const useAuthStateActions = (actions: AuthStateActions) => {
  const { setSession, setUser, setProfile, setLoading, setAuthError, setAuthInitialized } = actions;

  const resetAuthState = async () => {
    console.log("🔄 Iniciando reset completo do estado de autenticação");
    
    try {
      // Limpar estados locais primeiro
      setSession(null);
      setUser(null);
      setProfile(null);
      setAuthError(null);
      setLoading(false);
      setAuthInitialized(false);
      
      // Forçar logout no Supabase (sem falhar se já estiver deslogado)
      try {
        await supabase.auth.signOut();
        console.log("✅ Logout do Supabase realizado");
      } catch (e) {
        console.warn("⚠️ Erro ao fazer logout do Supabase:", e);
      }
      
      // Reforçar limpeza do storage local
      try {
        localStorage.removeItem('supabase.auth.token');
        console.log("✅ Token local removido");
      } catch (e) {
        console.warn("⚠️ Erro ao limpar token local:", e);
      }
      
      // Reiniciar o processo de autenticação
      setTimeout(() => {
        setAuthInitialized(true);
        console.log("✅ Estado de autenticação resetado");
        
        toast({
          title: "Estado resetado",
          description: "O estado de autenticação foi resetado. Tente fazer login novamente.",
        });
      }, 500);
    } catch (error) {
      console.error("❌ Erro ao resetar estado:", error);
      toast({
        title: "Erro ao resetar estado",
        description: "Não foi possível resetar o estado de autenticação.",
        variant: "destructive",
      });
    }
  };

  return {
    resetAuthState
  };
};
