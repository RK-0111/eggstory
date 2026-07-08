import { Router } from 'express';
import { getOrder, listOrders } from '../controllers/orders.controller.js';
import { adminAuth } from '../middleware/auth.js';

const router = Router();
router.use(adminAuth);
router.get('/', listOrders);
router.get('/:id', getOrder);
export default router;
