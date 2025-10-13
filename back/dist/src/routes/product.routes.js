"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Configuration de Multer pour l'upload de photos
const uploadDir = path_1.default.join(__dirname, '../../public/uploads');
// Créer le dossier uploads s'il n'existe pas
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configuration Multer pour upload en mémoire (pour Cloudinary)
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }
    },
});
// Routes publiques (pas d'authentification requise)
router.get('/', product_controller_1.default.getProducts.bind(product_controller_1.default));
router.get('/:id', product_controller_1.default.getProductById.bind(product_controller_1.default));
// Publier un produit (authentification requise)
router.post('/', auth_middleware_1.authenticateToken, upload.array('photos', 5), // Maximum 5 photos
product_controller_1.default.createProduct.bind(product_controller_1.default));
// Récupérer les produits d'un vendeur par email
router.get('/seller/:email', product_controller_1.default.getSellerProducts.bind(product_controller_1.default));
// Routes de modération (MODERATOR ou ADMIN)
router.get('/moderation/pending', auth_middleware_1.authenticateToken, rbac_middleware_1.requireModerator, product_controller_1.default.getPendingProducts.bind(product_controller_1.default));
// Approuver un produit (MODERATOR ou ADMIN)
router.post('/:id/approve', auth_middleware_1.authenticateToken, rbac_middleware_1.requireModerator, product_controller_1.default.approveProduct.bind(product_controller_1.default));
// Rejeter un produit (MODERATOR ou ADMIN)
router.post('/:id/reject', auth_middleware_1.authenticateToken, rbac_middleware_1.requireModerator, product_controller_1.default.rejectProduct.bind(product_controller_1.default));
// Supprimer un produit (ADMIN uniquement)
router.delete('/:id', auth_middleware_1.authenticateToken, rbac_middleware_1.canPerformAdminActions, product_controller_1.default.deleteProduct.bind(product_controller_1.default));
exports.default = router;
//# sourceMappingURL=product.routes.js.map