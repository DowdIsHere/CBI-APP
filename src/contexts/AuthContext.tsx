import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isDemoMode } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@cbi-app.com',
  user_metadata: { full_name: 'Demo User' },
} as unknown as User;

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(isDemoMode ? DEMO_USER : null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!isDemoMode);

  useEffect(() => {
    if (isDemoMode) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    if (isDemoMode) {
      setUser(DEMO_USER);
      return { error: null };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) return { error: error.message };

    const { data: { user: newUser } } = await supabase.auth.getUser();
    if (newUser) {
      await supabase.from('profiles').upsert({
        id: newUser.id,
        name,
        email,
        condition: '',
        join_date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        allergies: [],
        sensitivities: [],
      });
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      setUser(DEMO_USER);
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    if (isDemoMode) {
      setUser(DEMO_USER);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
