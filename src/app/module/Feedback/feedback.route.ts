import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { validateRequest } from '../../middleware/validateRequest';
import { FeedbackValidation } from './feedback.validation';
import { FeedbackController } from './feedback.controller';

const router = Router();

// Create a feedback
router.post(
  '/create-feedback',
  auth(...Object.values(USER_ROLE)),
  validateRequest(FeedbackValidation.createFeedbackZodSchema),
  FeedbackController.createFeedback,
);

// Update a feedback
router.patch(
  '/update-feedback/:feedbackId',
  auth(...Object.values(USER_ROLE)),
  validateRequest(FeedbackValidation.updateFeedbackZodSchema),
  FeedbackController.updateFeedback,
);

// Delete a feedback by the student
router.delete(
  '/delete-feedback/:feedbackId',
  auth(USER_ROLE.STUDENT),
  FeedbackController.deleteFeedback,
);

// Delete a feedback by the course owner
router.delete(
  '/course-owner-delete/:feedbackId/:courseId',
  auth(USER_ROLE.TEACHER),
  FeedbackController.deleteFeedbackAscourseOwner,
);

// Get feedbacks by course ID
router.get(
  '/get-all-feedback/:courseId',
  auth(...Object.values(USER_ROLE)),
  FeedbackController.getFeedbacks,
);

// Get total feedback count by Course ID
router.get(
  '/get-total-feedback/:postId',
  auth(...Object.values(USER_ROLE)),
  FeedbackController.getTotalFeedback,
);

export const FeedbackRoutes = router;
