import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtUtil {
  private static secret = process.env.JWT_SECRET || 'fallback-secret';

  /**
   * Generate a JWT token
   * @param payload - User data to encode
   * @returns JWT token
   */
  static generate(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
  }

  /**
   * Verify and decode a JWT token
   * @param token - JWT token
   * @returns Decoded payload
   */
  static verify(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }

  /**
   * Extract token from Authorization header
   * @param authHeader - Authorization header value
   * @returns Token string or null
   */
  static extractToken(authHeader: string | undefined): string | null {
    if (!authHeader || authHeader.indexOf('Bearer ') !== 0) {
      return null;
    }
    return authHeader.substring(7);
  }
}