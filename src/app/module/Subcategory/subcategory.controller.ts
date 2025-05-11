/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { SubcategoryService } from './subcategory.service';
import { sendResponse } from '../../utils/sendResponse';
import { TImageFiles } from '../../interface/image.interface';

const createSubCategoryIntoDB = catchAsync(async (req, res) => {
  const files = req.files as TImageFiles;

  const image = files?.image ? files.image[0] : undefined;
  const result = await SubcategoryService.createSubcategory(
    req.body,
    image as any,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'SubCategory created successfully',
    data: result,
  });
});

const getAllSubcategory = catchAsync(async (req, res) => {
  const result = await SubcategoryService.getAllsubcategory(req.query);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'SubCategory retrieved successfully',
    meta: result?.meta,
    data: result,
  });
});

const updateSubcategoryIntoDB = catchAsync(async (req, res) => {
  const files = req.files as TImageFiles;

  const image = files?.image ? files.image[0] : undefined;
  const { id } = req.params;
  const result = await SubcategoryService.updatesubcategory(
    id,
    req.body,
    image as any,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'SubCategory updated successfully',
    data: result,
  });
});

//soft delete
const deleteSubcategory = catchAsync(async (req, res) => {
  const result = await SubcategoryService.deletesubcategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'SubCategory deleted successfully',
    data: result,
  });
});

export const SubcategoryController = {
  createSubCategoryIntoDB,
  getAllSubcategory,
  updateSubcategoryIntoDB,
  deleteSubcategory,
};
