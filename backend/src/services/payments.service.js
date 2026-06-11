import Razorpay from 'razorpay';
import crypto from 'crypto';
import config from '../config/index.js';
import { getProductById } from './products.service.js';

/**
 * Payments service — everything Razorpay lives here.
 *
 * Flow:
 *  1. createPaymentOrder(items) — recalculates the total from the server-side
 *     catalog (never trusts client prices) and asks Razorpay to create an
 *     order. Returns { orderId, amount, currency, keyId } to the frontend.
 *  2. The frontend opens Razorpay Checkout with that orderId.
 *  3. verifyPaymentSignature(...) — after payment, Razorpay gives the browser
 *     a signature. We recompute it with our secret key; if it matches, the
 *     payment is genuine.
 */

let razorpayInstance = null;

function getRazorpay() {
  if (!razorpayInstance) {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      const err = new Error(
        'Razorpay keys not configured. Add them to backend/.env'
      );
      err.status = 503;
      throw err;
    }
    razorpayInstance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }
  return razorpayInstance;
}

/**
 * @param {Array<{productId: string, quantity: number}>} items
 */
export function calculateOrderAmount(items) {
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error('Cart is empty');
    err.status = 400;
    throw err;
  }

  let totalPaise = 0;
  const lineItems = [];

  for (const item of items) {
    const product = getProductById(item.productId);
    const quantity = Number.parseInt(item.quantity, 10);

    if (!product) {
      const err = new Error(`Unknown product: ${item.productId}`);
      err.status = 400;
      throw err;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      const err = new Error(`Invalid quantity for ${item.productId}`);
      err.status = 400;
      throw err;
    }

    if (typeof product.stock === 'number' && quantity > product.stock) {
      const err = new Error(
        `Only ${product.stock} packs of ${product.name} (${product.packSize}) left in stock`
      );
      err.status = 400;
      throw err;
    }

    totalPaise += product.pricePaise * quantity;
    lineItems.push({
      productId: product.id,
      name: `${product.name} (pack of ${product.packSize})`,
      quantity,
      unitPricePaise: product.pricePaise,
    });
  }

  return { totalPaise, lineItems };
}

export async function createPaymentOrder(items) {
  const { totalPaise, lineItems } = calculateOrderAmount(items);

  const rzpOrder = await getRazorpay().orders.create({
    amount: totalPaise,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
  });

  return {
    orderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    keyId: config.razorpay.keyId,
    lineItems,
  };
}

export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  if (!orderId || !paymentId || !signature) {
    const err = new Error('Missing payment verification fields');
    err.status = 400;
    throw err;
  }

  const expected = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}
