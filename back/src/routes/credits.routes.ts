import { Router } from 'express';
import CreditsController from '../controllers/credits.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireSeller } from '../middlewares/rbac.middleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes pour les vendeurs (et admins)
router.get('/balance', requireSeller, CreditsController.getBalance);
router.post('/buy', requireSeller, CreditsController.buyCredits);
router.get('/transactions', requireSeller, CreditsController.getTransactions);

// Paiement opérateur (préparation)
router.post('/pay-operator', requireSeller, CreditsController.payWithOperator);

// Webhook PayTech (pas d'authentification nécessaire)
router.post('/paytech-webhook', CreditsController.paytechWebhook);

export default router;
