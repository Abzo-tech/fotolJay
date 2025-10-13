import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole, canPerformAdminActions } from '../middlewares/rbac.middleware';

const router = Router();

// Toutes les routes nécessitent une authentification ADMIN
router.get(
  '/',
  authenticateToken,
  canPerformAdminActions,
  userController.getAllUsers.bind(userController)
);

router.get(
  '/:id',
  authenticateToken,
  canPerformAdminActions,
  userController.getUserById.bind(userController)
);

router.put(
  '/:id/vip',
  authenticateToken,
  canPerformAdminActions,
  userController.updateVipStatus.bind(userController)
);

router.put(
  '/:id/role',
  authenticateToken,
  canPerformAdminActions,
  userController.updateUserRole.bind(userController)
);

router.put(
  '/:id/status',
  authenticateToken,
  canPerformAdminActions,
  userController.updateUserStatus.bind(userController)
);

export default router;
