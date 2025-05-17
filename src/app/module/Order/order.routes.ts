// order.route.ts
import express from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../User/user.constant';

import { OrderController } from './order.controller';

const router = express.Router();

router.post(
  '/create',

  OrderController.createOrder,
);

// Get all orders - admin only
router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.getAllOrders,
);

// Get my orders - authenticated users only
router.get(
  '/my-orders',
  auth(...Object.values(UserRole)),
  OrderController.getMyOrders,
);

// Get single order - admin and the user who placed the order
router.get(
  '/:id',
  // auth(...Object.values(UserRole)),
  OrderController.getSingleOrder,
);

// Update order status - admin only
router.patch(
  '/:id/status',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  //   validateRequest(OrderValidation.updateOrderStatusValidationSchema),
  OrderController.updateOrderStatus,
);

export const OrderRoutes = router;
