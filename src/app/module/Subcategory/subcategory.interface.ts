import { Types } from 'mongoose';
import { TStatus } from '../User/user.constant';

export interface ISubcategory {
  subcategoryName: string;
  category: Types.ObjectId;
  description?: string;
  slug: string;
  image: string;
  status: TStatus;
  metaTags?: string[];
  isDeleted: boolean;
}
