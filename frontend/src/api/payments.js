import { api } from './client.js';

/** Ask the backend to create a Razorpay order for the cart. */
export function createPaymentOrder(items, customer) {
  return api.post('/payments/create-order', { items, customer });
}

/** Ask the backend to verify the payment signature after checkout. */
export function verifyPayment(razorpayResponse) {
  return api.post('/payments/verify', razorpayResponse);
}
