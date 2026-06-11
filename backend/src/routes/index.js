import { Router } from 'express';
import productsRoutes from './products.routes.js';
import paymentsRoutes from './payments.routes.js';
import ordersRoutes from './orders.routes.js';
import eventsRoutes from './events.routes.js';

/**
 * API route registry.
 * To add a new module (e.g. delivery tracking, subscriptions, reviews):
 *   1. create services/<module>.service.js
 *   2. create controllers/<module>.controller.js
 *   3. create routes/<module>.routes.js
 *   4. mount it here with one line.
 */
const router = Router();

router.use('/products', productsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/orders', ordersRoutes);
router.use('/events', eventsRoutes);

router.get('/health', (req, res) => res.json({ status: 'ok' }));

export default router;
