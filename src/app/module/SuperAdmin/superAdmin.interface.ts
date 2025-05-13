import { Types } from 'mongoose';

export interface ISuperAdmin {
  fullName: string;
  user: Types.ObjectId;
  email: string;
  contact: string;
  emergencyContact?: string;
  profileImage?: string;
  address?: string;
  isDeleted: boolean;
}
