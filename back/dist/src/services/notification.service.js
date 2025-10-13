"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class NotificationService {
    // Récupérer les notifications d'un utilisateur
    async getUserNotifications(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [notifications, total, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.notification.count({ where: { userId } }),
            prisma.notification.count({ where: { userId, isRead: false } }),
        ]);
        return {
            notifications,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            unreadCount,
        };
    }
    // Marquer une notification comme lue
    async markAsRead(id, userId) {
        const notification = await prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        if (notification.userId !== userId) {
            throw new Error('Unauthorized');
        }
        return prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
    // Marquer toutes les notifications comme lues
    async markAllAsRead(userId) {
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        return { message: 'All notifications marked as read' };
    }
    // Supprimer une notification
    async deleteNotification(id, userId) {
        const notification = await prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        if (notification.userId !== userId) {
            throw new Error('Unauthorized');
        }
        await prisma.notification.delete({
            where: { id },
        });
        return { message: 'Notification deleted successfully' };
    }
    // Créer une notification
    async createNotification(data) {
        return prisma.notification.create({
            data,
        });
    }
    // Récupérer le nombre de notifications non lues
    async getUnreadCount(userId) {
        const count = await prisma.notification.count({
            where: { userId, isRead: false },
        });
        return { unreadCount: count };
    }
}
exports.NotificationService = NotificationService;
exports.default = new NotificationService();
//# sourceMappingURL=notification.service.js.map