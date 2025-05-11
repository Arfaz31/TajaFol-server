import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { FeedbackServices } from './feedback.services';

const createReviewIntoDB = catchAsync(async (req, res) => {
  const { productId, review } = req.body;
  const userId = req.user.id;
  const reviewData = { productId, userId: userId, review };

  const result = await FeedbackServices.createReviewIntoDB(reviewData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review created successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const { review } = req.body;
  const userId = req.user.id;

  const result = await FeedbackServices.updateReviewIntoDB(
    reviewId,
    userId,
    review,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteFeedback = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  const result = await FeedbackServices.deleteReviewInDB(reviewId, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review deleted successfully',
    data: result,
  });
});

const deleteReviewkAsProductOwner = catchAsync(async (req, res) => {
  const { reviewId, productId } = req.params;
  const ownerId = req.user.id;

  const result = await FeedbackServices.deleteReviewkAsProductOwner(
    reviewId,
    productId,
    ownerId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review deleted by admin successfully',
    data: result,
  });
});

const getReviews = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const result = await FeedbackServices.getReviewsByProductId(productId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review retrieved successfully',
    data: result,
  });
});

const getTotalReview = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const result = await FeedbackServices.getTotalReviewsByProductId(productId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Total Reviews count retrieved successfully',
    data: result,
  });
});

export const FeedbackController = {
  createReviewIntoDB,
  updateReview,
  deleteFeedback,
  deleteReviewkAsProductOwner,
  getReviews,
  getTotalReview,
};
