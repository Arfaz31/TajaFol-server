import { Types } from 'mongoose';

export type TReview = {
  id?: string;
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  review: string;
};
