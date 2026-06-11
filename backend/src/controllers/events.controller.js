import { subscribe } from '../events/bus.js';
import { getStockSnapshot } from '../services/products.service.js';

/**
 * GET /api/events — Server-Sent Events stream.
 *
 * The browser opens this once with `new EventSource('/api/events')` and
 * the connection stays open. Every time the backend publishes to the bus,
 * we push the event down the wire. This is the "sub" half of pub-sub.
 */
export function streamEvents(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (event, data) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  // Initial snapshot so a newly opened page is correct immediately
  send('stock', getStockSnapshot());

  const unsubStock = subscribe('stock.updated', (changes) => send('stock', changes));
  const unsubPaid = subscribe('order.paid', (order) => send('order-paid', order));

  // Keep the connection alive through proxies
  const heartbeat = setInterval(() => res.write(': ping\n\n'), 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubStock();
    unsubPaid();
  });
}
