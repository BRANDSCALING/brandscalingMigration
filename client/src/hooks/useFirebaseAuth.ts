import { useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
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

    return () => unsubscribe();
  }, []);

  // Get user profile from Firestore
  const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
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

      // Create profile in Firestore
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      // Also create profile in backend via API
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
      
      // Check if user profile exists, if not create one
      const existingProfile = await getUserProfile(result.user.uid);
      if (!existingProfile) {
        await createUserProfile(result.user);
      }
      
      return result.user;
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
    logout,
    updateUserRole
  };
}