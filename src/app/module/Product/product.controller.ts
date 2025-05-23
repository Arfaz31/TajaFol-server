import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ProductService } from './product.service';
import { sendResponse } from '../../utils/sendResponse';

const createProduct = catchAsync(async (req, res) => {
  const files = req.files as { [key: string]: Express.Multer.File[] };
  const result = await ProductService.createProductIntoDB(req.body, files);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta: result?.meta,
    data: result.result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductService.getSingleProduct(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const getCategoryRelatedProducts = catchAsync(async (req, res) => {
  const { id } = req.params;

  const relatedProducts =
    await ProductService.getCategoryRelatedProductsFromDB(id);
  // the id (which is the ID of the product itself).

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Related products retrieved successfully',
    data: relatedProducts,
  });
});

const updateProductIntoDB = catchAsync(async (req, res) => {
  const files = req.files as { [key: string]: Express.Multer.File[] };
  const result = await ProductService.updateProduct(
    req.params.id,
    req.body,
    files,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

// soft delete
const deleteProduct = catchAsync(async (req, res) => {
  const result = await ProductService.deleteProduct(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

const getNewArrivals = catchAsync(async (req, res) => {
  const result = await ProductService.getNewArrivals();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New arrival products retrieved successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getCategoryRelatedProducts,
  updateProductIntoDB,
  deleteProduct,
  getNewArrivals,
};
