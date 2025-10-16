"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CreditsService {
    // Récupérer le solde de crédits d'un utilisateur
    async getBalance(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user.credits;
    }
    // Déduire des crédits (pour achats VIP/extension)
    async deductCredits(userId, amount, reason, productId) {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true },
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.credits < amount) {
            throw new Error('Insufficient credits');
        }
        // Déduire les crédits
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: amount } },
        });
        // Créer la transaction
        const type = productId ? client_1.TransactionType.SPEND_VIP : client_1.TransactionType.SPEND_EXTENSION;
        await this.createTransaction(userId, type, -amount, reason, productId);
    }
    // Ajouter des crédits (achat via wallet/opérateur)
    async addCredits(userId, amount, source, description) {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Ajouter les crédits
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: amount } },
        });
        // Créer la transaction
        await this.createTransaction(userId, client_1.TransactionType.BUY_CREDITS, amount, description || `Achat de ${amount} crédits via ${source}`, undefined);
    }
    // Créer une transaction
    async createTransaction(userId, type, amount, description, productId) {
        await prisma.transaction.create({
            data: {
                userId,
                productId,
                type,
                amount,
                description,
            },
        });
    }
    // Récupérer l'historique des transactions
    async getTransactions(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
            }),
            prisma.transaction.count({ where: { userId } }),
        ]);
        return {
            transactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
exports.CreditsService = CreditsService;
exports.default = new CreditsService();
//# sourceMappingURL=credits.service.js.map