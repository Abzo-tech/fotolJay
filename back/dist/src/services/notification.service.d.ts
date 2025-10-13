import { NotificationType } from '@prisma/client';
export declare class NotificationService {
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: {
            id: string;
            createdAt: Date;
            productId: string | null;
            type: import(".prisma/client").$Enums.NotificationType;
            message: string;
            isRead: boolean;
            recipientEmail: string;
            sent: boolean;
            sentAt: Date | null;
            userId: string | null;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        unreadCount: number;
    }>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string | null;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        recipientEmail: string;
        sent: boolean;
        sentAt: Date | null;
        userId: string | null;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    deleteNotification(id: string, userId: string): Promise<{
        message: string;
    }>;
    createNotification(data: {
        type: NotificationType;
        message: string;
        userId?: string;
        recipientEmail: string;
        productId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        productId: string | null;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        recipientEmail: string;
        sent: boolean;
        sentAt: Date | null;
        userId: string | null;
    }>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
}
declare const _default: NotificationService;
export default _default;
//# sourceMappingURL=notification.service.d.ts.map