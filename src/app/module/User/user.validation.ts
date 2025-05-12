import { z } from 'zod';

const customerSchemaValidation = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password is required',
    }),
    customers: z.object({
      fullName: z.string().min(1, 'Full name is required'),
      email: z.string().email('Invalid email format'),
      contact: z.string().min(11, 'Contact number must be at least 11 digits'),
      emergencyContact: z
        .string()
        .min(11, 'Emergency contact must be at least 11 digits'),
      address: z.string().min(1, 'Address is required'),
    }),
  }),
});

export const UpdateUserValidationSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    emergencyContact: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const UserValidation = {
  customerSchemaValidation,
};
