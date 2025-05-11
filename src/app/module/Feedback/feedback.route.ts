import { Router } from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../User/user.constant';
import { validateRequest } from '../../middleware/validateRequest';
import { FeedbackValidation } from './feedback.validation';
import { FeedbackController } from './feedback.controller';

const router = Router();

// Create a feedback
router.post(
  '/create-review',
  auth(...Object.values(UserRole)),
  validateRequest(FeedbackValidation.createFeedbackZodSchema),
  FeedbackController.createReviewIntoDB,
);

// Update a feedback
router.patch(
  '/update-review/:reviewId',
  auth(...Object.values(UserRole)),
  validateRequest(FeedbackValidation.updateFeedbackZodSchema),
  FeedbackController.updateReview,
);

// Delete a feedback by the customer
router.delete(
  '/delete-review/:reviewId',
  auth(UserRole.CUSTOMER),
  FeedbackController.deleteFeedback,
);

// Delete a feedback by the admin
router.delete(
  '/delete-review-by-admin/:reviewId/:productId',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  FeedbackController.deleteReviewkAsProductOwner,
);

// Get feedbacks by product ID
router.get(
  '/get-all-review/:productId',
  auth(...Object.values(UserRole)),
  FeedbackController.getReviews,
);

// Get total feedback count by productId
router.get(
  '/get-total-review/:productId',
  auth(...Object.values(UserRole)),
  FeedbackController.getTotalReview,
);

export const FeedbackRoutes = router;
