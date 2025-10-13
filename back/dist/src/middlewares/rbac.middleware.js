"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canPerformAdminActions = exports.requireSeller = exports.requireModerator = exports.requireAdmin = exports.requireRole = void 0;
const client_1 = require("@prisma/client");
/**
 * Middleware to check if user has required role(s)
 * @param allowedRoles - Array of allowed roles
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (allowedRoles.indexOf(req.user.role) === -1) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};
exports.requireRole = requireRole;
/**
 * Middleware for Admin only
 */
exports.requireAdmin = (0, exports.requireRole)([client_1.UserRole.ADMIN]);
/**
 * Middleware for Moderator and Admin
 */
exports.requireModerator = (0, exports.requireRole)([client_1.UserRole.MODERATOR, client_1.UserRole.ADMIN]);
/**
 * Middleware for Seller, Moderator and Admin
 */
exports.requireSeller = (0, exports.requireRole)([client_1.UserRole.SELLER, client_1.UserRole.MODERATOR, client_1.UserRole.ADMIN]);
/**
 * Check if user can perform admin-only actions (delete, manage users, etc.)
 */
const canPerformAdminActions = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.user.role !== client_1.UserRole.ADMIN) {
        return res.status(403).json({
            error: 'Only administrators can perform this action'
        });
    }
    next();
};
exports.canPerformAdminActions = canPerformAdminActions;
//# sourceMappingURL=rbac.middleware.js.map