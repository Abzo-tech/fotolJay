"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
const client_1 = require("@prisma/client");
class UserController {
    // Récupérer l'utilisateur actuel (pour le frontend)
    async getCurrentUser(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const user = await user_service_1.default.getUserById(userId);
            res.json(user);
        }
        catch (error) {
            console.error('Error fetching current user:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
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
    // Récupérer les transactions de crédits
    async getCreditsTransactions(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            // TODO: Implémenter la récupération des transactions depuis la base de données
            // Pour l'instant, retourner des données fictives
            const transactions = [
                {
                    id: '1',
                    type: 'purchase',
                    amount: 10,
                    description: 'Achat de 10 crédits',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    type: 'purchase',
                    amount: 15,
                    description: 'Achat de 15 crédits',
                    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 jour avant
                }
            ];
            res.json({
                transactions,
                pagination: {
                    total: transactions.length,
                    page,
                    limit,
                    totalPages: Math.ceil(transactions.length / limit)
                }
            });
        }
        catch (error) {
            console.error('Error fetching credits transactions:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Acheter des crédits (nouvelle route sans ID)
    async buyCredits(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { package: packageAmount } = req.body;
            let amount = 0;
            // Déterminer le montant basé sur le package
            switch (packageAmount) {
                case '10':
                    amount = 10;
                    break;
                case '15':
                    amount = 15;
                    break;
                case '25':
                    amount = 25;
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid package' });
            }
            const user = await user_service_1.default.buyCredits(userId, amount);
            res.json({
                message: 'Credits purchased successfully',
                credits: user.credits
            });
        }
        catch (error) {
            console.error('Error buying credits:', error);
            if (error.message === 'User not found' || error.message === 'Amount must be positive') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    // Utiliser des crédits pour devenir VIP
    async useCreditsForVip(req, res) {
        try {
            const { id } = req.params;
            const user = await user_service_1.default.useCreditsForVip(id);
            res.json(user);
        }
        catch (error) {
            console.error('Error using credits for VIP:', error);
            if (error.message === 'User not found' || error.message === 'Insufficient credits') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
exports.UserController = UserController;
exports.default = new UserController();
//# sourceMappingURL=user.controller.js.map