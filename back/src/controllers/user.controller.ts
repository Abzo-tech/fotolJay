import { Request, Response } from 'express';
import userService from '../services/user.service';
import { UserRole } from '@prisma/client';

export class UserController {
  // Récupérer tous les utilisateurs
  async getAllUsers(req: Request, res: Response) {
    try {
      const { page, limit } = req.query;

      const result = await userService.getAllUsers(
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );

      res.json(result);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Récupérer un utilisateur par ID
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.json(user);
    } catch (error: any) {
      console.error('Error fetching user:', error);
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Mettre à jour le statut VIP
  async updateVipStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isVip } = req.body;

      if (typeof isVip !== 'boolean') {
        return res.status(400).json({ error: 'isVip must be a boolean' });
      }

      const user = await userService.updateVipStatus(id, isVip);
      res.json(user);
    } catch (error: any) {
      console.error('Error updating VIP status:', error);
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Mettre à jour le rôle
  async updateUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const user = await userService.updateUserRole(id, role);
      res.json(user);
    } catch (error: any) {
      console.error('Error updating user role:', error);
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Activer/Désactiver un utilisateur
  async updateUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ error: 'isActive must be a boolean' });
      }

      const user = await userService.updateUserStatus(id, isActive);
      res.json(user);
    } catch (error: any) {
      console.error('Error updating user status:', error);
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}

export default new UserController();
