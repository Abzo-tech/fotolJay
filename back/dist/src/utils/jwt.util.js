"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtUtil {
    /**
     * Generate a JWT token
     * @param payload - User data to encode
     * @returns JWT token
     */
    static generate(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secret, { expiresIn: '7d' });
    }
    /**
     * Verify and decode a JWT token
     * @param token - JWT token
     * @returns Decoded payload
     */
    static verify(token) {
        return jsonwebtoken_1.default.verify(token, this.secret);
    }
    /**
     * Extract token from Authorization header
     * @param authHeader - Authorization header value
     * @returns Token string or null
     */
    static extractToken(authHeader) {
        if (!authHeader || authHeader.indexOf('Bearer ') !== 0) {
            return null;
        }
        return authHeader.substring(7);
    }
}
exports.JwtUtil = JwtUtil;
JwtUtil.secret = process.env.JWT_SECRET || 'fallback-secret';
//# sourceMappingURL=jwt.util.js.map