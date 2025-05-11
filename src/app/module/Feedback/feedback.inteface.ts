import { Types } from 'mongoose';

export type TFeedback = {
  id?: string;
  course: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
};
