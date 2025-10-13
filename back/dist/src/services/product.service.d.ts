import { ProductStatus } from '@prisma/client';
export declare class ProductService {
    createProduct(data: {
        title: string;
        description: string;
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
            isPrimary: boolean;
            productId: string;
        }[];
    } & {
        id: string;
        isVip: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        views: number;
        publishedAt: Date | null;
        sellerId: string;
    }>;
    getProducts(filters?: {
        status?: ProductStatus;
        sellerEmail?: string;
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
                isPrimary: boolean;
                productId: string;
            }[];
        } & {
            id: string;
            isVip: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            views: number;
            publishedAt: Date | null;
            sellerId: string;
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
            isPrimary: boolean;
            productId: string;
        }[];
    } & {
        id: string;
        isVip: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        views: number;
        publishedAt: Date | null;
        sellerId: string;
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
            isPrimary: boolean;
            productId: string;
        }[];
    } & {
        id: string;
        isVip: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        views: number;
        publishedAt: Date | null;
        sellerId: string;
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
            isPrimary: boolean;
            productId: string;
        }[];
    } & {
        id: string;
        isVip: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        views: number;
        publishedAt: Date | null;
        sellerId: string;
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
                isPrimary: boolean;
                productId: string;
            }[];
        } & {
            id: string;
            isVip: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            views: number;
            publishedAt: Date | null;
            sellerId: string;
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
}
declare const _default: ProductService;
export default _default;
//# sourceMappingURL=product.service.d.ts.map