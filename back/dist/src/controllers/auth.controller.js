"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async register(req, res) {
        try {
            const { email, password, firstName, lastName, phone } = req.body;
            const user = await auth_service_1.AuthService.register({
                email,
                password,
                firstName,
                lastName,
                phone,
            });
            res.status(201).json({
                message: 'User registered successfully',
                user,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async registerAdmin(req, res) {
        try {
            const { email, password, firstName, lastName } = req.body;
            const user = await auth_service_1.AuthService.registerAdmin({
                email,
                password,
                firstName,
                lastName,
            });
            res.status(201).json({
                message: 'Admin created successfully',
                user,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async login(req, res) {
        const { email, password } = req.body;
        try {
            console.log(' Requête de connexion reçue:', { email, hasPassword: !!password });
            const result = await auth_service_1.AuthService.login(email, password);
            console.log('✅ Connexion réussie pour:', email);
            console.log('📋 Résultat:', {
                hasToken: !!result.token,
                requiresPasswordChange: result.requiresPasswordChange,
                userRole: result.user.role
            });
            res.json(result);
        }
        catch (error) {
            console.log('Erreur de connexion pour:', email, '- Erreur:', error.message);
            res.status(401).json({ error: error.message });
        }
    }
    static async logout(req, res) {
        res.json({ message: 'Logged out successfully' });
    }
    static async getCurrentUser(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const user = await auth_service_1.AuthService.getCurrentUser(req.user.id);
            res.json({ user });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async changePassword(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { currentPassword, newPassword } = req.body;
            const result = await auth_service_1.AuthService.changePassword(req.user.id, currentPassword || '', newPassword);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async initialChangePassword(req, res) {
        try {
            const { email, newPassword } = req.body;
            if (!email || !newPassword) {
                return res.status(400).json({ error: 'Email and new password are required' });
            }
            const { PrismaClient } = require('@prisma/client');
            const prisma = new PrismaClient();
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (!user.forcePasswordChange) {
                return res.status(400).json({ error: 'Password change not required' });
            }
            const result = await auth_service_1.AuthService.changePassword(user.id, '', newPassword);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async completeFirstLogin(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { firstName, lastName, newPassword } = req.body;
            const user = await auth_service_1.AuthService.completeFirstLogin(req.user.id, {
                firstName,
                lastName,
                newPassword,
            });
            res.json({
                message: 'First login setup completed successfully',
                user,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
exports.authValidation = {
    register: [
        (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
        (0, express_validator_1.body)('password').isLength({ min: 6 }),
        (0, express_validator_1.body)('firstName').trim().isLength({ min: 1 }),
        (0, express_validator_1.body)('lastName').trim().isLength({ min: 1 }),
    ],
    login: [
        (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
        (0, express_validator_1.body)('password').exists(),
    ],
    changePassword: [
        (0, express_validator_1.body)('currentPassword').optional(),
        (0, express_validator_1.body)('newPassword').isLength({ min: 6 }),
    ],
    initialChangePassword: [
        (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
        (0, express_validator_1.body)('newPassword').isLength({ min: 6 }),
    ],
    completeFirstLogin: [
        (0, express_validator_1.body)('firstName').trim().isLength({ min: 1 }).withMessage('Le prénom est requis'),
        (0, express_validator_1.body)('lastName').trim().isLength({ min: 1 }).withMessage('Le nom est requis'),
        (0, express_validator_1.body)('newPassword').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    ],
};
//# sourceMappingURL=auth.controller.js.map