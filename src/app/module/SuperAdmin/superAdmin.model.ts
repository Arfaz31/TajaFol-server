import { model, Schema } from 'mongoose';

import { ISuperAdmin } from './superAdmin.interface';

const superAdminSchema = new Schema<ISuperAdmin>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
    },

    emergencyContact: {
      type: String,
    },

    profileImage: {
      type: String,
    },
    address: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const SuperAdmin = model<ISuperAdmin>('SuperAdmin', superAdminSchema);
