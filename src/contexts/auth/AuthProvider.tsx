
import React, { createContext } from 'react';
import { useAuthState } from './hooks/useAuthState';
import { useProfile } from './hooks/useProfile';
import { useAuthActions } from './hooks/useAuthActions';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    session,
    user,
    loading,
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

  const { signIn, signOut } = useAuthActions();

  const resetAuthState = () => {
    signOut();
  };

  const retryProfileFetch = async () => {
    if (user?.id) {
      console.log("Tentando buscar perfil novamente para o usuário:", user.id);
      try {
        const profileData = await fetchProfile(user.id);
        console.log("Perfil obtido com sucesso:", profileData);
        return profileData;
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        throw error;
      }
    } else {
      console.error("Não é possível buscar o perfil: usuário não está autenticado");
      throw new Error("Usuário não autenticado");
    }
  };

  // Context value
  const value: AuthContextType = {
    session,
    user,
    profile,
    loading: loading || profileLoading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    signIn,
    signOut,
    authError: authError || profileError,
    retryProfileFetch,
    resetAuthState
  };

  if (!authInitialized) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export const useAuth = () => React.useContext(AuthContext);
