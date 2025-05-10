import { Types } from 'mongoose';
import { TStatus } from '../User/user.constant';

export interface ICategory {
  categoryName: string;
  description?: string;
  slug: string;
  image: string;
  status: TStatus;
  metaTags?: string[];
  isDeleted: boolean;
  subCategory: Types.ObjectId[];
}
