import { config } from '../config';
import AppError from '../Error/AppError';

import { SuperAdmin } from '../module/SuperAdmin/superAdmin.model';
import { UserRole } from '../module/User/user.constant';
import { User } from '../module/User/user.model';
import httpStatus from 'http-status';

const superAdminData = {
  userId: config.SUPERADMIN.USERNAME,
  email: config.SUPERADMIN.EMAIL,
  contact: config.SUPERADMIN.CONTACT,
  password: config.SUPERADMIN.PASSWORD,
  role: config.SUPERADMIN.ROLE,
  isDeleted: config.SUPERADMIN.IS_DELETED,
};

const adminData = {
  fullName: 'SuperAdmin',
  email: config.SUPERADMIN.EMAIL,
  contact: config.SUPERADMIN.CONTACT,
};

export const seedSuperAdmin = async () => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    // Check if super admin exists using lean() for better performance
    const existingSuperAdmin = await User.findOne(
      { role: UserRole.SUPER_ADMIN },
      '_id',
      { session },
    ).lean();

    if (existingSuperAdmin) {
      console.log('Super admin already exists. Skipping creation.');
      await session.commitTransaction();
      return;
    }

    // Create user and admin in a single transaction
    const user = await User.create([superAdminData], { session });
    await SuperAdmin.create([{ ...adminData, user: user[0]._id }], { session });

    await session.commitTransaction();
    console.log('Super admin seeded successfully');
  } catch (error) {
    await session.abortTransaction();
    console.log('Error seeding super admin', error);

    throw new AppError(httpStatus.BAD_REQUEST, 'Error seeding super admin');
  } finally {
    session.endSession();
  }
};
