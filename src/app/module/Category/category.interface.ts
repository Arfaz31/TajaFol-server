import { TStatus } from '../User/user.constant';

export interface ICategory {
  categoryName: string;
  description?: string;
  slug: string;
  image: string;
  status: TStatus;

  isDeleted: boolean;
  // subCategory: Types.ObjectId[];
}
