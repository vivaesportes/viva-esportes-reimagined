
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '../types';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log("🔍 Buscando sessão inicial...");
        setLoading(true);
        setAuthError(null);
        
        // First set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
          console.log('🔄 Evento de auth:', event, 'na URL:', window.location.href);
          
          if (isMounted) {
            setSession(currentSession);
            setUser(currentSession?.user || null);
            
            if (event === 'SIGNED_OUT') {
              console.log("🚪 Usuário fez logout");
              setProfile(null);
              setLoading(false);
              setAuthError(null);
            }
          }
        });
        
        // Then check for the current session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        console.log("🔑 Sessão inicial:", initialSession);
        
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
          setAuthInitialized(true);
          setLoading(false);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error('❌ Erro ao carregar sessão inicial:', error);
        if (isMounted) {
          setLoading(false);
          setAuthInitialized(true);
          setAuthError(`Erro ao carregar sessão: ${error.message}`);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
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
  };
};
