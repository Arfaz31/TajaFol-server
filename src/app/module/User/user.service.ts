/* eslint-disable @typescript-eslint/no-explicit-any */

import { ICustomer } from '../Customers/customers.interface';
import { IUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status';
import { Customers } from '../Customers/customers.model';
import { customerSearchableFields, UserRole } from './user.constant';
import { Admin } from '../Admin/admin.model';
import { IAdmin } from '../Admin/admin.interface';

import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import AppError from '../../Error/AppError';
import { config } from '../../config';
import { jwtHelpers } from '../../utils/JWTHelpers';
import QueryBuilder from '../../Builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import { TImageFile } from '../../interface/image.interface';

const generateUserId = (name: string): string => {
  const cleanName = name.trim().split(' ').join('').toLowerCase();
  const shortUuid = uuidv4().slice(0, 6); // keep it short & readable
  return `${cleanName}-${shortUuid}`;
};

//REGISTER
const registerUser = async (password: string, payload: ICustomer) => {
  const userName = generateUserId(payload.fullName);

  const userData: Partial<IUser> = {
    userId: userName,
    email: payload.email,
    contact: payload.contact,
    password,
    role: UserRole.CUSTOMER,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const createdUser = await User.create([userData], { session });

    if (!createdUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
    }

    payload.user = createdUser[0]._id;

    const createdCustomer = await Customers.create([payload], { session });

    if (!createdCustomer.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Customer creation failed');
    }

    await session.commitTransaction();
    await session.endSession();

    const jwtPayload = {
      id: createdUser[0]._id,
      userId: createdUser[0].userId,
      email: createdUser[0].email,
      role: createdUser[0].role,
      contact: createdUser[0].contact,
    };

    const accessToken = jwtHelpers.generateToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expire_in as string,
    );

    const refreshToken = jwtHelpers.generateToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expire_in as string,
    );

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    // console.error('Registration Error:', error)

    throw new AppError(
      httpStatus.BAD_REQUEST,
      (error as Error).message || 'Account Registration failed',
    );
  }
};

//create-admin
const createAdmin = async (password: string, payload: IAdmin) => {
  const userName = generateUserId(payload.fullName);

  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const userData: Partial<IUser> = {};

  //user-data
  userData.userId = userName;
  userData.email = payload.email;
  userData.contact = payload.contact;
  userData.password = password;
  userData.role = UserRole.ADMIN;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const createUser = await User.create([userData], { session });

    if (!createUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Account Registration failed');
    }

    if (createUser.length > 0) {
      payload.user = createUser[0]._id;
      const createAdmin = await Admin.create([payload], { session });

      if (!createAdmin.length) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Account Registration failed',
        );
      }

      await session.commitTransaction();
      await session.endSession();

      return createAdmin;
    }
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

//get all user
const getAllCustomersFromDB = async (query: Record<string, unknown>) => {
  const customerQuery = new QueryBuilder(
    Customers.find().populate('user'),
    query,
  )
    .search(customerSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await customerQuery.modelQuery;
  const meta = await customerQuery.countTotal();
  return { result, meta };
};

//Get me
const getMe = async (id: string) => {
  const isUserExist = await User.findOne({ _id: id });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User with this id not found');
  }

  if (isUserExist.role === UserRole.ADMIN) {
    const getProfile = await Admin.findOne({ user: isUserExist._id }).populate(
      'user',
    );
    return getProfile;
  } else if (isUserExist.role === UserRole.CUSTOMER) {
    const getProfile = await Customers.findOne({
      user: isUserExist._id,
    }).populate('user');
    return getProfile;
  }
};

const updateUserProfileData = async (
  user: JwtPayload, // Logged-in user
  data: Partial<IUser>,
  profileImg?: TImageFile,
) => {
  const profileImagePath = (profileImg && profileImg.path) || '';

  const result = await User.findOneAndUpdate(
    { _id: user.id },
    { ...data, profileImg: profileImagePath },
    { new: true },
  );
  return result;
};

//soft delete
const deleteUser = async (id: string) => {
  const _id = id;
  const isUserExist = await User.findById(_id);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (isUserExist.role === UserRole.CUSTOMER) {
      await User.updateOne(
        { _id: _id },
        { $set: { isDeleted: true, status: 'INACTIVE' } },
        { session },
      );
      await Customers.updateOne(
        { user: _id },
        { $set: { isDeleted: true } },
        { session },
      );
    } else if (isUserExist.role === UserRole.ADMIN) {
      await User.updateOne(
        { _id: _id },
        { $set: { isDeleted: true, status: 'INACTIVE' } },
        { session },
      );
      await Admin.updateOne(
        { user: _id },
        { $set: { isDeleted: true } },
        { session },
      );
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'User delete failed');
  }
};

export const UserServices = {
  registerUser,
  createAdmin,
  getAllCustomersFromDB,
  getMe,
  updateUserProfileData,
  deleteUser,
};
