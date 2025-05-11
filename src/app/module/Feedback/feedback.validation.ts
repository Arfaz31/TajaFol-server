import { z } from 'zod';

const createFeedbackZodSchema = z.object({
  body: z.object({
    course: z.string(),
    content: z.string().min(1, 'Content is required'),
  }),
});

const updateFeedbackZodSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Updated content is required'),
  }),
});

export const FeedbackValidation = {
  createFeedbackZodSchema,
  updateFeedbackZodSchema,
};
