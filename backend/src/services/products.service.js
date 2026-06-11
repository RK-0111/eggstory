import { products } from '../data/products.js';
import { publish } from '../events/bus.js';

/**
 * Products service.
 * Swap the data source here (e.g. MongoDB, Postgres) without touching
 * controllers or routes. Every stock change publishes a "stock.updated"
 * event so all connected browsers update live.
 */

export function getAllProducts() {
  return products;
}

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

/** Owner sets an absolute stock number from the admin app. */
export function setStock(id, stock) {
  const product = getProductById(id);
  if (!product) return null;
  product.stock = stock;
  publish('stock.updated', [{ id: product.id, stock: product.stock }]);
  return product;
}

/** Called after a successful payment. Publishes one event for all items. */
export function reduceStockBulk(items) {
  const changes = [];
  for (const { productId, quantity } of items) {
    const product = getProductById(productId);
    if (!product) continue;
    product.stock = Math.max(0, product.stock - quantity);
    changes.push({ id: product.id, stock: product.stock });
  }
  if (changes.length) publish('stock.updated', changes);
}

/** Snapshot of all stock levels, sent to every client when it connects. */
export function getStockSnapshot() {
  return products.map((p) => ({ id: p.id, stock: p.stock }));
}
