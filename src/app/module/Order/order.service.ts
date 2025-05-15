/* eslint-disable @typescript-eslint/no-explicit-any */
// order.service.ts
import { Types } from 'mongoose';
import httpStatus from 'http-status';
import { Order } from './order.model';
import { Product } from '../Product/product.model';
import { IOrder, TShippingOrder } from './order.interface';
import AppError from '../../Error/AppError';
import QueryBuilder from '../../Builder/QueryBuilder';
import mongoose from 'mongoose';

import { v4 as uuidv4 } from 'uuid';
const generateMRIdFromUUID = () => {
  const uuid = uuidv4();
  const digits = uuid.replace(/\D/g, '').slice(0, 4);
  return `TNX-${digits}`;
};

const createOrderIntoDB = async (payload: IOrder): Promise<IOrder> => {
  const transactionId = generateMRIdFromUUID();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Validate and prepare order items
    const orderItems: TShippingOrder[] = [];
    let calculatedTotalPrice = 0;

    // Validate each product and check inventory
    for (const item of payload.orderItems) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Product with ID ${item.productId} not found`,
        );
      }

      if (!product.isActive) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Product ${product.productName} is not available for purchase`,
        );
      }

      if (product.quantity < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for ${product.productName}. Available: ${product.quantity}`,
        );
      }

      // Prepare order item with current product info
      const orderItem: TShippingOrder = {
        productId: product._id,
        quantity: item.quantity,
        price: product.discountPrice || product.price,
        name: product.productName,
      };

      orderItems.push(orderItem);

      // Update calculated total price
      calculatedTotalPrice += orderItem.price * item.quantity;

      // Decrement product quantity
      product.quantity -= item.quantity;
      await product.save({ session });
    }

    // Validate total price in payload matches calculated price
    if (Math.abs(calculatedTotalPrice - payload.totalPrice) > 0.01) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Order total price mismatch. Expected: ${calculatedTotalPrice}, Received: ${payload.totalPrice}`,
      );
    }

    // Create order with prepared items
    const orderData = {
      ...payload,
      orderItems,
      totalPrice: calculatedTotalPrice,
      transactionId,
    };

    const newOrder = await Order.create([orderData], { session });

    await session.commitTransaction();
    return newOrder[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    Order.find().populate('userId', 'name email').sort({ createdAt: -1 }),
    query,
  );

  const result = await orderQuery.filter().sort().paginate().fields()
    .modelQuery;

  const meta = await orderQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleOrder = async (id: string) => {
  const result = await Order.findById(id).populate('userId', 'name email');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return result;
};

const getMyOrders = async (userId: string) => {
  const orders = await Order.find({ userId: new Types.ObjectId(userId) }).sort({
    createdAt: -1,
  });

  return orders;
};

const updateOrderStatus = async (id: string, status: string) => {
  const validStatuses = ['pending', 'shipped', 'cancelled'];

  if (!validStatuses.includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid order status');
  }

  const order = await Order.findById(id);

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // If order is being cancelled and was not cancelled before, restore inventory
  if (status === 'cancelled' && order.status !== 'cancelled') {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Restore product quantities
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: item.quantity } },
          { session },
        );
      }

      // Update order status
      order.status = status as any;
      await order.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } else {
    // Just update status if not cancelling or already cancelled
    order.status = status as any;
    await order.save();
  }

  return order;
};

export const OrderService = {
  createOrderIntoDB,
  getAllOrders,
  getSingleOrder,
  getMyOrders,
  updateOrderStatus,
};
