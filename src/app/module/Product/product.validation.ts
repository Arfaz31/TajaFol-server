import { z } from 'zod'

const FeatureSchema = z.object({
  featureName: z.string().min(1, 'Feature name is required').trim(),
})

const productSchemaValidation = z.object({
  productName: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name cannot exceed 100 characters')
    .trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .trim()
    .toLowerCase()
    .refine(slug => !slug.includes(' '), {
      message: 'Slug cannot contain spaces',
    }),
  description: z
    .string()
    .min(10, 'Description should be at least 10 characters')
    .trim(),
  brand: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  varient: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .nonnegative('Quantity cannot be negative')
    .default(0),

  stock: z
    .number()
    .int('Stock must be an integer')
    .nonnegative('Stock cannot be negative')
    .default(0),
  discountPercentage: z
    .number()
    .min(0, 'Discount percentage cannot be negative')
    .max(100, 'Discount percentage cannot exceed 100%')
    .default(0),
  tax: z.number().nonnegative('Tax cannot be negative').default(0),
  features: z.array(FeatureSchema).default([]),
  isActive: z.boolean().default(true),
  isNewArrival: z.boolean().default(false),
  averageRating: z
    .number()
    .min(0, 'Rating cannot be negative')
    .max(5, 'Rating cannot exceed 5')
    .default(0),
  totalReviews: z
    .number()
    .int('Total reviews must be an integer')
    .nonnegative('Total reviews cannot be negative')
    .default(0),
})

const updateFeatureSchema = z.object({
  featureName: z.string().min(1, 'Feature name is required').trim(),
})

const updateProductSchemaValidation = z.object({
  productName: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name cannot exceed 100 characters')
    .trim()
    .optional(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .trim()
    .toLowerCase()
    .refine(slug => !slug.includes(' '), {
      message: 'Slug cannot contain spaces',
    })
    .optional(),
  description: z
    .string()
    .min(10, 'Description should be at least 10 characters')
    .trim()
    .optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  varient: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative').optional(),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .nonnegative('Quantity cannot be negative')
    .default(0)
    .optional(),
  stock: z
    .number()
    .int('Stock must be an integer')
    .nonnegative('Stock cannot be negative')
    .default(0)
    .optional(),
  discountPercentage: z
    .number()
    .min(0, 'Discount percentage cannot be negative')
    .max(100, 'Discount percentage cannot exceed 100%')
    .default(0)
    .optional(),
  tax: z.number().nonnegative('Tax cannot be negative').default(0).optional(),
  features: z.array(updateFeatureSchema).default([]).optional(),
  isActive: z.boolean().default(true).optional(),
  isNewArrival: z.boolean().default(false).optional(),
  averageRating: z
    .number()
    .min(0, 'Rating cannot be negative')
    .max(5, 'Rating cannot exceed 5')
    .default(0)
    .optional(),
  totalReviews: z
    .number()
    .int('Total reviews must be an integer')
    .nonnegative('Total reviews cannot be negative')
    .default(0)
    .optional(),
})

export const ProductValidation = {
  productSchemaValidation,
  updateProductSchemaValidation,
}
