import { CategoryController } from './category.controller';

import { CategoryValidation } from './category.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../User/user.constant';
import { Router } from 'express';
import { uploadSingleImage } from '../../config/multer.config';
import { validateRequest } from '../../middleware/validateRequest';
import { parseBodyForFormData } from '../../middleware/ParseBodyForFormData';
import { validateFileRequest } from '../../middleware/validateUploadedFile';
import { UploadedFilesArrayZodSchema } from '../../utils/uploadedFileValidationSchema';

const router = Router();

router.get(
  '/all-category',
  auth(...Object.values(UserRole)),
  CategoryController.getAllCategory,
);

router.post(
  '/create-category',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadSingleImage,
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
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
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadSingleImage,
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(CategoryValidation.UpdateCategoryValidationSchema),
  CategoryController.updateCategoryIntoDB,
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
