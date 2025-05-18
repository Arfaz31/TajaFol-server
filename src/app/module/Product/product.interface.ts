import { Types } from 'mongoose';

export interface IProduct {
  productName: string;
  sku: string;
  shortdescription: string;
  broaddescription: string;
  category: Types.ObjectId;
  price: number;
  quantity: number;
  unit: number;
  productUnitType: string;
  discountPrice?: number;
  images: string[];
  isActive: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isUpcoming?: boolean;
  averageRating: number;
  reviews: Types.ObjectId[];

  totalReviews?: number;
}
