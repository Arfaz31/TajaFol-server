import { Types } from 'mongoose';

type TGender = 'Male' | 'Female';

export interface IAdmin {
  fullName: string;
  user: Types.ObjectId;
  email: string;
  contact: string;
  emergencyContact: string;
  gender: TGender;
  profileImage?: string;
  address: string;
  isDeleted: boolean;
}
