import { Router } from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../middleware/auth';
import { UserRole } from './user.constant';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

router.get('/customers', auth(UserRole.ADMIN), UserController.getAllCustomers);

router.post(
  '/register',
  validateRequest(UserValidation.customerSchemaValidation),
  UserController.register,
);

router.post(
  '/create-admin',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  // validateData(AdminValidation.adminSchemaValidation),
  UserController.createAdminIntoDB,
);

router.get(
  '/me',
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  UserController.getMeFromDB,
);

router.delete('/:id', auth(UserRole.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
