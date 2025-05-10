import { Types } from 'mongoose';

type TGender = 'male' | 'female';

export interface ICustomer {
  fullName: string;
  user: Types.ObjectId;
  email: string;
  contact: string;
  emergencyContact: string;
  gender: TGender;
  profileImage?: string;
  dateOfBirth?: string;
  address: string;
  isDeleted: boolean;
}
