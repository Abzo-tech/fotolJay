import { Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      const user = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
        phone,
      });

      res.status(201).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async registerAdmin(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      const user = await AuthService.registerAdmin({
        email,
        password,
        firstName,
        lastName,
      });

      res.status(201).json({
        message: 'Admin created successfully',
        user,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      console.log(' Requête de connexion reçue:', { email, hasPassword: !!password });

      const result = await AuthService.login(email, password);

      console.log('✅ Connexion réussie pour:', email);
      console.log('📋 Résultat:', {
        hasToken: !!result.token,
        requiresPasswordChange: result.requiresPasswordChange,
        userRole: result.user.role
      });

      res.json(result);
    } catch (error: any) {
      console.log('Erreur de connexion pour:', email, '- Erreur:', error.message);
      res.status(401).json({ error: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    res.json({ message: 'Logged out successfully' });
  }

  static async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await AuthService.getCurrentUser(req.user.id);

      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { currentPassword, newPassword } = req.body;

      const result = await AuthService.changePassword(
        req.user.id,
        currentPassword || '',
        newPassword
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async initialChangePassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email and new password are required' });
      }

      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.forcePasswordChange) {
        return res.status(400).json({ error: 'Password change not required' });
      }

      const result = await AuthService.changePassword(
        user.id,
        '',
        newPassword
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async completeFirstLogin(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { firstName, lastName, newPassword } = req.body;

      const user = await AuthService.completeFirstLogin(req.user.id, {
        firstName,
        lastName,
        newPassword,
      });

      res.json({
        message: 'First login setup completed successfully',
        user,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const authValidation = {
  register: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().isLength({ min: 1 }),
    body('lastName').trim().isLength({ min: 1 }),
  ],

  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').exists(),
  ],

  changePassword: [
    body('currentPassword').optional(),
    body('newPassword').isLength({ min: 6 }),
  ],

  initialChangePassword: [
    body('email').isEmail().normalizeEmail(),
    body('newPassword').isLength({ min: 6 }),
  ],

  completeFirstLogin: [
    body('firstName').trim().isLength({ min: 1 }).withMessage('Le prénom est requis'),
    body('lastName').trim().isLength({ min: 1 }).withMessage('Le nom est requis'),
    body('newPassword').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  ],
};