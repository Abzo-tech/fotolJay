import { Request, Response } from 'express';
import notificationService from '../services/notification.service';

export class NotificationController {
  // Récupérer les notifications de l'utilisateur
  async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { page, limit } = req.query;

      const result = await notificationService.getUserNotifications(
        userId,
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );

      res.json(result);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Marquer une notification comme lue
  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const notification = await notificationService.markAsRead(id, userId);
      res.json(notification);
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      if (error.message === 'Notification not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const result = await notificationService.markAllAsRead(userId);
      res.json(result);
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Supprimer une notification
  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const result = await notificationService.deleteNotification(id, userId);
      res.json(result);
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      if (error.message === 'Notification not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Récupérer le nombre de notifications non lues
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const result = await notificationService.getUnreadCount(userId);
      res.json(result);
    } catch (error: any) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}

export default new NotificationController();
