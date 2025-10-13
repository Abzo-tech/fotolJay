import { UserRole } from '@prisma/client';
export declare class UserService {
    getAllUsers(page?: number, limit?: number): Promise<{
        users: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: import(".prisma/client").$Enums.UserRole;
            isVip: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateVipStatus(userId: string, isVip: boolean): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        isVip: boolean;
        isActive: boolean;
    }>;
    updateUserRole(userId: string, role: UserRole): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        isVip: boolean;
        isActive: boolean;
    }>;
    updateUserStatus(userId: string, isActive: boolean): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        isVip: boolean;
        isActive: boolean;
    }>;
    getUserById(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        isVip: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
declare const _default: UserService;
export default _default;
//# sourceMappingURL=user.service.d.ts.map