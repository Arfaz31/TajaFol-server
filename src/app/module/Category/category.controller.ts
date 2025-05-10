/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from '../../utils/catchAsync';

import httpStatus from 'http-status';
import { CategoryService } from './category.service';
import { sendResponse } from '../../utils/sendResponse';
import { TImageFiles } from '../../interface/image.interface';

const createCategoryIntoDB = catchAsync(async (req, res) => {
  const files = req.files as TImageFiles;

  const image = files?.image ? files.image[0] : undefined;
  const result = await CategoryService.createCategory(req.body, image as any);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategory(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All categories data retrieve successfully',
    data: result,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const result = await CategoryService.getCategoryById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category get successfully',
    data: result,
  });
});

const updateCategoryIntoDB = catchAsync(async (req, res) => {
  const files = req.files as TImageFiles;

  const image = files?.image ? files.image[0] : undefined;
  const { id } = req.params;
  const result = await CategoryService.updateCategory(
    id,
    req.body,
    image as any,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

//soft delete
const deleteCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.deleteCategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategoryIntoDB,
  getAllCategory,
  getCategoryById,
  updateCategoryIntoDB,
  deleteCategory,
};
