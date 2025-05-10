import { Request } from 'express'
import { Product } from './product.model'
import { AppError } from '../../Error/AppError'
import httpStatus from 'http-status'
import mongoose, { Types } from 'mongoose'
import { Category } from '../Category/category.model'
import { Subcategory } from '../Subcategory/subcategory.model'
import { Brand } from '../Brand/brand.model'
import QueryBuilder from '../../builder/QueryBuilder'

interface CustomFile extends Express.Multer.File {
  path: string
}

const createProductIntoDB = async (req: Request) => {
  const payload = req.body
  const files = req.files as { [fieldname: string]: CustomFile[] }

  if (files) {
    payload.images = files['product-Image']?.map((file: any) => file.path)
  }

  if (payload.category) {
    const checkCategoryExists = await Category.findOne({
      _id: payload.category,
    })
    if (!checkCategoryExists) {
      throw new Error('Category does not exists')
    }
  }

  if (payload.subcategory) {
    const checkSubCategoryExists = await Subcategory.findOne({
      _id: payload.subcategory,
    })
    if (!checkSubCategoryExists) {
      throw new Error('Subcategory does not exists')
    }
  }

  if (payload.brand) {
    const checkBrandExists = await Brand.findOne({ _id: payload.brand })
    if (!checkBrandExists) {
      throw new Error('Brand does not exists')
    }
  }

  const isExist = await Product.findOne({
    productName: payload.productName,
  })
  if (isExist) {
    throw new Error('Product already exists')
  }

  const result = await Product.create(payload)
  return result
}

const getAllProducts = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['productName', 'description']

  // Resolve searchId based on category, subcategory, or brand
  let searchId
  if (query?.category) {
    const category = await Category.findOne({
      categoryName: { $regex: query?.category, $options: 'i' },
    }).select('_id')
    searchId = category?._id
  } else if (query?.subcategory) {
    const subcategory = await Subcategory.findOne({
      subcategoryName: { $regex: query?.subcategory, $options: 'i' },
    }).select('_id')
    searchId = subcategory?._id
  } else if (query?.brand) {
    const brand = await Brand.findOne({
      brandName: { $regex: query?.brand, $options: 'i' },
    }).select('_id')
    searchId = brand?._id
  }

  // Construct filters for category, subcategory, and brand
  const filters = {
    ...(query?.category ? { category: searchId } : {}),
    ...(query?.subcategory ? { subcategory: searchId } : {}),
    ...(query?.brand ? { brand: searchId } : {}),
  }

  // Construct search query for searchTerm
  let searchQuery = {}
  if (query?.searchTerm) {
    searchQuery = {
      $or: [
        ...searchAbleFields.map(field => ({
          [field]: { $regex: query?.searchTerm, $options: 'i' },
        })),
        {
          features: {
            $elemMatch: {
              featureName: { $regex: query?.searchTerm, $options: 'i' },
            },
          },
        },
      ],
    }
  }

  //search by price range
  if (query?.price && typeof query.price === 'string') {
    const priceRange = query?.price?.split('-')
    const minPrice = Number(priceRange[0])
    const maxPrice = Number(priceRange[1])
    searchQuery = {
      ...searchQuery,
      price: { $gte: minPrice, $lte: maxPrice },
    }
  }

  // Combine filters and searchQuery using $and
  const finalQuery = {
    $and: [{ ...filters }, { ...searchQuery }],
  }

  // Use QueryBuilder to handle final query
  const queryBuilder = new QueryBuilder(Product.find(finalQuery), query)
  const result = await queryBuilder.sort().pagination().fields().modelQuery

  const metaData = await queryBuilder.countTotal()

  return {
    meta: metaData,
    result, // This now includes data after QueryBuilder processing
  }
}

const getSingleProduct = async (id: string) => {
  const result = await Product.findById(id)
  // const result = await Product.aggregate([
  //   { $match: { _id: new Types.ObjectId(id) } },
  //   {
  //     $lookup: {
  //       from: 'variants',
  //       localField: '_id',
  //       foreignField: 'productId',
  //       as: 'variant',
  //     },
  //   },
  // ])
  return result
}

const updateProduct = async (req: Request) => {
  const { id: _id } = req.params
  const payload = req.body

  const isExist = await Product.findById(_id)
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product does not exist')
  }

  // Process multiple images if available
  let files
  if (req.files && Array.isArray(req.files)) {
    files = req.files as Express.Multer.File[]
    payload.images = files.map(file => file.path)
  }

  const filteredPayload = Object.entries(payload).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )

  const result = await Product.findOneAndUpdate({ _id }, filteredPayload, {
    new: true,
  })

  return result
}

const deleteProduct = async (id: string) => {
  const _id = id

  const isExist = await Product.findById(_id)
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product does not exist')
  }

  const result = await Product.findByIdAndUpdate(
    _id,
    { isDeleted: true, isActive: false },
    {
      new: true,
    }
  )
  return result
}

const getNewArrivals = async () => {
  const result = await Product.find({
    isDeleted: false,
    isActive: true,
    isNewArrival: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')
    .sort({ createdAt: -1 })
    .limit(10)

  return result
}

const getProductsByCategory = async (categoryId: string) => {
  const result = await Product.find({
    category: categoryId,
    isDeleted: false,
    isActive: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')

  return result
}

const getProductsByBrand = async (brandId: string) => {
  const result = await Product.find({
    brand: brandId,
    isDeleted: false,
    isActive: true,
  })
    .populate('brand')
    .populate('category')
    .populate('subcategory')

  return result
}

export const ProductService = {
  createProductIntoDB,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getNewArrivals,
  getProductsByCategory,
  getProductsByBrand,
}
