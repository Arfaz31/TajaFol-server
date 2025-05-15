/* eslint-disable @typescript-eslint/no-explicit-any */

import { Product } from './product.model';
import httpStatus from 'http-status';
import { Category } from '../Category/category.model';

import AppError from '../../Error/AppError';
import { IProduct } from './product.interface';
import QueryBuilder from '../../Builder/QueryBuilder';

const createProductIntoDB = async (
  payload: Record<string, any>,
  files: { [key: string]: Express.Multer.File[] },
): Promise<IProduct> => {
  // Check if product with same SKU already exists
  const isExistBySku = await Product.findOne({ sku: payload.sku });
  if (isExistBySku) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Product with this SKU already exists',
    );
  }

  // Process images from uploaded files
  if (files && files['Product-Images'] && files['Product-Images'].length > 0) {
    payload.images = files['Product-Images'].map((file) => file.path);
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'At least one product image is required',
    );
  }

  // Validate subcategory exists
  if (payload.category) {
    const checkCategoryExists = await Category.findById(payload.category);
    if (!checkCategoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'category does not exist');
    }
  }

  // Create product
  const result = await Product.create(payload);
  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const searchableFields = ['productName', 'description'];

  // Step 1: Handle category - only try to find a category if a valid ID is provided
  let categoryId = null;
  if (
    query?.category &&
    typeof query.category === 'string' &&
    query.category.trim() !== ''
  ) {
    const category = await Category.findOne({
      _id: query.category,
    }).select('_id');

    if (category) {
      categoryId = category._id;
    }
  }

  // Step 2: Build the base query with filters
  const baseQuery: Record<string, any> = {};

  // Only add category filter if we found a valid category
  if (categoryId) {
    baseQuery.category = categoryId;
  }

  // Step 3: Build the search query
  let searchQuery = {};
  if (
    query?.searchTerm &&
    typeof query.searchTerm === 'string' &&
    query.searchTerm.trim() !== ''
  ) {
    const searchTerm = query.searchTerm;
    searchQuery = {
      $or: [
        ...searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
        {
          features: {
            $elemMatch: {
              featureName: { $regex: searchTerm, $options: 'i' },
            },
          },
        },
      ],
    };
  }

  // Step 4: Handle price range filter
  if (query?.price && typeof query.price === 'string') {
    const [minPrice, maxPrice] = query.price.split('-').map(Number);
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      searchQuery = {
        ...searchQuery,
        price: { $gte: minPrice, $lte: maxPrice },
      };
    }
  }

  // Step 5: Combine queries
  const finalQuery = {
    ...baseQuery,
    ...(Object.keys(searchQuery).length > 0 && searchQuery),
  };

  // Step 6: Use QueryBuilder with population
  const productQuery = new QueryBuilder(
    Product.find(finalQuery).populate({
      path: 'category',
    }),
    query,
  );

  const result = await productQuery
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields().modelQuery;

  const meta = await productQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleProduct = async (id: string) => {
  const result = await Product.findById(id).populate({
    path: 'category',
  });

  return result;
};

const getCategoryRelatedProductsFromDB = async (excludeProductId: string) => {
  const product = await Product.findById(excludeProductId);

  if (!product) {
    throw new Error('product not found');
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: excludeProductId },
  }).populate('category');
  // Find all products with the same category ID, except for the product with this specific ID.

  return relatedProducts;
};

const updateProduct = async (
  id: string,
  payload: Record<string, any>,
  files: { [key: string]: Express.Multer.File[] },
): Promise<IProduct | null> => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product ID is required');
  }

  // Check if product exists
  const existingProduct = await Product.findById(id);
  if (!existingProduct) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product does not exist');
  }

  // Process images
  const newImages = files?.['Product-Images'] ?? [];

  if (newImages.length > 0) {
    // If new images are provided, merge them with existing images
    payload.images = [
      ...(existingProduct.images ?? []),
      ...newImages.map((file) => file.path),
    ];
  } else {
    // No new images: retain existing images
    payload.images = existingProduct.images ?? [];
  }

  // Validate category if it's being updated
  if (
    payload.category &&
    payload.category !== existingProduct.category.toString()
  ) {
    const categoryExists = await Category.findById(payload.category);
    if (!categoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'Category does not exist');
    }
  }

  // If no actual update payload, return current product
  const updateKeys = Object.keys(payload);
  if (updateKeys.length === 0) {
    return existingProduct;
  }

  // Perform update
  const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedProduct;
};

const deleteProduct = async (id: string) => {
  const _id = id;

  const isExist = await Product.findById(_id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product does not exist');
  }

  const result = await Product.findByIdAndUpdate(
    _id,
    { isDeleted: true, isActive: false },
    {
      new: true,
    },
  );
  return result;
};

const getNewArrivals = async () => {
  const result = await Product.find({
    isDeleted: false,
    isActive: true,
    isNewArrival: true,
  })

    .populate({
      path: 'checkCategoryExists',
    })
    .sort({ createdAt: -1 })
    .limit(10);

  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProducts,
  getSingleProduct,
  getCategoryRelatedProductsFromDB,
  updateProduct,
  deleteProduct,
  getNewArrivals,
};
