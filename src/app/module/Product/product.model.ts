import { Schema, model } from 'mongoose'
import { IProduct, TFeatures } from './product.interface'

const FeatureSchema = new Schema<TFeatures>({
  featureName: {
    type: String,
    required: [true, 'Feature name is required'],
    trim: true,
  },
})

const ProductSchema = new Schema<IProduct>(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description should be at least 10 characters'],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: 'Variant',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    discountPercentage: {
      type: Number,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100%'],
      default: 0,
    },
    tax: {
      type: Number,
      min: [0, 'Tax cannot be negative'],
      default: 0,
    },
    features: {
      type: [FeatureSchema],
      default: [],
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Total reviews cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
)

export const Product = model<IProduct>('Product', ProductSchema)
