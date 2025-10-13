export declare class AuthService {
    /**
     * Register a new user
     */
    static register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: import(".prisma/client").$Enums.UserRole;
        isVip: boolean;
        createdAt: Date;
    }>;
    /**
     * Register the first Admin user
     */
    static registerAdmin(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    /**
     * Authenticate user and return token
     */
    static login(email: string, password: string): Promise<{
        requiresPasswordChange: boolean;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        token?: undefined;
    } | {
        token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        requiresPasswordChange?: undefined;
    }>;
    /**
     * Get current user info
     */
    static getCurrentUser(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    /**
     * Update user profile (first name, last name)
     */
    static updateProfile(userId: string, data: {
        firstName: string;
        lastName: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    /**
     * Complete first login setup (update profile and change password)
     */
    static completeFirstLogin(userId: string, data: {
        firstName: string;
        lastName: string;
        newPassword: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    /**
     * Change user password
     */
    static changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map