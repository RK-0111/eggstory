import { Router } from 'express';
import { listProducts, getProduct, updateStock } from '../controllers/products.controller.js';

const router = Router();
router.get('/', listProducts);
router.get('/:id', getProduct);
router.patch('/:id/stock', updateStock);
export default router;
