
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define UserProfile type 
export type UserRole = 'professor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  created_at: string;
}

// Define the AuthContext type
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetAuth: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  signIn: async () => ({ error: null, data: null }),
  signOut: async () => {},
  resetAuth: async () => {},
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for authentication
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Helper function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (data) {
        console.log("Profile found:", data);
        setProfile(data as UserProfile);
        return data as UserProfile;
      } else {
        console.log("No profile found, creating one");
        return await createUserProfile(userId);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      toast({
        title: "Error",
        description: "Não foi possível carregar seu perfil",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Helper function to create a user profile
  const createUserProfile = async (userId: string) => {
    try {
      console.log("Creating new profile for user:", userId);
      
      // Get user details
      const { data: userData } = await supabase.auth.getUser();
      const email = userData.user?.email || '';

      // Insert new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          { 
            id: userId,
            email: email,
            nome: email.split('@')[0], // Default name from email
            role: 'professor' // Default role
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }

      console.log("Profile created:", data);
      setProfile(data as UserProfile);
      
      toast({
        title: "Perfil criado",
        description: "Seu perfil foi criado automaticamente",
      });
      
      return data as UserProfile;
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      toast({
        title: "Error",
        description: "Não foi possível criar seu perfil",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Initialize auth state and set up listener for auth changes
  useEffect(() => {
    // Flag to handle component unmounting
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log("Initializing authentication");
        setLoading(true);

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log("Auth state changed:", event, newSession?.user?.id);
            
            if (!isMounted) return;
            
            // Update session and user state
            setSession(newSession);
            setUser(newSession?.user || null);
            
            if (event === 'SIGNED_IN' && newSession?.user) {
              try {
                // Use setTimeout to avoid Supabase listener deadlock
                setTimeout(() => {
                  if (isMounted && newSession?.user) {
                    fetchUserProfile(newSession.user.id);
                  }
                }, 0);
              } catch (error) {
                console.error("Error fetching profile after sign in:", error);
              }
            }
            
            if (event === 'SIGNED_OUT') {
              setProfile(null);
            }
          }
        );

        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (isMounted) {
          console.log("Initial session check:", initialSession?.user?.id);
          setSession(initialSession);
          setUser(initialSession?.user || null);
          
          // Load profile for authenticated user
          if (initialSession?.user) {
            try {
              await fetchUserProfile(initialSession.user.id);
            } catch (error) {
              console.error("Error loading initial profile:", error);
            }
          }
          
          setInitialized(true);
          setLoading(false);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      isMounted = false;
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return { error, data: null };
      }

      console.log("Sign in successful");
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta!",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      setLoading(false);
      return { error, data: null };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setProfile(null);
      toast({
        title: "Logout bem-sucedido",
        description: "Você foi desconectado",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to completely reset auth state
  const resetAuth = async () => {
    try {
      setLoading(true);
      
      // Clear auth state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Force sign out
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear local storage
      localStorage.removeItem('supabase.auth.token');
      
      toast({
        title: "Estado de autenticação resetado",
        description: "Por favor, faça login novamente",
      });
    } catch (error) {
      console.error("Reset auth error:", error);
      toast({
        title: "Erro ao resetar autenticação",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = profile?.role === 'admin';

  // Context value
  const value = {
    session,
    user,
    profile,
    loading,
    isAuthenticated: !!user, // Convert user to boolean
    isAdmin,
    signIn,
    signOut,
    resetAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
