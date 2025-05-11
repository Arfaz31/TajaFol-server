import httpStatus from 'http-status';
import AppError from '../../Error/AppError';

import { Product } from '../Product/product.model';
import { TReview } from './feedback.inteface';
import { Review } from './feedback.model';

const createReviewIntoDB = async (payload: TReview) => {
  const result = await Review.create(payload);

  await Product.findByIdAndUpdate(payload.productId, {
    $addToSet: { reviews: result._id }, // Use result._id here
  });
  return result;
};

const updateReviewIntoDB = async (
  reviewId: string,
  userId: string,
  review: string,
) => {
  const reviewData = await Review.findOne({ _id: reviewId, user: userId });
  if (!reviewData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Review not found or unauthorized access',
    );
  }

  reviewData.review = review;
  await reviewData.save();
  return reviewData;
};

//delete Feedback as a Feedbacker in other Course
const deleteReviewInDB = async (reviewId: string, userId: string) => {
  const reviewData = await Review.findOne({ _id: reviewId, user: userId });
  if (!reviewData) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Feedback not found or unauthorized access',
    );
  }
  await Product.findByIdAndUpdate(reviewData.productId, {
    $pull: { reviews: reviewData._id },
  });

  await Review.deleteOne({ _id: reviewId });
  return { success: true };
};

const deleteReviewkAsProductOwner = async (
  reviewId: string,
  productId: string,
  adminId: string,
) => {
  const product = await Product.findOne({ _id: productId, user: adminId });
  if (!product) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not the owner of this product',
    );
  }
  await Product.findByIdAndUpdate(product?._id, {
    $pull: { reviews: reviewId },
  });

  await Review.deleteOne({ _id: reviewId, productId: productId });
  return { success: true };
};

const getReviewsByProductId = async (productId: string) => {
  const reviewData = await Review.find({ productId: productId })
    .populate('userId', 'name email')
    .populate({
      path: 'productId',
      select: '_id productName sku price images isActive averageRating',
    });
  return reviewData;
};

const getTotalReviewsByProductId = async (productId: string) => {
  const totalReviews = await Review.countDocuments({ productId: productId });
  return totalReviews;
};

export const FeedbackServices = {
  createReviewIntoDB,
  updateReviewIntoDB,
  deleteReviewInDB,
  deleteReviewkAsProductOwner,
  getReviewsByProductId,
  getTotalReviewsByProductId,
};
