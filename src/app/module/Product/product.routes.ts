import express from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../User/user.constant';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';
import { uploadMultipleImages } from '../../config/multer.config';
import { validateRequest } from '../../middleware/validateRequest';
import { validateFileRequest } from '../../middleware/validateUploadedFile';
import { UploadedFilesArrayZodSchema } from '../../utils/uploadedFileValidationSchema';
import { parseBodyForFormData } from '../../middleware/ParseBodyForFormData';

const router = express.Router();

router.get('/', ProductController.getAllProducts);

router.get('/single/:id', ProductController.getSingleProduct);

router.get('/new-arrivals', ProductController.getNewArrivals);

router.post(
  '/create-product',
  auth(UserRole.ADMIN),
  uploadMultipleImages([{ name: 'Product-Images', maxCount: 10 }]),
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(ProductValidation.productSchemaValidation),
  ProductController.createProduct,
);

router.patch(
  '/update/:id',
  auth(UserRole.ADMIN),
  uploadMultipleImages([{ name: 'Product-Images', maxCount: 10 }]),
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(ProductValidation.updateProductSchemaValidation),
  ProductController.updateProductIntoDB,
);

router.delete(
  '/delete/:id',
  auth(UserRole.ADMIN),
  ProductController.deleteProduct,
);

export const ProductRoutes = router;
