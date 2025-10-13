"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
const client_1 = require("@prisma/client");
class UserController {
    // Récupérer tous les utilisateurs
    async getAllUsers(req, res) {
        try {
            const { page, limit } = req.query;
            const result = await user_service_1.default.getAllUsers(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined);
            res.json(result);
        }
        catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Récupérer un utilisateur par ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await user_service_1.default.getUserById(id);
            res.json(user);
        }
        catch (error) {
            console.error('Error fetching user:', error);
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Mettre à jour le statut VIP
    async updateVipStatus(req, res) {
        try {
            const { id } = req.params;
            const { isVip } = req.body;
            if (typeof isVip !== 'boolean') {
                return res.status(400).json({ error: 'isVip must be a boolean' });
            }
            const user = await user_service_1.default.updateVipStatus(id, isVip);
            res.json(user);
        }
        catch (error) {
            console.error('Error updating VIP status:', error);
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Mettre à jour le rôle
    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (!Object.values(client_1.UserRole).includes(role)) {
                return res.status(400).json({ error: 'Invalid role' });
            }
            const user = await user_service_1.default.updateUserRole(id, role);
            res.json(user);
        }
        catch (error) {
            console.error('Error updating user role:', error);
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Activer/Désactiver un utilisateur
    async updateUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            if (typeof isActive !== 'boolean') {
                return res.status(400).json({ error: 'isActive must be a boolean' });
            }
            const user = await user_service_1.default.updateUserStatus(id, isActive);
            res.json(user);
        }
        catch (error) {
            console.error('Error updating user status:', error);
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
exports.UserController = UserController;
exports.default = new UserController();
//# sourceMappingURL=user.controller.js.map