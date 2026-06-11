import { api } from './client.js';

export async function fetchProducts() {
  const { products } = await api.get('/products');
  return products;
}
