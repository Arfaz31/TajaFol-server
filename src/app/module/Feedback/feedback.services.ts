import httpStatus from 'http-status';
import AppError from '../../Error/AppError';
import { TFeedback } from './feedback.inteface';
import { Feedback } from './feedback.model';
import { Course } from '../Course/course.model';

const createFeedbackIntoDB = async (payload: TFeedback) => {
  const result = await Feedback.create(payload);
  // Add the Feedback ID to the Feedbacks array in the Course document
  await Course.findByIdAndUpdate(payload.course, {
    $addToSet: { feedback: result._id }, // Use result._id here
  });
  return result;
};

const updateFeedbackIntoDB = async (
  feedbackId: string,
  userId: string,
  content: string,
) => {
  const feedback = await Feedback.findOne({ _id: feedbackId, user: userId });
  if (!feedback) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Feedback not found or unauthorized access',
    );
  }

  feedback.content = content;
  await feedback.save();
  return feedback;
};

//delete Feedback as a Feedbacker in other Course
const deleteFeedbackInDB = async (feedbackId: string, userId: string) => {
  const feedback = await Feedback.findOne({ _id: feedbackId, user: userId });
  if (!feedback) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Feedback not found or unauthorized access',
    );
  }
  await Course.findByIdAndUpdate(feedback.course, {
    $pull: { feedback: feedback._id },
  });

  await Feedback.deleteOne({ _id: feedbackId });
  return { success: true };
};

const deleteFeedbackAsCourseOwner = async (
  feedbackId: string,
  courseId: string,
  ownerId: string,
) => {
  const course = await Course.findOne({ _id: courseId, user: ownerId });
  if (!Course) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not the owner of this Course',
    );
  }
  await Course.findByIdAndUpdate(course?._id, {
    $pull: { feedback: feedbackId },
  });

  await Feedback.deleteOne({ _id: feedbackId, course: courseId });
  return { success: true };
};

const getFeedbacksByCourseId = async (courseId: string) => {
  const feedbacks = await Feedback.find({ course: courseId })
    .populate('user', 'name email')
    .populate({
      path: 'course',
      select: '_id title description',
      populate: { path: 'teacher', select: '_id name email' },
    });
  return feedbacks;
};

const getTotalFeedbacksByCourseId = async (courseId: string) => {
  const totalFeedbacks = await Feedback.countDocuments({ course: courseId });
  return totalFeedbacks;
};

export const FeedbackServices = {
  createFeedbackIntoDB,
  updateFeedbackIntoDB,
  deleteFeedbackInDB,
  deleteFeedbackAsCourseOwner,
  getFeedbacksByCourseId,
  getTotalFeedbacksByCourseId,
};
