/* eslint-disable @typescript-eslint/no-explicit-any */
// order.model.ts
import { Schema, model } from 'mongoose';
import { IOrder, TOrderStatus } from './order.interface';

const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNo: {
      type: String,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contact: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    division: {
      type: String,
      required: [true, 'Division is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    upazilla: {
      type: String,
      required: [true, 'Upazilla is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    orderNote: {
      type: String,
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
    orderItems: {
      type: [OrderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: function (items: any[]) {
          return items.length > 0;
        },
        message: 'At least one order item is required',
      },
    },
    status: {
      type: String,
      enum: {
        values: [
          'pending',
          'confirmed',
          'shipped',
          'cancelled',
        ] as TOrderStatus[],
        message: '{VALUE} is not a valid order status',
      },
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['paid', 'unpaid'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'unpaid',
    },
    shippingCost: {
      type: Number,
      required: [true, 'Shipping cost is required'],
      min: [0, 'Shipping cost cannot be negative'],
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model<IOrder>('Order', OrderSchema);
