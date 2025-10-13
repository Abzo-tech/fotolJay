import { Request, Response } from 'express';
export declare class NotificationController {
    getUserNotifications(req: Request, res: Response): Promise<void>;
    markAsRead(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    markAllAsRead(req: Request, res: Response): Promise<void>;
    deleteNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getUnreadCount(req: Request, res: Response): Promise<void>;
}
declare const _default: NotificationController;
export default _default;
//# sourceMappingURL=notification.controller.d.ts.map