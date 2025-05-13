import { z } from 'zod';

const CategoryValidationSchema = z.object({
  body: z.object({
    categoryName: z
      .string()
      .min(2, 'Category name must be at least 2 characters')
      .max(100, 'Category name cannot exceed 100 characters'),

    description: z.string().optional(),

    slug: z
      .string()
      .min(2, 'Slug must be at least 2 characters')
      .max(100, 'Slug cannot exceed 100 characters'),
  }),
});

const UpdateCategoryValidationSchema = z.object({
  body: z.object({
    categoryName: z.string().optional(),
    description: z.string().optional(),
    slug: z.string().optional(),
  }),
});

export const CategoryValidation = {
  CategoryValidationSchema,
  UpdateCategoryValidationSchema,
};
