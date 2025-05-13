import AppError from '../../Error/AppError';
import { isPasswordMatched, User } from '../User/user.model';
import { TAuth } from './auth.interface';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import { jwtHelpers } from '../../utils/JWTHelpers';
import { config } from '../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import emailSender from './emailSender';
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
  const user = await User.findOne({ contact: payload.contact });
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

const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email: email }).select('email contact');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const token = jwtHelpers.generateToken(
    { email: user.email },
    config.reset_pass_secret as string,
    config.reset_pass_expire_in as string,
  );

  const resetLink =
    config.reset_pass_url + `?email=${user.email}&token=${token}`;

  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; background-color: #4caf50; padding: 15px 0; border-radius: 10px 10px 0 0; color: white;">
          <h1 style="margin: 0; font-size: 26px;">TazaaFol Password Reset</h1>
        </div>
        <div style="padding: 25px; text-align: center; color: #333;">
          <h2 style="font-size: 22px;">Hello!</h2>
          <p style="font-size: 16px; margin: 20px 0;">We received a request to reset your TazaaFol account password. Click the button below to reset it.</p>
          <a href="${resetLink}" style="display: inline-block; text-decoration: none; background-color: #4caf50; color: white; padding: 12px 25px; border-radius: 6px; font-size: 16px; margin-top: 20px;">Reset Password</a>
        </div>
        <div style="text-align: center; margin-top: 25px; font-size: 13px; color: #888;">
          <p>If you didn’t request a password reset, you can ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} TazaaFol Fruits. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await emailSender(user.email, emailHTML);
};

const resetPassword = async (token: string, password: string) => {
  const decodedToken = jwtHelpers.verifyToken(
    token,
    config.reset_pass_secret as string,
  ) as JwtPayload;

  if (!decodedToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }

  const user = await User.findOne({ email: decodedToken.email }).select(
    '+password',
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // console.log('password', password);

  const newHashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: user.email,
      isDeleted: false,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return {
    message: 'Password reset successfully',
  };
};

export const AuthService = {
  login,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
