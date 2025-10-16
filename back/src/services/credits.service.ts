import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

export class CreditsService {
  // Récupérer le solde de crédits d'un utilisateur
  async getBalance(userId: string): Promise<number> {
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
  async deductCredits(
    userId: string,
    amount: number,
    reason: string,
    productId?: string
  ): Promise<void> {
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
    const type = productId ? TransactionType.SPEND_VIP : TransactionType.SPEND_EXTENSION;
    await this.createTransaction(userId, type, -amount, reason, productId);
  }

  // Ajouter des crédits (achat via wallet/opérateur)
  async addCredits(
    userId: string,
    amount: number,
    source: string,
    description?: string
  ): Promise<void> {
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
    await this.createTransaction(
      userId,
      TransactionType.BUY_CREDITS,
      amount,
      description || `Achat de ${amount} crédits via ${source}`,
      undefined
    );
  }

  // Créer une transaction
  private async createTransaction(
    userId: string,
    type: TransactionType,
    amount: number,
    description?: string,
    productId?: string
  ): Promise<void> {
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
  async getTransactions(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<{
    transactions: any[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
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

export default new CreditsService();
