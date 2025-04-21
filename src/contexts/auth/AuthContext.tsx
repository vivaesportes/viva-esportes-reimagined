
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
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const { profile, setProfile, fetchProfile } = useProfile();
  const { signIn, signOut } = useAuthActions();

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase não está configurado com variáveis de ambiente válidas.');
      setLoading(false);
      return;
    }

    const getInitialSession = async () => {
      try {
        console.log("🔍 Buscando sessão inicial...");
        setLoading(true);
        
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("🔑 Sessão inicial:", initialSession);
        
        setSession(initialSession);
        setUser(initialSession?.user || null);
        
        if (initialSession?.user) {
          console.log("👤 Usuário encontrado na sessão:", initialSession.user.id);
          // Adicionando um pequeno atraso para evitar condições de corrida
          setTimeout(async () => {
            await fetchProfile(initialSession.user.id);
            setLoading(false);
          }, 500);
        } else {
          console.log("🚫 Nenhum usuário encontrado na sessão");
          setLoading(false);
        }
        
        setAuthInitialized(true);
      } catch (error) {
        console.error('❌ Erro ao carregar sessão inicial:', error);
        setLoading(false);
        setAuthInitialized(true);
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
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (event === 'SIGNED_IN' && currentSession?.user) {
        console.log("🔓 Usuário fez login:", currentSession.user.id);
        setLoading(true);
        
        // Adicionando um pequeno atraso para evitar condições de corrida
        setTimeout(async () => {
          await fetchProfile(currentSession.user.id);
          setLoading(false);
        }, 500);
      } else if (event === 'SIGNED_OUT') {
        console.log("🚪 Usuário fez logout");
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const isAdmin = profile?.role === 'admin';
  
  console.log("🔍 Estado atual de autenticação (isAdmin calculado):", {
    userId: user?.id,
    profileId: profile?.id,
    profileRole: profile?.role,
    calculatedIsAdmin: isAdmin,
    authenticated: !!user
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
