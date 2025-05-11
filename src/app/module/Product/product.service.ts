/* eslint-disable @typescript-eslint/no-explicit-any */

import { Product } from './product.model';
import httpStatus from 'http-status';
import { Category } from '../Category/category.model';
import { Subcategory } from '../Subcategory/subcategory.model';
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
  if (payload.subcategory) {
    const checkSubCategoryExists = await Subcategory.findById(
      payload.subcategory,
    );
    if (!checkSubCategoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'Subcategory does not exist');
    }
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Subcategory is required');
  }

  // Create product
  const result = await Product.create(payload);
  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const searchableFields = ['productName', 'description'];

  // Step 1: Handle category/subcategory
  const [category, subcategory] = await Promise.all([
    query?.category
      ? Category.findOne({
          categoryName: { $regex: query.category as string, $options: 'i' },
        }).select('_id')
      : null,
    query?.subcategory
      ? Subcategory.findOne({
          subcategoryName: {
            $regex: query.subcategory as string,
            $options: 'i',
          },
        }).select('_id')
      : null,
  ]);

  // Step 2: Build the base query with filters
  const baseQuery = {
    ...(category && { category: category._id }),
    ...(subcategory && { subcategory: subcategory._id }),
  };

  // Step 3: Build the search query
  let searchQuery = {};
  if (query?.searchTerm) {
    const searchTerm = query.searchTerm as string;
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
    searchQuery = {
      ...searchQuery,
      price: { $gte: minPrice, $lte: maxPrice },
    };
  }

  // Step 5: Combine queries
  const finalQuery = {
    ...baseQuery,
    ...(Object.keys(searchQuery).length > 0 && searchQuery),
  };

  // Step 6: Use QueryBuilder with population
  const productQuery = new QueryBuilder(
    Product.find(finalQuery).populate({
      path: 'subcategory',
      populate: {
        path: 'category',
        model: 'Category',
      },
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
    path: 'subcategory',
    populate: {
      path: 'category',
      model: 'Category',
    },
  });

  return result;
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
  const isExist = await Product.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product does not exist');
  }

  // Process images if provided
  if (files && files['Product-Images'] && files['Product-Images'].length > 0) {
    payload.images = files['Product-Images'].map((file) => file.path);
  }

  // Validate subcategory exists if updating it
  if (
    payload.subcategory &&
    payload.subcategory !== isExist.subcategory.toString()
  ) {
    const checkSubCategoryExists = await Subcategory.findById(
      payload.subcategory,
    );
    if (!checkSubCategoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'Subcategory does not exist');
    }
  }

  // Filter out undefined, null, or empty string values
  // const filteredPayload = Object.entries(payload).reduce(
  //   (acc, [key, value]) => {
  //     if (value !== undefined && value !== null && value !== '' && key !== 'id') {
  //       acc[key] = value;
  //     }
  //     return acc;
  //   },
  //   {} as Record<string, any>
  // );

  // Update product
  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
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
      path: 'subcategory',
      populate: {
        path: 'category',
        model: 'Category',
      },
    })
    .sort({ createdAt: -1 })
    .limit(10);

  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getNewArrivals,
};
