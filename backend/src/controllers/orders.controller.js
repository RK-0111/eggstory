import { asyncHandler } from '../utils/asyncHandler.js';
import * as ordersService from '../services/orders.service.js';

export const getOrder = asyncHandler(async (req, res) => {
  const order = ordersService.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

// NOTE: in production protect this route with admin authentication.
export const listOrders = asyncHandler(async (req, res) => {
  res.json({ orders: ordersService.listOrders() });
});
