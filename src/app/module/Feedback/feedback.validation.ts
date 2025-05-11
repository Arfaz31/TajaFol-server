import { z } from 'zod';

const createFeedbackZodSchema = z.object({
  body: z.object({
    productId: z.string(),
    review: z.string().min(1, 'Review content is required'),
  }),
});

const updateFeedbackZodSchema = z.object({
  body: z.object({
    review: z.string().min(1, 'Updated review content is required'),
  }),
});

export const FeedbackValidation = {
  createFeedbackZodSchema,
  updateFeedbackZodSchema,
};
