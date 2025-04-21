
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'professor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  created_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se o Supabase está configurado
    if (!isSupabaseConfigured()) {
      console.warn('Supabase não está configurado com variáveis de ambiente válidas.');
      setLoading(false);
      return;
    }

    // Obter a sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user || null);
        
        if (initialSession?.user) {
          await fetchProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error('Erro ao carregar sessão inicial:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Evento de auth:', event);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (event === 'SIGNED_IN' && currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Buscando perfil para o usuário ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error.message);
        throw error;
      }

      if (data) {
        console.log('Perfil encontrado:', data);
        setProfile(data as UserProfile);
      } else {
        console.warn('Nenhum perfil encontrado para o usuário ID:', userId);
      }
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error.message);
    }
  };

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

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      }

      if (data.user) {
        await fetchProfile(data.user.id);
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

  // Calcula se o usuário é admin com base no perfil
  const isAdmin = profile?.role === 'admin';

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
