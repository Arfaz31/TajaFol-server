import { z } from 'zod';

const productSchemaValidation = z.object({
  body: z.object({
    productName: z
      .string()
      .min(1, 'Product name is required')
      .max(100, 'Product name cannot exceed 100 characters')
      .trim(),
    sku: z
      .string()
      .min(1, 'SKU is required')
      .trim()
      .toLowerCase()
      .refine((sku) => !sku.includes(' '), {
        message: 'SKU cannot contain spaces',
      }),
    shortdescription: z.string().min(1, 'Short description is required').trim(),
    broaddescription: z
      .string()
      .min(100, 'Broad description should be at least 100 characters')
      .trim(),
    category: z.string().min(1, 'Category is required'),
    price: z.number().min(0, 'Price cannot be negative'),
    quantity: z
      .number()
      .int('Quantity must be an integer')
      .min(0, 'Quantity cannot be negative')
      .default(0),
    discountPrice: z
      .number()
      .min(0, 'Discount price cannot be negative')
      .optional(),
    images: z
      .array(z.string().url('Each image URL must be valid'))
      .nonempty('At least one product image is required'),
    isActive: z.boolean().default(true),
    isNewArrival: z.boolean().default(false),
    isTrending: z.boolean().default(false),
    isUpcoming: z.boolean().default(false),
  }),
});

const updateProductSchemaValidation = z.object({
  body: z.object({
    productName: z
      .string()
      .min(1, 'Product name is required')
      .max(100, 'Product name cannot exceed 100 characters')
      .trim()
      .optional(),

    shortdescription: z
      .string()
      .min(1, 'Short description is required')
      .trim()
      .optional(),
    broaddescription: z
      .string()
      .min(100, 'Broad description should be at least 100 characters')
      .trim()
      .optional(),
    subcategory: z.string().optional(),
    price: z.number().min(0, 'Price cannot be negative').optional(),
    quantity: z
      .number()
      .int('Quantity must be an integer')
      .min(0, 'Quantity cannot be negative')
      .optional(),
    discountPrice: z
      .number()
      .min(0, 'Discount price cannot be negative')
      .optional(),
    images: z.array(z.string().url('Each image URL must be valid')).optional(),
    isActive: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
    isTrending: z.boolean().optional(),
    isUpcoming: z.boolean().optional(),
  }),
});

export const ProductValidation = {
  productSchemaValidation,
  updateProductSchemaValidation,
};
