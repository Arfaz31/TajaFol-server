import { CategoryController } from './category.controller';

import { CategoryValidation } from './category.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../User/user.constant';
import { Router } from 'express';
import { uploadSingleImage } from '../../config/multer.config';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

router.get(
  '/all-category',
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CategoryController.getAllCategory,
);

router.post(
  '/create-category',
  auth(UserRole.ADMIN),
  uploadSingleImage,
  validateRequest(CategoryValidation.CategoryValidationSchema),
  CategoryController.createCategoryIntoDB,
);

router.get(
  '/:id',
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CategoryController.getCategoryById,
);

router.patch(
  '/:id',
  auth(UserRole.ADMIN),
  uploadSingleImage,
  validateRequest(CategoryValidation.UpdateCategoryValidationSchema),
  CategoryController.updateCategoryIntoDB,
);

router.delete('/:id', auth(UserRole.ADMIN), CategoryController.deleteCategory);

export const CategoryRoutes = router;
