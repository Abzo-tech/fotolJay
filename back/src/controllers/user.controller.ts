import { Request, Response } from 'express';
import userService from '../services/user.service';
import { UserRole } from '@prisma/client';

export class UserController {
  // Récupérer l'utilisateur actuel (pour le frontend)
  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

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



  // Récupérer les transactions de crédits
  async getCreditsTransactions(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      // TODO: Implémenter la récupération des transactions depuis la base de données
      // Pour l'instant, retourner des données fictives
      const transactions = [
        {
          id: '1',
          type: 'purchase',
          amount: 10,
          description: 'Achat de 10 crédits',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'purchase',
          amount: 15,
          description: 'Achat de 15 crédits',
          createdAt: new Date(Date.now() - 86400000).toISOString() // 1 jour avant
        }
      ];

      res.json({
        transactions,
        pagination: {
          total: transactions.length,
          page,
          limit,
          totalPages: Math.ceil(transactions.length / limit)
        }
      });
    } catch (error: any) {
      console.error('Error fetching credits transactions:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Acheter des crédits (nouvelle route sans ID)
  async buyCredits(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { package: packageAmount } = req.body;
      let amount = 0;

      // Déterminer le montant basé sur le package
      switch (packageAmount) {
        case '10':
          amount = 10;
          break;
        case '15':
          amount = 15;
          break;
        case '25':
          amount = 25;
          break;
        default:
          return res.status(400).json({ error: 'Invalid package' });
      }

      const user = await userService.buyCredits(userId, amount);
      res.json({
        message: 'Credits purchased successfully',
        credits: user.credits
      });
    } catch (error: any) {
      console.error('Error buying credits:', error);
      if (error.message === 'User not found' || error.message === 'Amount must be positive') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Utiliser des crédits pour devenir VIP
  async useCreditsForVip(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await userService.useCreditsForVip(id);
      res.json(user);
    } catch (error: any) {
      console.error('Error using credits for VIP:', error);
      if (error.message === 'User not found' || error.message === 'Insufficient credits') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}

export default new UserController();
