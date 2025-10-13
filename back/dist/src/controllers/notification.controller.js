"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = __importDefault(require("../services/notification.service"));
class NotificationController {
    // Récupérer les notifications de l'utilisateur
    async getUserNotifications(req, res) {
        try {
            const userId = req.user.userId;
            const { page, limit } = req.query;
            const result = await notification_service_1.default.getUserNotifications(userId, page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined);
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Marquer une notification comme lue
    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const notification = await notification_service_1.default.markAsRead(id, userId);
            res.json(notification);
        }
        catch (error) {
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
    async markAllAsRead(req, res) {
        try {
            const userId = req.user.userId;
            const result = await notification_service_1.default.markAllAsRead(userId);
            res.json(result);
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Supprimer une notification
    async deleteNotification(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const result = await notification_service_1.default.deleteNotification(id, userId);
            res.json(result);
        }
        catch (error) {
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
    async getUnreadCount(req, res) {
        try {
            const userId = req.user.userId;
            const result = await notification_service_1.default.getUnreadCount(userId);
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching unread count:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
exports.NotificationController = NotificationController;
exports.default = new NotificationController();
//# sourceMappingURL=notification.controller.js.map