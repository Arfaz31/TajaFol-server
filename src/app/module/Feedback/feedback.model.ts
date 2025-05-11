import { Schema, model } from 'mongoose';
import { TFeedback } from './feedback.inteface';

const feedbackSchema = new Schema<TFeedback>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // replies: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Comment',
    //   },
    // ],
  },
  {
    timestamps: true,
  },
);

export const Feedback = model<TFeedback>('Feedback', feedbackSchema);
