export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type TStatus = 'ACTIVE' | 'INACTIVE';

export const customerSearchableFields = [
  'fullName',
  'email',
  'contact',
  'address',
];
