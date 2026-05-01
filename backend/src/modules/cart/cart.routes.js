import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate.middleware.js';
import * as CartController from './cart.controller.js';

const router = Router();

const addItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
});

const updateItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(0),
});

router.get('/', CartController.getCart);
router.get('/totals', CartController.getTotals);
router.post('/items', validate(addItemSchema), CartController.addItem);
router.put('/items', validate(updateItemSchema), CartController.updateItem);
router.delete('/items/:variantId', CartController.removeItem);

export default router;
