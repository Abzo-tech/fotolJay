export declare class PasswordUtil {
    /**
     * Hash a password with bcrypt
     * @param password - Plain text password
     * @returns Hashed password
     */
    static hash(password: string): Promise<string>;
    /**
     * Compare a plain text password with a hashed password
     * @param password - Plain text password
     * @param hashedPassword - Hashed password
     * @returns True if passwords match
     */
    static compare(password: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=password.util.d.ts.map