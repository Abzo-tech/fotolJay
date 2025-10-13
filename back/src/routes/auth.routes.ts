import { Router } from 'express';
import { AuthController, authValidation } from '../controllers/auth.controller';
import { handleValidationErrors } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/register',
  authValidation.register,
  handleValidationErrors,
  AuthController.register
);

router.post(
  '/register-admin',
  authValidation.register,
  handleValidationErrors,
  AuthController.registerAdmin
);

router.post(
  '/login',
  authValidation.login,
  handleValidationErrors,
  AuthController.login
);

router.post('/logout', authenticate, AuthController.logout);

router.get('/me', authenticate, AuthController.getCurrentUser);

router.put(
  '/change-password',
  authenticate,
  authValidation.changePassword,
  handleValidationErrors,
  AuthController.changePassword
);

router.put(
  '/initial-change-password',
  authValidation.changePassword,
  handleValidationErrors,
  AuthController.initialChangePassword
);

router.post(
  '/complete-first-login',
  authenticate,
  authValidation.completeFirstLogin,
  handleValidationErrors,
  AuthController.completeFirstLogin
);

export default router;