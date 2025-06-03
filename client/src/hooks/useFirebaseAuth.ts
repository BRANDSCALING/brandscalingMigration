import { useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'student';
  accessTier: 'beginner' | 'intermediate' | 'advanced' | 'mastermind';
  createdAt: Date;
}

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          // Get user profile from backend
          const profile = await getUserProfile(firebaseUser);
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Get user profile from PostgreSQL database via API
  const getUserProfile = async (firebaseUser: User): Promise<UserProfile | null> => {
    try {
      // Always get fresh token
      const token = await firebaseUser.getIdToken(true);
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        return {
          uid: userData.id,
          email: userData.email,
          displayName: userData.firstName || userData.email || '',
          role: userData.role,
          accessTier: userData.accessTier || 'beginner',
          createdAt: new Date(userData.createdAt || Date.now())
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  // Create user profile in Firestore and backend
  const createUserProfile = async (user: User, role: UserProfile['role'] = 'student') => {
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || '',
        role,
        accessTier: 'beginner',
        createdAt: new Date()
      };

      // Try to create profile in Firestore if available
      try {
        if (db) {
          await setDoc(doc(db, 'users', user.uid), userProfile);
        }
      } catch (firestoreError) {
        console.warn('Firestore not available, skipping user profile creation:', firestoreError);
      }
      
      // Also create profile in backend via API
      try {
        const token = await user.getIdToken();
        await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role
          })
        });
      } catch (apiError) {
        console.warn('Backend API not available:', apiError);
      }
      
      setUserProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, role: UserProfile['role'] = 'student') => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user, role);
      return result.user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user already has a profile
      let profile = await getUserProfile(user);
      
      if (!profile) {
        // Create new profile with default role 'student'
        profile = await createUserProfile(user, 'student');
      }
      
      return profile;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      // Clear all local state
      setUser(null);
      setUserProfile(null);
      setError(null);
      // Clear any cached data
      localStorage.clear();
      sessionStorage.clear();
    } catch (error: any) {
      setError(error.message);
      // Force clear state even if signOut fails
      setUser(null);
      setUserProfile(null);
      localStorage.clear();
      sessionStorage.clear();
      throw error;
    }
  };

  // Update user role
  const updateUserRole = async (uid: string, role: UserProfile['role']) => {
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, { role }, { merge: true });
      
      if (userProfile && userProfile.uid === uid) {
        setUserProfile({ ...userProfile, role });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = userProfile?.role === 'admin';
  const isStudent = userProfile?.role === 'student';
  const isMastermind = userProfile?.accessTier === 'mastermind';

  return {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isStudent,
    isMastermind,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    logout,
    updateUserRole
  };
}