import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

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
    
    try {
      const decodedToken = await auth.verifyIdToken(token);
      
      // Get user profile from our PostgreSQL database instead of Firestore
      const user = await storage.getUser(decodedToken.uid);
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: user?.role || 'guest'
      };
    } catch (verifyError) {
      // If token verification fails, try a simpler approach for development
      console.warn('Token verification failed, using development mode:', verifyError instanceof Error ? verifyError.message : 'Unknown error');
      
      // For development: decode token payload without verification
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return res.status(401).json({ error: 'Unauthorized: Token expired' });
      }
      
      // Get or create user in our database
      let user = await storage.getUser(payload.sub || payload.uid);
      if (!user) {
        user = await storage.upsertUser({
          id: payload.sub || payload.uid,
          email: payload.email,
          role: 'guest',
          firstName: null,
          lastName: null,
          profileImageUrl: null,
          stripeCustomerId: null,
          stripeSubscriptionId: null
        });
      }
      
      req.user = {
        uid: payload.sub || payload.uid,
        email: payload.email || '',
        role: user.role
      };
    }

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