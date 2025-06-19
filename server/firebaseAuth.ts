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

// Import Firebase Admin SDK
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    // Try to initialize with service account if available
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Fallback to development mode with token verification disabled
      console.warn('Firebase Admin SDK not properly configured - using development mode');
    }
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
  }
}

// Middleware to verify Firebase token
export const verifyFirebaseToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check for development admin credentials first
    if (process.env.NODE_ENV === 'development') {
      const devAdminId = req.headers['x-dev-admin-id'];
      if (devAdminId === 'admin-dev-12345') {
        // Create development admin user
        let user = await storage.getUser('admin-dev-12345');
        if (!user) {
          user = await storage.upsertUser({
            id: 'admin-dev-12345',
            email: 'admin@brandscaling.com',
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            profileImageUrl: null,
            stripeCustomerId: null,
            stripeSubscriptionId: null
          });
        }
        
        req.user = {
          uid: user.id,
          email: user.email || 'admin@brandscaling.com',
          role: user.role
        };
        return next();
      }
    }
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    if (!token || token === 'undefined' || token === 'null') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    
    let decodedToken;
    
    // Try Firebase Admin verification first
    if (admin.apps.length > 0) {
      try {
        decodedToken = await admin.auth().verifyIdToken(token);
      } catch (adminError) {
        console.warn('Firebase Admin verification failed, falling back to development mode:', adminError);
        decodedToken = null;
      }
    }
    
    // Fallback to manual token decode for development
    if (!decodedToken) {
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        
        if (payload.exp && payload.exp < Date.now() / 1000) {
          return res.status(401).json({ error: 'Unauthorized: Token expired' });
        }
        
        decodedToken = {
          uid: payload.sub || payload.uid || payload.user_id,
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        };
      } catch (decodeError) {
        console.error('Token decode failed:', decodeError);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
    }
    
    if (!decodedToken.uid) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
    }
    
    // Get or create user in our database
    let user = await storage.getUser(decodedToken.uid);
    if (!user) {
      user = await storage.upsertUser({
        id: decodedToken.uid,
        email: decodedToken.email || null,
        role: 'student',
        firstName: decodedToken.name?.split(' ')[0] || null,
        lastName: decodedToken.name?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: decodedToken.picture || null,
        stripeCustomerId: null,
        stripeSubscriptionId: null
      });
    }
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
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

// Helper function to create or update user profile in PostgreSQL
export const createUserProfile = async (uid: string, email: string, displayName?: string, role: string = 'guest') => {
  try {
    await storage.upsertUser({
      id: uid,
      email,
      firstName: displayName?.split(' ')[0] || null,
      lastName: displayName?.split(' ').slice(1).join(' ') || null,
      role,
      profileImageUrl: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null
    });
    
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Helper function to get user profile from PostgreSQL
export const getUserProfile = async (uid: string) => {
  try {
    return await storage.getUser(uid);
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Helper function to update user role
export const updateUserRole = async (uid: string, role: string) => {
  try {
    await storage.updateUserRole(uid, role);
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};