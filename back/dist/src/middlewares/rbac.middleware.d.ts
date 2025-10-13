import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
/**
 * Middleware to check if user has required role(s)
 * @param allowedRoles - Array of allowed roles
 */
export declare const requireRole: (allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
/**
 * Middleware for Admin only
 */
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
/**
 * Middleware for Moderator and Admin
 */
export declare const requireModerator: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
/**
 * Middleware for Seller, Moderator and Admin
 */
export declare const requireSeller: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
/**
 * Check if user can perform admin-only actions (delete, manage users, etc.)
 */
export declare const canPerformAdminActions: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=rbac.middleware.d.ts.map