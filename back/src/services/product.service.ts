import { PrismaClient, ProductStatus } from '@prisma/client';
import CloudinaryUtil from '../utils/cloudinary.util';
import EmailService from '../utils/email.util';
import CreditsService from './credits.service';

const prisma = new PrismaClient();

export class ProductService {
  // Créer un produit (vendeur authentifié)
  async createProduct(data: {
    title: string;
    description: string;
    category?: string;
    price?: number;
    sellerId: string;
    photos: { url: string; publicId: string }[];
  }) {
    const seller = await prisma.user.findUnique({
      where: { id: data.sellerId },
      select: { email: true, firstName: true, lastName: true, isVip: true }
    });

    if (!seller) {
      throw new Error('Seller not found');
    }

    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        sellerId: data.sellerId,
        isVip: seller.isVip,
        photos: {
          create: data.photos.map((photo, index) => ({
            url: photo.url,
            publicId: photo.publicId,
            isPrimary: index === 0,
          })),
        },
      },
      include: {
        photos: true,
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            isVip: true
          }
        }
      },
    });

    // Envoyer un email de confirmation au vendeur
    await EmailService.sendProductSubmittedEmail({
      sellerName: `${seller.firstName} ${seller.lastName}`,
      sellerEmail: seller.email,
      productTitle: data.title,
    });

    return product;
  }

  // Récupérer tous les produits (avec filtres)
  async getProducts(filters?: {
    status?: ProductStatus;
    sellerId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.sellerId) {
      where.sellerId = filters.sellerId;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isVip: 'desc' }, // VIP en premier
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          photos: true,
          seller: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              isVip: true
            }
          }
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Récupérer un produit par ID
  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        photos: true,
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            isVip: true
          }
        }
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Incrémenter le nombre de vues
    await prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return product;
  }

  // Supprimer un produit (admin/modérateur seulement)
  async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { photos: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Supprimer les images de Cloudinary
    if (product.photos.length > 0) {
      const publicIds = product.photos
        .filter((photo) => photo.publicId)
        .map((photo) => photo.publicId as string);
      
      if (publicIds.length > 0) {
        try {
          await CloudinaryUtil.deleteMultipleImages(publicIds);
        } catch (error) {
          console.error('Error deleting images from Cloudinary:', error);
        }
      }
    }

    await prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  // Modération: Approuver un produit
  async approveProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const publishedAt = new Date();
    const expiresAt = new Date(publishedAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 jours

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        status: ProductStatus.APPROVED,
        publishedAt,
        expiresAt, // Définit la date d'expiration
        isVip: false, // VIP par défaut false, peut être acheté séparément
      },
      include: {
        photos: true,
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      },
    });

    // Créer une notification (email au vendeur)
    await prisma.notification.create({
      data: {
        type: 'PRODUCT_APPROVED',
        message: `Votre produit "${product.title}" a été approuvé et est maintenant en ligne.`,
        recipientEmail: updatedProduct.seller.email,
        productId: updatedProduct.id,
      },
    });

    // Envoyer un email d'approbation au vendeur
    await EmailService.sendProductApprovedEmail({
      sellerName: `${updatedProduct.seller.firstName} ${updatedProduct.seller.lastName}`,
      sellerEmail: updatedProduct.seller.email,
      productTitle: updatedProduct.title,
    });

    return updatedProduct;
  }

  // Modération: Rejeter un produit
  async rejectProduct(id: string, reason?: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        status: ProductStatus.REJECTED,
      },
      include: {
        photos: true,
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      },
    });

    // Créer une notification (email au vendeur)
    const message = reason
      ? `Votre produit "${product.title}" a été rejeté. Raison: ${reason}`
      : `Votre produit "${product.title}" a été rejeté.`;

    await prisma.notification.create({
      data: {
        type: 'PRODUCT_REJECTED',
        message,
        recipientEmail: product.seller.email,
        productId: product.id,
      },
    });

    // Envoyer un email de rejet au vendeur
    await EmailService.sendProductRejectedEmail({
      sellerName: `${product.seller.firstName} ${product.seller.lastName}`,
      sellerEmail: product.seller.email,
      productTitle: product.title,
      reason,
    });

    return updatedProduct;
  }

  // Récupérer les produits en attente de modération
  async getPendingProducts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { status: ProductStatus.PENDING },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          photos: true,
          seller: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              isVip: true
            }
          }
        },
      }),
      prisma.product.count({ where: { status: ProductStatus.PENDING } }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Marquer les produits expirés (à exécuter par un cron job)
  async expireOldProducts() {
    const now = new Date();

    const expiredProducts = await prisma.product.findMany({
      where: {
        status: ProductStatus.APPROVED,
        expiresAt: {
          lte: now,
        },
      },
      include: {
        seller: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Mettre à jour le statut des produits expirés
    await prisma.product.updateMany({
      where: {
        status: ProductStatus.APPROVED,
        expiresAt: {
          lte: now,
        },
      },
      data: {
        status: ProductStatus.EXPIRED,
      },
    });

    // Désactiver VIP expiré
    await prisma.product.updateMany({
      where: {
        isVip: true,
        vipUntil: {
          lte: now,
        },
      },
      data: {
        isVip: false,
      },
    });

    // Créer des notifications pour chaque produit expiré
    for (const product of expiredProducts) {
      await prisma.notification.create({
        data: {
          type: 'PRODUCT_EXPIRED',
          message: `Votre produit "${product.title}" a expiré.`,
          recipientEmail: product.seller.email,
          productId: product.id,
        },
      });
    }

    return { expired: expiredProducts.length };
  }

  // Envoyer des notifications pour les produits qui vont expirer
  async notifyExpiringProducts() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const expiringProducts = await prisma.product.findMany({
      where: {
        status: ProductStatus.APPROVED,
        expiresAt: {
          lte: tomorrow,
          gt: new Date(), // Pas encore expiré
        },
      },
      include: {
        seller: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Créer des notifications pour les produits qui vont expirer
    for (const product of expiringProducts) {
      // Vérifier si une notification n'a pas déjà été envoyée
      const existingNotification = await prisma.notification.findFirst({
        where: {
          type: 'PRODUCT_EXPIRING',
          productId: product.id,
          recipientEmail: product.seller.email,
        },
      });

      if (!existingNotification) {
        await prisma.notification.create({
          data: {
            type: 'PRODUCT_EXPIRING',
            message: `Votre produit "${product.title}" expirera dans 1 jour.`,
            recipientEmail: product.seller.email,
            productId: product.id,
          },
        });
      }
    }

    return { notified: expiringProducts.length };
  }

  // Rendre un produit VIP (vendeur authentifié)
  async upgradeVip(productId: string, userId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.sellerId !== userId) {
      throw new Error('Unauthorized: You can only upgrade your own products');
    }

    if (product.status !== ProductStatus.APPROVED) {
      throw new Error('Product must be approved to upgrade to VIP');
    }

    if (product.isVip) {
      throw new Error('Product is already VIP');
    }

    const VIP_COST = 10; // Coût en crédits pour VIP 30 jours
    const vipUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

    // Vérifier et déduire les crédits
    await CreditsService.deductCredits(userId, VIP_COST, `VIP upgrade for product "${product.title}"`, productId);

    // Mettre à jour le produit
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        isVip: true,
        vipUntil,
      },
      include: {
        photos: true,
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      },
    });

    return updatedProduct;
  }

  // Étendre la durée d'un produit (vendeur authentifié)
  async extendDuration(productId: string, userId: string, extraDays: number) {
    if (extraDays <= 0 || extraDays > 365) {
      throw new Error('Extra days must be between 1 and 365');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.sellerId !== userId) {
      throw new Error('Unauthorized: You can only extend your own products');
    }

    if (product.status !== ProductStatus.APPROVED) {
      throw new Error('Product must be approved to extend duration');
    }

    const EXTENSION_COST_PER_DAY = 5; // Coût par jour en crédits
    const totalCost = extraDays * EXTENSION_COST_PER_DAY;
    const extensionMs = extraDays * 24 * 60 * 60 * 1000; // Conversion en ms

    // Vérifier et déduire les crédits
    await CreditsService.deductCredits(userId, totalCost, `Duration extension (${extraDays} days) for product "${product.title}"`, productId);

    // Étendre la durée
    const newExpiresAt = new Date((product.expiresAt || new Date()).getTime() + extensionMs);

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        expiresAt: newExpiresAt,
      },
      include: {
        photos: true,
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      },
    });

    return updatedProduct;
  }
}

export default new ProductService();
