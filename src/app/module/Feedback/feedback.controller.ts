import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { FeedbackServices } from './feedback.services';

const createFeedback = catchAsync(async (req, res) => {
  const { course, content } = req.body;
  const userId = req.user.id;
  const FeedbackData = { course, user: userId, content };

  const result = await FeedbackServices.createFeedbackIntoDB(FeedbackData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Feedback created successfully',
    data: result,
  });
});

const updateFeedback = catchAsync(async (req, res) => {
  const { feedbackId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const result = await FeedbackServices.updateFeedbackIntoDB(
    feedbackId,
    userId,
    content,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Feedback updated successfully',
    data: result,
  });
});

const deleteFeedback = catchAsync(async (req, res) => {
  const { feedbackId } = req.params;
  const userId = req.user.id;

  const result = await FeedbackServices.deleteFeedbackInDB(feedbackId, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Feedback deleted successfully',
    data: result,
  });
});

const deleteFeedbackAscourseOwner = catchAsync(async (req, res) => {
  const { feedbackId, courseId } = req.params;
  const ownerId = req.user.id;

  const result = await FeedbackServices.deleteFeedbackAsCourseOwner(
    feedbackId,
    courseId,
    ownerId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Feedback deleted by course owner successfully',
    data: result,
  });
});

const getFeedbacks = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const result = await FeedbackServices.getFeedbacksByCourseId(courseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Feedbacks retrieved successfully',
    data: result,
  });
});

const getTotalFeedback = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const result = await FeedbackServices.getTotalFeedbacksByCourseId(courseId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total Feedbacks count retrieved successfully',
    data: result,
  });
});

export const FeedbackController = {
  createFeedback,
  updateFeedback,
  deleteFeedback,
  deleteFeedbackAscourseOwner,
  getFeedbacks,
  getTotalFeedback,
};
