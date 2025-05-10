import { Router } from 'express';
import { AuthController } from './auth.controller';
import auth from '../../middleware/auth';

import {
  validateRequest,
  validateRequestCookies,
} from '../../middleware/validateRequest';
import { AuthValidation } from './auth.validation';
import { UserRole } from '../User/user.constant';

const router = Router();

// router.post('/signup', AuthController.signUpUser);

router.post('/login', AuthController.loginUser);

router.post(
  '/change-password',
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);

router.post(
  '/generate-access-token-via-refresh-token',
  validateRequestCookies(AuthValidation.refreshTokenValidationSchema),
  AuthController.generateAccessTokeViaRefreshToken,
);

// router.post(
//   '/forget-password',
//   validateRequest(AuthValidation.forgetPasswordValidationSchema),
//   AuthController.forgetPassword,
// );

// router.post(
//   '/reset-password',
//   validateRequest(AuthValidation.resetPasswordValidationSchema),
//   AuthController.resetPassword,
// );

export const AuthRoutes = router;
