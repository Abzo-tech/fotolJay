import { Router } from 'express';
import { SellerController } from '../controllers/seller.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const sellerController = new SellerController();

router.post('/register', (req, res) => sellerController.register(req, res));
router.post('/login', (req, res) => sellerController.login(req, res));
router.get('/profile', authMiddleware, (req, res) => sellerController.getProfile(req, res));
router.get('/my-products', authMiddleware, (req, res) => sellerController.getMyProducts(req, res));

export default router;
