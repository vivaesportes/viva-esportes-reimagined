
import React, { createContext, useContext, useEffect, useState } from 'react';
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
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { profile, setProfile, fetchProfile, profileError } = useProfile();
  const { signIn, signOut } = useAuthActions();

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
              // Adicionando um pequeno atraso para evitar condições de corrida
              await new Promise(resolve => setTimeout(resolve, 500));
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
            // Adicionando um pequeno atraso para evitar condições de corrida
            await new Promise(resolve => setTimeout(resolve, 500));
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
  }, [fetchProfile]);

  useEffect(() => {
    // Se houver erro no perfil, armazena-o como erro de autenticação
    if (profileError) {
      setAuthError(profileError);
    }
  }, [profileError]);

  const isAdmin = profile?.role === 'admin';
  
  console.log("🔍 Estado atual de autenticação (isAdmin calculado):", {
    userId: user?.id,
    profileId: profile?.id,
    profileRole: profile?.role,
    calculatedIsAdmin: isAdmin,
    authenticated: !!user,
    error: authError
  });

  const value = {
    session,
    user,
    profile,
    loading: loading || !authInitialized,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin,
    authError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
