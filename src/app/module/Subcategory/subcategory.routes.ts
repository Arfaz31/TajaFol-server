import { Router } from 'express';

import { updloadSingleImage } from '../../config/cloudinary/multer.config';

import { validateRequestedFileData } from '../../middleware/validateRequestedFileData';
import auth from '../../middleware/auth';
import { UserRole } from '../User/user.constant';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryValidation } from './subcategory.validation';

const router = Router();

router.get('/all-subcategory', SubcategoryController.getAllSubcategory);

router.post(
  '/create-subcategory',
  auth(UserRole.ADMIN),
  updloadSingleImage('subcategory-Image'),
  validateRequestedFileData(SubcategoryValidation.SubCategoryValidationSchema),
  SubcategoryController.createSubCategoryIntoDB,
);

router.patch(
  '/update/:id',
  auth(UserRole.ADMIN),
  updloadSingleImage('subcategory-Image'),
  validateRequestedFileData(
    SubcategoryValidation.UpdateSubcategoryValidationSchema,
  ),
  SubcategoryController.updateSubcategoryIntoDB,
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN),
  SubcategoryController.deleteSubcategory,
);

export const SubcategoryRoutes = router;
