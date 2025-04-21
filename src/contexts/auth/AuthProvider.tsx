
import React, { createContext, useContext, useEffect } from 'react';
import { useAuthState } from './hooks/useAuthState';
import { useProfile } from './hooks/useProfile';
import { useAuthActions } from './hooks/useAuthActions';
import { AuthContextType } from './types';
import { useDatabaseCheck } from '@/hooks/useDatabaseCheck';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    session,
    user,
    loading: authLoading,
    authError,
    profile,
    setProfile,
    authInitialized
  } = useAuthState();

  const {
    fetchProfile,
    profileError,
    profileLoading
  } = useProfile();

  const { databaseCheck, checkingDatabase, checkProfileInDatabase } = useDatabaseCheck();
  const { signIn, signOut } = useAuthActions();

  // Attempt to load profile when user is available
  useEffect(() => {
    let mounted = true;
    
    const loadUserProfile = async () => {
      if (user?.id && !profile && authInitialized) {
        try {
          console.log("📝 Carregando perfil do usuário:", user.id);
          const profileData = await fetchProfile(user.id);
          
          if (mounted) {
            console.log("✅ Perfil carregado com sucesso:", profileData);
          }
        } catch (err: any) {
          if (mounted) {
            console.error("❌ Falha ao carregar perfil:", err.message);
            toast({
              title: "Erro ao carregar perfil",
              description: "Ocorreu um erro ao carregar seu perfil. Tente novamente.",
              variant: "destructive",
            });
          }
        }
      }
    };

    loadUserProfile();
    
    return () => {
      mounted = false;
    };
  }, [user?.id, profile, authInitialized, fetchProfile]);

  const resetAuthState = () => {
    setProfile(null);
    signOut();
  };

  const retryProfileFetch = async () => {
    if (user?.id) {
      console.log("🔄 Tentando buscar perfil novamente para o usuário:", user.id);
      
      // Also check database connection
      checkProfileInDatabase(user);
      
      try {
        const profileData = await fetchProfile(user.id);
        console.log("✅ Perfil obtido com sucesso:", profileData);
        toast({
          title: "Perfil recuperado",
          description: "Seu perfil foi carregado com sucesso.",
        });
        return profileData;
      } catch (error: any) {
        console.error("❌ Erro ao buscar perfil:", error.message);
        toast({
          title: "Erro ao recuperar perfil",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    } else {
      console.error("❌ Não é possível buscar o perfil: usuário não está autenticado");
      toast({
        title: "Erro de autenticação",
        description: "Usuário não está autenticado",
        variant: "destructive",
      });
      throw new Error("Usuário não autenticado");
    }
  };

  // Context value
  const value: AuthContextType = {
    session,
    user,
    profile,
    loading: authLoading || profileLoading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    signIn,
    signOut,
    authError: authError || profileError,
    retryProfileFetch,
    resetAuthState,
    databaseCheck,
    checkingDatabase
  };

  // Only render children when auth is initialized to prevent flash of unprotected content
  if (!authInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Inicializando autenticação...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
