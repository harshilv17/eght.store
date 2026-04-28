import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate, requireAdmin } from '../../middlewares/auth.middleware.js';
import * as ProductController from './product.controller.js';

const router = Router();

const productSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  images: z.array(z.string().url()).default([]),
  categoryId: z.string().uuid().optional(),
  tags: z.array(z.string()).default([]),
  slug: z.string().optional(),
});

const variantSchema = z.object({
  size: z.string().min(1).max(20),
  color: z.string().max(50).optional(),
  sku: z.string().min(1).max(100),
  stockQty: z.number().int().min(0).default(0),
});

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().optional(),
  description: z.string().optional(),
});

router.get('/', ProductController.listProducts);
router.get('/categories', ProductController.listCategories);
router.get('/:slug', ProductController.getProduct);

router.post('/', authenticate, requireAdmin, validate(productSchema), ProductController.createProduct);
router.post('/:productId/variants', authenticate, requireAdmin, validate(variantSchema), ProductController.createVariant);
router.post('/categories', authenticate, requireAdmin, validate(categorySchema), ProductController.createCategory);

export default router;
