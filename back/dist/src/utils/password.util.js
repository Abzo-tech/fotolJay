"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtil = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PasswordUtil {
    /**
     * Hash a password with bcrypt
     * @param password - Plain text password
     * @returns Hashed password
     */
    static async hash(password) {
        const saltRounds = 12;
        return bcryptjs_1.default.hash(password, saltRounds);
    }
    /**
     * Compare a plain text password with a hashed password
     * @param password - Plain text password
     * @param hashedPassword - Hashed password
     * @returns True if passwords match
     */
    static async compare(password, hashedPassword) {
        return bcryptjs_1.default.compare(password, hashedPassword);
    }
}
exports.PasswordUtil = PasswordUtil;
//# sourceMappingURL=password.util.js.map