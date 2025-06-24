import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkAuthStatus(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        checkAuthStatus(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      setIsStudent(false);
      
      // Check for local student authentication
      const studentId = localStorage.getItem('studentId');
      const studentEmail = localStorage.getItem('studentEmail');
      if (studentId && studentEmail) {
        setIsStudent(true);
        // Create a mock user object for student
        setUser({
          id: studentId,
          email: studentEmail,
          role: 'student'
        } as any);
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setIsAdmin(data.role === 'admin');
        setIsStudent(data.role === 'student');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAdmin(false);
      setIsStudent(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Check for local authentication on mount
  useEffect(() => {
    const adminId = localStorage.getItem('adminId');
    const adminEmail = localStorage.getItem('adminEmail');
    if (adminId && adminEmail) {
      setIsAdmin(true);
      setUser({
        id: adminId,
        email: adminEmail,
        role: 'admin'
      } as any);
      setLoading(false);
      return;
    }
    
    const studentId = localStorage.getItem('studentId');
    const studentEmail = localStorage.getItem('studentEmail');
    if (studentId && studentEmail) {
      setIsStudent(true);
      setUser({
        id: studentId,
        email: studentEmail,
        role: 'student'
      } as any);
      setLoading(false);
      return;
    }
  }, []);

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isStudent,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}