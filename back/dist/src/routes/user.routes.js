"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification ADMIN
router.get('/', auth_middleware_1.authenticateToken, rbac_middleware_1.canPerformAdminActions, user_controller_1.default.getAllUsers.bind(user_controller_1.default));
router.get('/:id', auth_middleware_1.authenticateToken, rbac_middleware_1.canPerformAdminActions, user_controller_1.default.getUserById.bind(user_controller_1.default));
router.put('/:id/vip', auth_middleware_1.authenticateToken, rbac_middleware_1.canPerformAdminActions, user_controller_1.default.updateVipStatus.bind(user_controller_1.default));
router.put('/:id/role', auth_middleware_1.authenticateToken, rbac_middleware_1.canPerformAdminActions, user_controller_1.default.updateUserRole.bind(user_controller_1.default));
router.put('/:id/status', auth_middleware_1.authenticateToken, rbac_middleware_1.canPerformAdminActions, user_controller_1.default.updateUserStatus.bind(user_controller_1.default));
exports.default = router;
//# sourceMappingURL=user.routes.js.map