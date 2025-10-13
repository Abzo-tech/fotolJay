import { Router } from 'express';
import productController from '../controllers/product.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole, requireModerator, canPerformAdminActions } from '../middlewares/rbac.middleware';
import { UserRole } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configuration de Multer pour l'upload de photos
const uploadDir = path.join(__dirname, '../../public/uploads');

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration Multer pour upload en mémoire (pour Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Routes publiques (pas d'authentification requise)
router.get('/', productController.getProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));

// Publier un produit (authentification requise)
router.post(
  '/',
  authenticateToken,
  upload.array('photos', 5), // Maximum 5 photos
  productController.createProduct.bind(productController)
);

// Récupérer les produits du vendeur actuellement connecté
router.get(
  '/seller',
  authenticateToken,
  productController.getCurrentSellerProducts.bind(productController)
);

// Routes de modération (MODERATOR ou ADMIN)
router.get(
  '/moderation/pending',
  authenticateToken,
  requireModerator,
  productController.getPendingProducts.bind(productController)
);

// Approuver un produit (MODERATOR ou ADMIN)
router.post(
  '/:id/approve',
  authenticateToken,
  requireModerator,
  productController.approveProduct.bind(productController)
);

// Rejeter un produit (MODERATOR ou ADMIN)
router.post(
  '/:id/reject',
  authenticateToken,
  requireModerator,
  productController.rejectProduct.bind(productController)
);

// Supprimer un produit (ADMIN uniquement)
router.delete(
  '/:id',
  authenticateToken,
  canPerformAdminActions,
  productController.deleteProduct.bind(productController)
);

export default router;
