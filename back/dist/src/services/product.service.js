"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const client_1 = require("@prisma/client");
const cloudinary_util_1 = __importDefault(require("../utils/cloudinary.util"));
const email_util_1 = __importDefault(require("../utils/email.util"));
const prisma = new client_1.PrismaClient();
class ProductService {
    // Créer un produit (vendeur authentifié)
    async createProduct(data) {
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
        await email_util_1.default.sendProductSubmittedEmail({
            sellerName: `${seller.firstName} ${seller.lastName}`,
            sellerEmail: seller.email,
            productTitle: data.title,
        });
        return product;
    }
    // Récupérer tous les produits (avec filtres)
    async getProducts(filters) {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.sellerEmail) {
            where.sellerEmail = filters.sellerEmail;
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
    async getProductById(id) {
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
    async deleteProduct(id) {
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
                .map((photo) => photo.publicId);
            if (publicIds.length > 0) {
                try {
                    await cloudinary_util_1.default.deleteMultipleImages(publicIds);
                }
                catch (error) {
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
    async approveProduct(id) {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                status: client_1.ProductStatus.APPROVED,
                publishedAt: new Date(),
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
        await email_util_1.default.sendProductApprovedEmail({
            sellerName: `${updatedProduct.seller.firstName} ${updatedProduct.seller.lastName}`,
            sellerEmail: updatedProduct.seller.email,
            productTitle: updatedProduct.title,
        });
        return updatedProduct;
    }
    // Modération: Rejeter un produit
    async rejectProduct(id, reason) {
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
                status: client_1.ProductStatus.REJECTED,
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
        await email_util_1.default.sendProductRejectedEmail({
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
                where: { status: client_1.ProductStatus.PENDING },
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
            prisma.product.count({ where: { status: client_1.ProductStatus.PENDING } }),
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
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const expiredProducts = await prisma.product.findMany({
            where: {
                status: client_1.ProductStatus.APPROVED,
                publishedAt: {
                    lte: oneWeekAgo,
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
                status: client_1.ProductStatus.APPROVED,
                publishedAt: {
                    lte: oneWeekAgo,
                },
            },
            data: {
                status: client_1.ProductStatus.EXPIRED,
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
        const sixDaysAgo = new Date();
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const expiringProducts = await prisma.product.findMany({
            where: {
                status: client_1.ProductStatus.APPROVED,
                publishedAt: {
                    gte: sixDaysAgo,
                    lte: fiveDaysAgo,
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
}
exports.ProductService = ProductService;
exports.default = new ProductService();
//# sourceMappingURL=product.service.js.map