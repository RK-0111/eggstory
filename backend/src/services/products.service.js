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

/** Owner sets an absolute egg count from the admin app. */
export function setStock(id, stock) {
  const product = getProductById(id);
  if (!product) return null;
  const matchingProducts = products.filter((p) => p.category === product.category);
  for (const item of matchingProducts) item.stock = stock;
  publish('stock.updated', matchingProducts.map((item) => ({ id: item.id, stock: item.stock })));
  return product;
}

/** Called after a successful payment. Publishes one event for all items. */
export function reduceStockBulk(items) {
  const changes = [];
  const eggsByCategory = new Map();

  for (const { productId, quantity } of items) {
    const product = getProductById(productId);
    if (!product) continue;
    const eggs = product.packSize * quantity;
    eggsByCategory.set(product.category, (eggsByCategory.get(product.category) || 0) + eggs);
  }

  for (const [category, eggs] of eggsByCategory) {
    for (const product of products.filter((p) => p.category === category)) {
      product.stock = Math.max(0, product.stock - eggs);
      changes.push({ id: product.id, stock: product.stock });
    }
  }

  if (changes.length) publish('stock.updated', changes);
}

/** Snapshot of all stock levels, sent to every client when it connects. */
export function getStockSnapshot() {
  return products.map((p) => ({ id: p.id, stock: p.stock }));
}
