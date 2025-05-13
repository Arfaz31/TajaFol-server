import mongoose, { Schema } from 'mongoose';
import { ICategory } from './category.interface';

const CategorySchema = new Schema<ICategory>(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // subCategory: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Subcategory',
    //   },
    // ],
    // metaTags: [
    //   {
    //     type: String,
    //   },
    // ],
  },
  { timestamps: true },
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
