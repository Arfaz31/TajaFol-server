import AppError from '../../Error/AppError';
import { isPasswordMatched, User } from '../User/user.model';
import { TAuth } from './auth.interface';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import { jwtHelpers } from '../../utils/JWTHelpers';
import { config } from '../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
// import { v4 as uuidv4 } from 'uuid';
// import { IUser } from '../User/user.interface';

// const signUp = async (payload: IUser) => {
//   const user = await User.findOne({ email: payload.email });
//   if (user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'You already have an account');
//   }

//   // Extract portion of the email before '@'
//   const emailPrefix = payload.email.split('@')[0];

//   // Generate a short UUID (first 6 characters for uniqueness)
//   const shortUuid = uuidv4().slice(0, 6);

//   // Generate username using email prefix + UUID
//   payload.userName = `${emailPrefix}_${shortUuid}`;

//   const newUser = await User.create(payload);
//   return newUser;
// };

const login = async (payload: TAuth) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user is deleted');
  }

  const comparePassword = await bcrypt.compare(payload.password, user.password);
  if (!comparePassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password does not match');
  }

  const JwtPayload = {
    id: user._id,
    email: user.email,
    userId: user.userId,
    contact: user.contact,
    role: user.role,
    profileImg: user?.profileImg,
  };

  const accessToken = jwtHelpers.generateToken(
    JwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expire_in as string,
  );
  const refreshToken = jwtHelpers.generateToken(
    JwtPayload,
    config.jwt_refresh_secret as Secret,
    config.jwt_refresh_expire_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.findOne({ _id: userData._id }).select('+password');
  //+password means give other fields with password
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found!');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
  }

  //check if the password is correct
  const passwordMatch = await isPasswordMatched(
    payload.oldPassword, //plain text password
    user.password, //hash password
  );
  if (!passwordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password is incorrect');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwtHelpers.verifyToken(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { id, iat } = decoded;

  const user = await User.findOne({ id }).select('+password');

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been deleted');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    id: user._id,
    email: user.email,
    userId: user.userId,
    contact: user.contact,
    role: user.role,
    profileImg: user?.profileImg,
  };

  const accessToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  login,
  changePassword,
  refreshToken,
};
