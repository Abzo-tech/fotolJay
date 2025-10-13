"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.authenticate = exports.authenticateToken = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = async (req, res, next) => {
    try {
        const token = jwt_util_1.JwtUtil.extractToken(req.headers.authorization);
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        const decoded = jwt_util_1.JwtUtil.verify(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true, isActive: true }
        });
        console.log('Auth middleware - User lookup result:', {
            userId: decoded.userId,
            userFound: !!user,
            userActive: user?.isActive,
            userRole: user?.role
        });
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        console.log('Auth middleware - req.user set:', req.user);
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
// Alias pour compatibilité
exports.authenticate = exports.authenticateToken;
exports.authMiddleware = exports.authenticateToken;
//# sourceMappingURL=auth.middleware.js.map