import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import {
  supabase,
  signIn,
  signUp,
  signOut,
  getSession,
  resetPassword,
  resendVerificationEmail,
} from '../services/supabase';
import { logger } from '../services/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial session
    loadSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          logger.setUser(null);
        } else if (newSession?.user) {
          logger.setUser({ id: newSession.user.id, email: newSession.user.email });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadSession = async () => {
    try {
      const { session } = await getSession();
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        return { success: false, error: error.message };
      }

      setSession(data.session);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Failed to sign in. Please try again.' };
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      const { data, error } = await signUp(email, password);

      if (error) {
        return { success: false, error: error.message };
      }

      // Note: User may need to verify email depending on Supabase settings
      if (data.user && !data.session) {
        return {
          success: true,
          error: 'Please check your email to verify your account.',
        };
      }

      setSession(data.session);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Failed to create account. Please try again.' };
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await resetPassword(email);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error) {
      logger.captureException(error, { source: 'resetPassword' });
      return { success: false, error: 'Failed to send reset email. Please try again.' };
    }
  };

  const handleResendVerification = async (email: string) => {
    try {
      const { error } = await resendVerificationEmail(email);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error) {
      logger.captureException(error, { source: 'resendVerification' });
      return { success: false, error: 'Failed to resend verification email.' };
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      setSession(null);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: 'Failed to sign out. Please try again.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!session,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        resetPassword: handleResetPassword,
        resendVerification: handleResendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
