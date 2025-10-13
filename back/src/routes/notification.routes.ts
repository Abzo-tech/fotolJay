import { Router } from 'express';
import notificationController from '../controllers/notification.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.get('/', authenticateToken, notificationController.getUserNotifications.bind(notificationController));

router.get('/unread-count', authenticateToken, notificationController.getUnreadCount.bind(notificationController));

router.put('/:id/read', authenticateToken, notificationController.markAsRead.bind(notificationController));

router.put('/read-all', authenticateToken, notificationController.markAllAsRead.bind(notificationController));

router.delete('/:id', authenticateToken, notificationController.deleteNotification.bind(notificationController));

export default router;
