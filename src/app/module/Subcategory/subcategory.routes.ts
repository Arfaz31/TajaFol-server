import { Router } from 'express';

import auth from '../../middleware/auth';
import { UserRole } from '../User/user.constant';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryValidation } from './subcategory.validation';
import { uploadSingleImage } from '../../config/multer.config';
import { validateFileRequest } from '../../middleware/validateUploadedFile';
import { UploadedFilesArrayZodSchema } from '../../utils/uploadedFileValidationSchema';
import { parseBodyForFormData } from '../../middleware/ParseBodyForFormData';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

router.get('/', SubcategoryController.getAllSubcategory);

router.post(
  '/create-subcategory',
  auth(UserRole.ADMIN),
  uploadSingleImage,
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(SubcategoryValidation.SubCategoryValidationSchema),
  SubcategoryController.createSubCategoryIntoDB,
);

router.patch(
  '/update/:id',
  auth(UserRole.ADMIN),
  uploadSingleImage,
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(SubcategoryValidation.UpdateSubcategoryValidationSchema),
  SubcategoryController.updateSubcategoryIntoDB,
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN),
  SubcategoryController.deleteSubcategory,
);

export const SubcategoryRoutes = router;
