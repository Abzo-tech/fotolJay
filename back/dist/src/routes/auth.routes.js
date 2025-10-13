"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.authValidation.register, validation_middleware_1.handleValidationErrors, auth_controller_1.AuthController.register);
router.post('/register-admin', auth_controller_1.authValidation.register, validation_middleware_1.handleValidationErrors, auth_controller_1.AuthController.registerAdmin);
router.post('/login', auth_controller_1.authValidation.login, validation_middleware_1.handleValidationErrors, auth_controller_1.AuthController.login);
router.post('/logout', auth_middleware_1.authenticate, auth_controller_1.AuthController.logout);
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.AuthController.getCurrentUser);
router.put('/change-password', auth_middleware_1.authenticate, auth_controller_1.authValidation.changePassword, validation_middleware_1.handleValidationErrors, auth_controller_1.AuthController.changePassword);
router.put('/initial-change-password', auth_controller_1.authValidation.changePassword, validation_middleware_1.handleValidationErrors, auth_controller_1.AuthController.initialChangePassword);
router.post('/complete-first-login', auth_middleware_1.authenticate, auth_controller_1.authValidation.completeFirstLogin, validation_middleware_1.handleValidationErrors, auth_controller_1.AuthController.completeFirstLogin);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map