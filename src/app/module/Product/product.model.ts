import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const FeedbackSchema = new Schema(
  {
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  { _id: false },
);

const ProductSchema = new Schema<IProduct>(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    shortdescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    broaddescription: {
      type: String,
      required: [true, 'Broad description is required'],
      trim: true,
      minlength: [100, 'Broad description should be at least 100 characters'],
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true,
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
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
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
    isTrending: {
      type: Boolean,
      default: false,
    },
    isUpcoming: {
      type: Boolean,
      default: false,
    },
    feedback: {
      type: FeedbackSchema,
      default: () => ({}),
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Total reviews cannot be negative'],
    },
  },
  {
    timestamps: true,
  },
);

export const Product = model<IProduct>('Product', ProductSchema);
