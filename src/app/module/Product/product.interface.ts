import { Types } from 'mongoose';

export interface IProduct {
  productName: string;
  slug: string;
  shortdescription: string;
  broaddescription: string;
  subcategory: Types.ObjectId;
  price: number;
  quantity: number;
  discountPrice?: number;
  images: string[];
  isActive: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isUpcoming?: boolean;
  feedback?: {
    averageRating: number;
    reviews: Types.ObjectId[];
  };
  totalReviews?: number;
}
