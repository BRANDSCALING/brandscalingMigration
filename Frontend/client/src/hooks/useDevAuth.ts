import { useState, useEffect } from 'react';

export interface DevUserProfile {
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'student';
  accessTier: 'beginner' | 'intermediate' | 'advanced' | 'mastermind';
  createdAt: Date;
}

export function useDevAuth() {
  const [userProfile, setUserProfile] = useState<DevUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for development admin credentials in localStorage
    const devAdminId = localStorage.getItem('devAdminId');
    const devAdminEmail = localStorage.getItem('devAdminEmail');
    const devAdminRole = localStorage.getItem('devAdminRole');

    if (devAdminId && devAdminEmail && devAdminRole) {
      setUserProfile({
        uid: devAdminId,
        email: devAdminEmail,
        displayName: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        role: devAdminRole as 'admin' | 'student',
        accessTier: 'mastermind',
        createdAt: new Date()
      });
    }
    
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('devAdminId');
    localStorage.removeItem('devAdminEmail');
    localStorage.removeItem('devAdminRole');
    setUserProfile(null);
    setError(null);
    window.location.href = '/dev-login';
  };

  const isAuthenticated = !!userProfile;
  const isAdmin = userProfile?.role === 'admin';
  const isStudent = userProfile?.role === 'student';
  const isMastermind = userProfile?.accessTier === 'mastermind';

  return {
    user: userProfile ? { uid: userProfile.uid, email: userProfile.email } : null,
    userProfile,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isStudent,
    isMastermind,
    logout
  };
}