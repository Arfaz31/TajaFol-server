import QueryBuilder from '../../Builder/QueryBuilder';
import AppError from '../../Error/AppError';
import { TImageFile } from '../../interface/image.interface';
import { searchableFields } from './subcategory.constant';
import { ISubcategory } from './subcategory.interface';
import { Subcategory } from './subcategory.model';
import httpStatus from 'http-status';

const createSubcategory = async (payload: ISubcategory, image: TImageFile) => {
  if (image) {
    payload.image = image.path;
  }

  const isExist = await Subcategory.findOne({
    subcategoryName: payload.subcategoryName,
  });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Subcategory already exist');
  }

  const result = await Subcategory.create(payload);
  return result;
};

const getAllsubcategory = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(
    Subcategory.find().populate('category'),
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

const updatesubcategory = async (
  id: string,
  payload: Partial<ISubcategory>,
  image: TImageFile,
) => {
  if (image) {
    payload.image = image.path;
  }

  const isExist = await Subcategory.findOne({
    _id: id,
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subcategory does not exist');
  }

  const result = await Subcategory.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const deletesubcategory = async (id: string) => {
  const _id = id;

  const isExist = await Subcategory.findById(_id);

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subcategory does not exist');
  }

  const result = await Subcategory.findByIdAndUpdate(
    _id,
    { isDeleted: true, status: 'INACTIVE' },
    {
      new: true,
    },
  );
  return result;
};

export const SubcategoryService = {
  createSubcategory,
  getAllsubcategory,
  updatesubcategory,
  deletesubcategory,
};
