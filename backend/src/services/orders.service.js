/**
 * Orders service — keeps a record of orders and their payment status.
 *
 * Currently in-memory (resets when the server restarts). To go to
 * production, replace the Map below with a database table/collection;
 * the function signatures stay the same.
 */

const orders = new Map();

export function saveOrder({ orderId, amount, currency, lineItems, customer }) {
  const order = {
    orderId,
    amount,
    currency,
    lineItems,
    customer: customer || null,
    status: 'created',
    paymentId: null,
    createdAt: new Date().toISOString(),
  };
  orders.set(orderId, order);
  return order;
}

export function markOrderPaid(orderId, paymentId) {
  const order = orders.get(orderId);
  if (!order) return null;
  order.status = 'paid';
  order.paymentId = paymentId;
  order.paidAt = new Date().toISOString();
  return order;
}

export function getOrder(orderId) {
  return orders.get(orderId) || null;
}

export function listOrders() {
  return Array.from(orders.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}
