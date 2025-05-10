import catchAsync from '../../utils/catchAsync';

import httpStatus from 'http-status';
import { UserServices } from './user.service';
import { sendResponse } from '../../utils/sendResponse';

const register = catchAsync(async (req, res) => {
  const { password, customers } = req.body;
  const result = await UserServices.registerUser(password, customers);
  if (result) {
    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const createAdminIntoDB = catchAsync(async (req, res) => {
  const { password, admin } = req.body;
  const result = await UserServices.createAdmin(password, admin);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const getAllCustomers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllCustomersFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Customer data retrieve successfully',
    data: result,
  });
});

const getMeFromDB = catchAsync(async (req, res) => {
  const { id } = req.user;

  const result = await UserServices.getMe(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile get successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.deleteUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserController = {
  register,
  createAdminIntoDB,
  getAllCustomers,
  getMeFromDB,
  deleteUser,
};
