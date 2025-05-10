import { Category } from './category.model';

import { searchableFields } from './category.constant';
import QueryBuilder from '../../Builder/QueryBuilder';
import { ICategory } from './category.interface';
import { TImageFile } from '../../interface/image.interface';
import AppError from '../../Error/AppError';
import httpStatus from 'http-status';
const createCategory = async (payload: ICategory, image: TImageFile) => {
  if (image) {
    payload.image = image.path;
  }
  const isExist = await Category.findOne({
    categoryName: payload.categoryName,
  });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category has already existed');
  }

  const result = await Category.create(payload);
  return result;
};

const getAllCategory = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(
    Category.find().populate('subCategory'),
    query,
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();
  return { result, meta };
};

const getCategoryById = async (id: string) => {
  const result = await Category.findById(id).populate('subCategory');
  return result;
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>,
  image: TImageFile,
) => {
  if (image) {
    payload.image = image.path;
  }

  const isExist = await Category.findOne({
    _id: id,
  });
  if (!isExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Category does not exit with this id',
    );
  }

  const result = await Category.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deleteCategory = async (id: string) => {
  const _id = id;
  const result = await Category.findByIdAndUpdate(
    _id,
    { isDeleted: true, status: 'INACTIVE' },
    {
      new: true,
    },
  );
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
