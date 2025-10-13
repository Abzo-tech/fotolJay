import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

/**
 * Middleware to check if user has required role(s)
 * @param allowedRoles - Array of allowed roles
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (allowedRoles.indexOf(req.user.role as UserRole) === -1) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

/**
 * Middleware for Admin only
 */
export const requireAdmin = requireRole([UserRole.ADMIN]);

/**
 * Middleware for Moderator and Admin
 */
export const requireModerator = requireRole([UserRole.MODERATOR, UserRole.ADMIN]);

/**
 * Middleware for Seller, Moderator and Admin
 */
export const requireSeller = requireRole([UserRole.SELLER, UserRole.MODERATOR, UserRole.ADMIN]);

/**
 * Check if user can perform admin-only actions (delete, manage users, etc.)
 */
export const canPerformAdminActions = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ 
      error: 'Only administrators can perform this action' 
    });
  }

  next();
};