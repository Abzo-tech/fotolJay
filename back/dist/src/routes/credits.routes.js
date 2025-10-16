"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const credits_controller_1 = __importDefault(require("../controllers/credits.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(auth_middleware_1.authenticate);
// Routes pour les vendeurs (et admins)
router.get('/balance', rbac_middleware_1.requireSeller, credits_controller_1.default.getBalance);
router.post('/buy', rbac_middleware_1.requireSeller, credits_controller_1.default.buyCredits);
router.get('/transactions', rbac_middleware_1.requireSeller, credits_controller_1.default.getTransactions);
// Paiement opérateur (préparation)
router.post('/pay-operator', rbac_middleware_1.requireSeller, credits_controller_1.default.payWithOperator);
// Webhook PayTech (pas d'authentification nécessaire)
router.post('/paytech-webhook', credits_controller_1.default.paytechWebhook);
exports.default = router;
//# sourceMappingURL=credits.routes.js.map