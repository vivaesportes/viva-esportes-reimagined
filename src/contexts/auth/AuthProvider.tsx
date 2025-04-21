
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './hooks/useAuthState';
import { useAuthStateActions } from './hooks/useAuthStateActions';
import { useProfile } from './useProfile';
import { useAuthActions } from './useAuthActions';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
  const {
    session,
    setSession,
    user,
    setUser,
    loading,
    setLoading,
    authInitialized,
    setAuthInitialized,
    authError,
    setAuthError,
    profile,
    setProfile
  } = useAuthState();

  const { resetAuthState } = useAuthStateActions({
    setSession,
    setUser,
    setProfile,
    setLoading,
    setAuthError,
    setAuthInitialized
  });

  const { 
    profile: profileData, 
    fetchProfile, 
    profileError, 
    clearProfile 
  } = useProfile();

  const { signIn, signOut } = useAuthActions();

  const retryProfileFetch = async () => {
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
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (!sessionData.session) {
        throw new Error("Sessão inválida. Faça login novamente.");
      }
      
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
  };

  React.useEffect(() => {
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
    loading: loading || !authInitialized
  });

  const value = {
    session,
    user,
    profile: profileData,
    loading: loading || !authInitialized,
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
