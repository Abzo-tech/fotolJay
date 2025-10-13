interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}
export declare class JwtUtil {
    private static secret;
    /**
     * Generate a JWT token
     * @param payload - User data to encode
     * @returns JWT token
     */
    static generate(payload: JwtPayload): string;
    /**
     * Verify and decode a JWT token
     * @param token - JWT token
     * @returns Decoded payload
     */
    static verify(token: string): JwtPayload;
    /**
     * Extract token from Authorization header
     * @param authHeader - Authorization header value
     * @returns Token string or null
     */
    static extractToken(authHeader: string | undefined): string | null;
}
export {};
//# sourceMappingURL=jwt.util.d.ts.map