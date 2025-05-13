import { z } from 'zod';

const SubCategoryValidationSchema = z.object({
  body: z.object({
    subcategoryName: z
      .string()
      .min(2, 'Category name must be at least 2 characters')
      .max(100, 'Category name cannot exceed 100 characters'),

    category: z.string().min(2, 'Category name must be at least 2 characters'),

    description: z.string().optional(),
    slug: z
      .string()
      .min(2, 'Slug must be at least 2 characters')
      .max(100, 'Slug cannot exceed 100 characters'),
  }),
});

const UpdateSubcategoryValidationSchema = z.object({
  body: z.object({
    categoryName: z.string().optional(),
    description: z.string().optional(),
    slug: z.string().optional(),
  }),
});

export const SubcategoryValidation = {
  SubCategoryValidationSchema,
  UpdateSubcategoryValidationSchema,
};
