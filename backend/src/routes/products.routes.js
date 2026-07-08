import { Router } from 'express';
import { listProducts, getProduct, updateStock } from '../controllers/products.controller.js';
import { adminAuth } from '../middleware/auth.js';

const router = Router();
router.get('/', listProducts);
router.get('/:id', getProduct);
router.patch('/:id/stock', adminAuth, updateStock);
export default router;
