import admin from 'firebase-admin';
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // In production, you would use a service account key
  // For now, we'll initialize with default credentials
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

const auth = admin.auth();
const firestore = admin.firestore();

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role: string;
      };
    }
  }
}

// Middleware to verify Firebase token
export const verifyFirebaseToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    // Get user profile from Firestore to get role
    const userDoc = await firestore.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: userData?.role || 'guest'
    };

    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Middleware to check if user is authenticated
export const requireAuth: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Middleware to check user roles
export const requireRole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Helper function to create or update user profile in Firestore
export const createUserProfile = async (uid: string, email: string, displayName?: string, role: string = 'guest') => {
  try {
    const userRef = firestore.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      await userRef.set({
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      // Also create user in PostgreSQL database
      await storage.upsertUser({
        id: uid,
        email,
        firstName: displayName?.split(' ')[0] || null,
        lastName: displayName?.split(' ')[1] || null,
        role,
      });
    }
    
    return userRef;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Helper function to get user profile from Firestore
export const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await firestore.collection('users').doc(uid).get();
    return userDoc.exists ? userDoc.data() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Helper function to update user role
export const updateUserRole = async (uid: string, role: string) => {
  try {
    await firestore.collection('users').doc(uid).update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Also update in PostgreSQL database
    await storage.updateUserRole(uid, role);
    
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};

export { auth, firestore };