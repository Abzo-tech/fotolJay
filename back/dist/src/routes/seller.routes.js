"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seller_controller_1 = require("../controllers/seller.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const sellerController = new seller_controller_1.SellerController();
router.post('/register', (req, res) => sellerController.register(req, res));
router.post('/login', (req, res) => sellerController.login(req, res));
router.get('/profile', auth_middleware_1.authMiddleware, (req, res) => sellerController.getProfile(req, res));
router.get('/my-products', auth_middleware_1.authMiddleware, (req, res) => sellerController.getMyProducts(req, res));
exports.default = router;
//# sourceMappingURL=seller.routes.js.map