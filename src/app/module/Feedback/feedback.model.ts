import { Schema, model } from 'mongoose';
import { TReview } from './feedback.inteface';

const reviewSchema = new Schema<TReview>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    // replies: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Comment',
    //   },
    // ],
  },
  {
    timestamps: true,
  },
);

export const Review = model<TReview>('Review', reviewSchema);
