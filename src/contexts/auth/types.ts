
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'professor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  created_at: string;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authError: string | null;
  retryProfileFetch: () => Promise<UserProfile>;
  resetAuthState: () => void;
  databaseCheck?: string | null;
  checkingDatabase?: boolean;
}
