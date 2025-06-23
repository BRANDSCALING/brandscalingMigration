import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface DNAResult {
  id: string;
  defaultType: 'Architect' | 'Alchemist' | 'Blurred Identity' | 'Unfocused Potential';
  awarenessPercentage: number;
  createdAt: string;
}

interface UserDNAContextType {
  dnaResult: DNAResult | null;
  loading: boolean;
  canRetakeQuiz: boolean;
  nextRetakeDate: string | null;
  refreshDNAResult: () => Promise<void>;
}

const UserDNAContext = createContext<UserDNAContextType | undefined>(undefined);

export function UserDNAProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [dnaResult, setDnaResult] = useState<DNAResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [canRetakeQuiz, setCanRetakeQuiz] = useState(true);
  const [nextRetakeDate, setNextRetakeDate] = useState<string | null>(null);

  const fetchDNAResult = async () => {
    if (!user) {
      setDnaResult(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const result = data[0];
        setDnaResult({
          id: result.id,
          defaultType: result.default_type,
          awarenessPercentage: result.awareness_percentage,
          createdAt: result.created_at,
        });

        // Check if can retake (30 days rule)
        const lastTakeDate = new Date(result.created_at);
        const thirtyDaysLater = new Date(lastTakeDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const canRetake = new Date() >= thirtyDaysLater;
        
        setCanRetakeQuiz(canRetake);
        setNextRetakeDate(canRetake ? null : thirtyDaysLater.toISOString());
      } else {
        setDnaResult(null);
        setCanRetakeQuiz(true);
        setNextRetakeDate(null);
      }
    } catch (error) {
      console.error('Error fetching DNA result:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDNAResult();
  }, [user]);

  const refreshDNAResult = async () => {
    setLoading(true);
    await fetchDNAResult();
  };

  const value = {
    dnaResult,
    loading,
    canRetakeQuiz,
    nextRetakeDate,
    refreshDNAResult,
  };

  return (
    <UserDNAContext.Provider value={value}>
      {children}
    </UserDNAContext.Provider>
  );
}

export function useUserDNA() {
  const context = useContext(UserDNAContext);
  if (context === undefined) {
    throw new Error('useUserDNA must be used within a UserDNAProvider');
  }
  return context;
}