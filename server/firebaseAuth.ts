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

// Middleware to verify Firebase token (simplified for development)
export const verifyFirebaseToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // For development: decode token payload without full verification
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return res.status(401).json({ error: 'Unauthorized: Token expired' });
      }
      
      const userId = payload.sub || payload.uid || payload.user_id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
      }
      
      // Get or create user in our database
      let user = await storage.getUser(userId);
      if (!user) {
        user = await storage.upsertUser({
          id: userId,
          email: payload.email || null,
          role: 'student',
          firstName: payload.name?.split(' ')[0] || null,
          lastName: payload.name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: payload.picture || null,
          stripeCustomerId: null,
          stripeSubscriptionId: null
        });
      }
      
      req.user = {
        uid: userId,
        email: payload.email || '',
        role: user.role
      };
      
      next();
    } catch (decodeError) {
      console.error('Token decode failed:', decodeError);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
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