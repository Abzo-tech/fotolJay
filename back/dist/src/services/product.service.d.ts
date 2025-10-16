import { ProductStatus } from '@prisma/client';
export declare class ProductService {
    createProduct(data: {
        title: string;
        description: string;
        category?: string;
        price?: number;
        sellerId: string;
        photos: {
            url: string;
            publicId: string;
        }[];
    }): Promise<{
        seller: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            isVip: boolean;
        };
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            publicId: string | null;
            productId: string;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        isVip: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        views: number;
        sellerId: string;
        expiresAt: Date | null;
        vipUntil: Date | null;
        publishedAt: Date | null;
    }>;
    getProducts(filters?: {
        status?: ProductStatus;
        sellerId?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        products: ({
            seller: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phone: string;
                isVip: boolean;
            };
            photos: {
                id: string;
                createdAt: Date;
                url: string;
                publicId: string | null;
                productId: string;
                isPrimary: boolean;
            }[];
        } & {
            id: string;
            isVip: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            views: number;
            sellerId: string;
            expiresAt: Date | null;
            vipUntil: Date | null;
            publishedAt: Date | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getProductById(id: string): Promise<{
        seller: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            isVip: boolean;
        };
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            publicId: string | null;
            productId: string;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        isVip: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        views: number;
        sellerId: string;
        expiresAt: Date | null;
        vipUntil: Date | null;
        publishedAt: Date | null;
    }>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
    approveProduct(id: string): Promise<{
        seller: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            publicId: string | null;
            productId: string;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        isVip: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        views: number;
        sellerId: string;
        expiresAt: Date | null;
        vipUntil: Date | null;
        publishedAt: Date | null;
    }>;
    rejectProduct(id: string, reason?: string): Promise<{
        seller: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            publicId: string | null;
            productId: string;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        isVip: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        views: number;
        sellerId: string;
        expiresAt: Date | null;
        vipUntil: Date | null;
        publishedAt: Date | null;
    }>;
    getPendingProducts(page?: number, limit?: number): Promise<{
        products: ({
            seller: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phone: string;
                isVip: boolean;
            };
            photos: {
                id: string;
                createdAt: Date;
                url: string;
                publicId: string | null;
                productId: string;
                isPrimary: boolean;
            }[];
        } & {
            id: string;
            isVip: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            views: number;
            sellerId: string;
            expiresAt: Date | null;
            vipUntil: Date | null;
            publishedAt: Date | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    expireOldProducts(): Promise<{
        expired: number;
    }>;
    notifyExpiringProducts(): Promise<{
        notified: number;
    }>;
    upgradeVip(productId: string, userId: string): Promise<{
        seller: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            publicId: string | null;
            productId: string;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        isVip: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        views: number;
        sellerId: string;
        expiresAt: Date | null;
        vipUntil: Date | null;
        publishedAt: Date | null;
    }>;
    extendDuration(productId: string, userId: string, extraDays: number): Promise<{
        seller: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
        photos: {
            id: string;
            createdAt: Date;
            url: string;
            publicId: string | null;
            productId: string;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        isVip: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        views: number;
        sellerId: string;
        expiresAt: Date | null;
        vipUntil: Date | null;
        publishedAt: Date | null;
    }>;
}
declare const _default: ProductService;
export default _default;
//# sourceMappingURL=product.service.d.ts.map