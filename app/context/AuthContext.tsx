import { User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

// Define what our auth context will provide
type AuthContextType = {
  user: User | null;          // The current user (null if not logged in)
  loading: boolean;           // Whether we're loading auth state
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;       // Any error message
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  error: null,
});

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and provides auth functionality
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for user, loading, and errors
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in when app starts
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // Sign up new user
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);

      // Create user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (signUpError) throw signUpError;

      // Create user profile in database
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: name,
          updated_at: new Date().toISOString(),
        });
      }

      setUser(data.user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setUser(data.user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 