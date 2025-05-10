import express from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../User/user.constant';
import {
  updloadSingleImage,
  uploadMultipleImages,
} from '../../config/cloudinary/multer.config';
import { validateRequestedFileData } from '../../middleware/validateRequestedFileData';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';

const router = express.Router();

router.get('/', ProductController.getAllProducts);

router.get('/single/:id', ProductController.getSingleProduct);

router.get('/new-arrivals', ProductController.getNewArrivals);

router.get('/category/:categoryId', ProductController.getProductsByCategory);

router.get('/brand/:brandId', ProductController.getProductsByBrand);

router.post(
  '/create-product',
  auth(UserRole.ADMIN),
  uploadMultipleImages([{ name: 'product-Image', maxCount: 10 }]),
  validateRequestedFileData(ProductValidation.productSchemaValidation),
  ProductController.createProduct,
);

router.patch(
  '/update/:id',
  auth(UserRole.ADMIN),
  updloadSingleImage('product-Image'),
  validateRequestedFileData(ProductValidation.updateProductSchemaValidation),
  ProductController.updateProductIntoDB,
);

router.delete(
  '/delete/:id',
  auth(UserRole.ADMIN),
  ProductController.deleteProduct,
);

export const ProductRoutes = router;
