import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = JwtUtil.extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = JwtUtil.verify(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true }
    });

    console.log('Auth middleware - User lookup result:', {
      userId: decoded.userId,
      userFound: !!user,
      userActive: user?.isActive,
      userRole: user?.role
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    console.log('Auth middleware - req.user set:', req.user);

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Alias pour compatibilité
export const authenticate = authenticateToken;
export const authMiddleware = authenticateToken;