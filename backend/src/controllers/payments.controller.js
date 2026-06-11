import { asyncHandler } from '../utils/asyncHandler.js';
import * as paymentsService from '../services/payments.service.js';
import * as ordersService from '../services/orders.service.js';
import * as productsService from '../services/products.service.js';
import { publish } from '../events/bus.js';

/**
 * POST /api/payments/create-order
 * Body: { items: [{ productId, quantity }], customer: { name, email, phone } }
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { items, customer } = req.body;
  const order = await paymentsService.createPaymentOrder(items);
  ordersService.saveOrder({ ...order, customer });
  res.status(201).json(order);
});

/**
 * POST /api/payments/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = req.body;

  const valid = paymentsService.verifyPaymentSignature({ orderId, paymentId, signature });
  if (!valid) {
    return res.status(400).json({ verified: false, error: 'Invalid payment signature' });
  }

  const order = ordersService.markOrderPaid(orderId, paymentId);
  if (order) {
    // Pub-sub: stock drops are broadcast to every open browser instantly
    productsService.reduceStockBulk(order.lineItems);
    publish('order.paid', { orderId: order.orderId, amount: order.amount });
  }
  res.json({ verified: true, order });
});
