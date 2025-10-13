"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = __importDefault(require("../controllers/notification.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.get('/', auth_middleware_1.authenticateToken, notification_controller_1.default.getUserNotifications.bind(notification_controller_1.default));
router.get('/unread-count', auth_middleware_1.authenticateToken, notification_controller_1.default.getUnreadCount.bind(notification_controller_1.default));
router.put('/:id/read', auth_middleware_1.authenticateToken, notification_controller_1.default.markAsRead.bind(notification_controller_1.default));
router.put('/read-all', auth_middleware_1.authenticateToken, notification_controller_1.default.markAllAsRead.bind(notification_controller_1.default));
router.delete('/:id', auth_middleware_1.authenticateToken, notification_controller_1.default.deleteNotification.bind(notification_controller_1.default));
exports.default = router;
//# sourceMappingURL=notification.routes.js.map