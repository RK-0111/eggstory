import { asyncHandler } from '../utils/asyncHandler.js';
import * as productsService from '../services/products.service.js';

export const listProducts = asyncHandler(async (req, res) => {
  res.json({ products: productsService.getAllProducts() });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = productsService.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

/** PATCH /api/products/:id/stock — owner updates stock from the admin app. */
export const updateStock = asyncHandler(async (req, res) => {
  const stock = Number.parseInt(req.body.stock, 10);
  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ error: 'stock must be a whole number, 0 or more' });
  }
  const product = productsService.setStock(req.params.id, stock);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});
