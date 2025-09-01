import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

export interface AuthenticatedRequest extends Request {
  user?: {
    claims: {
      sub: string;
      email?: string;
    };
  };
}

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await storage.getUser(req.user.claims.sub);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};