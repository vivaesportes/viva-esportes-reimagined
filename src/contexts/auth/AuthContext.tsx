
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/supabase';
import { AuthContextType } from './types';
import { useProfile } from './useProfile';
import { useAuthActions } from './useAuthActions';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: null, data: null }),
  signOut: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  authError: null,
  retryProfileFetch: async () => {},
  resetAuthState: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { 
    profile, 
    setProfile, 
    fetchProfile, 
    profileError, 
    profileLoading, 
    clearProfile 
  } = useProfile();
  const { signIn, signOut } = useAuthActions();

  // Função para tentar buscar o perfil novamente com melhor tratamento de erro
  const retryProfileFetch = useCallback(async () => {
    if (!user) {
      toast({
        title: "Erro ao recarregar perfil",
        description: "Você precisa estar logado para carregar seu perfil.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAuthError(null);
    console.log("🔄 Tentando carregar perfil novamente para o usuário:", user.id);
    
    try {
      // Forçar recarregamento da sessão primeiro
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (!sessionData.session) {
        throw new Error("Sessão inválida. Faça login novamente.");
      }
      
      // Tentar buscar o perfil
      await fetchProfile(user.id);
      setLoading(false);
      
      toast({
        title: "Perfil carregado",
        description: "Seu perfil foi carregado com sucesso.",
      });
    } catch (error: any) {
      console.error("❌ Erro ao recarregar perfil:", error.message);
      setAuthError(`Erro ao recarregar perfil: ${error.message}`);
      setLoading(false);
      toast({
        title: "Erro ao recarregar perfil",
        description: error.message || "Não foi possível carregar seu perfil.",
        variant: "destructive",
      });
    }
  }, [user, fetchProfile]);

  // Função melhorada para resetar o estado de autenticação
  const resetAuthState = useCallback(async () => {
    console.log("🔄 Iniciando reset completo do estado de autenticação");
    
    try {
      // Limpar estados locais primeiro
      setSession(null);
      setUser(null);
      clearProfile();
      setAuthError(null);
      setLoading(false);
      setAuthInitialized(false);
      
      // Forçar logout no Supabase (sem falhar se já estiver deslogado)
      try {
        await supabase.auth.signOut();
        console.log("✅ Logout do Supabase realizado");
      } catch (e) {
        console.warn("⚠️ Erro ao fazer logout do Supabase:", e);
        // Continuamos mesmo se houver erro no logout
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
  }, [clearProfile]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase não está configurado com variáveis de ambiente válidas.');
      setLoading(false);
      return;
    }

    let isMounted = true;
    
    const getInitialSession = async () => {
      try {
        console.log("🔍 Buscando sessão inicial...");
        setLoading(true);
        setAuthError(null);
        
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("🔑 Sessão inicial:", initialSession);
        
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
          
          if (initialSession?.user) {
            console.log("👤 Usuário encontrado na sessão:", initialSession.user.id);
            
            try {
              await fetchProfile(initialSession.user.id);
            } catch (error: any) {
              console.error("❌ Erro ao buscar perfil na inicialização:", error.message);
              setAuthError(`Erro ao buscar perfil: ${error.message}`);
            } finally {
              if (isMounted) setLoading(false);
            }
          } else {
            console.log("🚫 Nenhum usuário encontrado na sessão");
            setLoading(false);
          }
          
          setAuthInitialized(true);
        }
      } catch (error: any) {
        console.error('❌ Erro ao carregar sessão inicial:', error);
        if (isMounted) {
          setLoading(false);
          setAuthInitialized(true);
          setAuthError(`Erro ao carregar sessão: ${error.message}`);
        }
        toast({
          title: "Erro ao carregar sessão",
          description: "Não foi possível recuperar sua sessão. Por favor, faça login novamente.",
          variant: "destructive",
        });
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('🔄 Evento de auth:', event);
      
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          console.log("🔓 Usuário fez login:", currentSession.user.id);
          setLoading(true);
          
          try {
            await fetchProfile(currentSession.user.id);
          } catch (error: any) {
            console.error("❌ Erro ao buscar perfil após login:", error.message);
            setAuthError(`Erro ao buscar perfil: ${error.message}`);
          } finally {
            if (isMounted) setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("🚪 Usuário fez logout");
          setProfile(null);
          setLoading(false);
          setAuthError(null);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, setProfile, clearProfile]);

  useEffect(() => {
    // Se houver erro no perfil, armazena-o como erro de autenticação
    if (profileError) {
      setAuthError(profileError);
    }
  }, [profileError]);

  const isAdmin = profile?.role === 'admin';
  
  console.log("🔍 Estado atual de autenticação:", {
    userId: user?.id,
    profileId: profile?.id,
    profileRole: profile?.role,
    isAdmin,
    authenticated: !!user,
    error: authError,
    loading: loading || profileLoading || !authInitialized
  });

  const value = {
    session,
    user,
    profile,
    loading: loading || profileLoading || !authInitialized,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin,
    authError,
    retryProfileFetch,
    resetAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
