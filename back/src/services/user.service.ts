import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  // Récupérer tous les utilisateurs (admin seulement)
  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isVip: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Mettre à jour le statut VIP d'un utilisateur
  async updateVipStatus(userId: string, isVip: boolean) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return prisma.user.update({
      where: { id: userId },
      data: { isVip },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVip: true,
        isActive: true,
      },
    });
  }

  // Mettre à jour le rôle d'un utilisateur
  async updateUserRole(userId: string, role: UserRole) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVip: true,
        isActive: true,
      },
    });
  }

  // Activer/Désactiver un utilisateur
  async updateUserStatus(userId: string, isActive: boolean) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVip: true,
        isActive: true,
      },
    });
  }

  // Récupérer un utilisateur par ID
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVip: true,
        credits: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Acheter des crédits (test endpoint - ajoute simplement les crédits)
  async buyCredits(userId: string, amount: number) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVip: true,
        credits: true,
        isActive: true,
      },
    });
  }

  // Utiliser des crédits pour VIP (exemple: 50 crédits pour VIP)
  async useCreditsForVip(userId: string) {
    const VIP_COST = 50;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.credits < VIP_COST) {
      throw new Error('Insufficient credits');
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: VIP_COST },
        isVip: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVip: true,
        credits: true,
        isActive: true,
      },
    });
  }
}

export default new UserService();
