import { EventEmitter } from 'events';

/**
 * The pub-sub bus — the heart of live updates.
 *
 * Anything in the backend can PUBLISH an event (e.g. "stock.updated"),
 * and anything can SUBSCRIBE to a topic. The SSE endpoint subscribes and
 * forwards events to every connected browser (the storefront AND the
 * admin app), so all screens stay in sync in real time.
 *
 * Topics in use:
 *   stock.updated  ->  [{ id, stock }]
 *   order.paid     ->  { orderId, amount }
 *
 * If you later run multiple server instances, swap this EventEmitter for
 * Redis Pub/Sub — the publish/subscribe function signatures stay the same.
 */

const bus = new EventEmitter();
bus.setMaxListeners(200); // one listener per connected browser

export function publish(topic, data) {
  bus.emit(topic, data);
}

/** Returns an unsubscribe function — call it when the client disconnects. */
export function subscribe(topic, handler) {
  bus.on(topic, handler);
  return () => bus.off(topic, handler);
}
