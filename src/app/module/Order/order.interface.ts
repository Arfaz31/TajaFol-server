// order.interface.ts
import { Types } from 'mongoose';

export type TShippingOrder = {
  productId: Types.ObjectId;
  quantity: number;
  price: number; // To store the product price at time of purchase
  name: string; // To store product name
};

export type TOrderStatus = 'pending' | 'shipped' | 'cancelled';

export interface IOrder {
  orderNo: string;
  userId?: Types.ObjectId;
  name: string;
  email?: string;
  contact: string;
  division: string;
  district: string;
  upazilla: string;
  address: string;
  orderNote?: string;
  totalPrice: number;
  orderItems: TShippingOrder[];
  status: TOrderStatus;
  paymentStatus: 'paid' | 'unpaid';
  shippingCost: number;
}
