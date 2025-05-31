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
  role: 'guest' | 'buyer' | 'mastermind' | 'admin';
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
      if (firebaseUser) {
        setUser(firebaseUser);
        // Get user profile from Firestore
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    // No need for redirect result checking since we're using popup authentication
    return () => unsubscribe();
  }, []);

  // Get user profile from PostgreSQL database via API
  const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      if (!user) return null;
      
      const token = await user.getIdToken();
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
          role: userData.role, // This comes from PostgreSQL now
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
  const createUserProfile = async (user: User, role: UserProfile['role'] = 'guest') => {
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || '',
        role,
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
  const signUp = async (email: string, password: string, role: UserProfile['role'] = 'guest') => {
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
      let profile = await getUserProfile(user.uid);
      
      if (!profile) {
        // Create new profile with default role 'buyer'
        profile = await createUserProfile(user, 'buyer');
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
    } catch (error: any) {
      setError(error.message);
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
  const isMastermind = userProfile?.role === 'mastermind';
  const isBuyer = userProfile?.role === 'buyer';

  return {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isMastermind,
    isBuyer,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    logout,
    updateUserRole
  };
}