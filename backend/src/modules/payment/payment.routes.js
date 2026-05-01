import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate.middleware.js';
import * as PaymentController from './payment.controller.js';

const router = Router();

const addressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(7).max(20),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(3).max(12),
  country: z.string().length(2).optional(),
});

const createOrderSchema = z.object({
  shippingAddress: addressSchema,
});

const verifySchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

router.post('/create-order', validate(createOrderSchema), PaymentController.createOrder);
router.post('/verify', validate(verifySchema), PaymentController.verifyPayment);
router.post('/webhook', PaymentController.webhook);

export default router;
