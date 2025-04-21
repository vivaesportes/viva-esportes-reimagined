
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
      await fetchProfile(user.id);
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

// Reexporte o hook useAuth
export { AuthContext, type AuthContextType };
export const useAuth = () => React.useContext(AuthContext);
