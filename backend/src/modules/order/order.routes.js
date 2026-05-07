import { Router } from 'express';
import { authenticate, optionalAuth } from '../../middlewares/auth.middleware.js';
import * as OrderModel from './order.model.js';
import { sendSuccess } from '../../utils/helpers.js';
import { AppError } from '../../middlewares/error.middleware.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const orders = await OrderModel.getUserOrders(req.user.sub);
    sendSuccess(res, orders);
  } catch (err) { next(err); }
});

// optionalAuth: authenticated users see only their own order; unauthenticated
// callers (e.g. the server-rendered confirmation page) can read by UUID alone.
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const order = await OrderModel.getOrderById(req.params.id, req.user?.sub ?? null);
    if (!order) throw new AppError('Order not found', 404);
    sendSuccess(res, order);
  } catch (err) { next(err); }
});

export default router;
