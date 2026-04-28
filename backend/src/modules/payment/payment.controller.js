import * as PaymentService from './payment.service.js';
import { sendSuccess } from '../../utils/helpers.js';

export async function createOrder(req, res, next) {
  try {
    const userId = req.user?.sub || null;
    const sessionId = req.headers['x-session-id'] || null;
    const { shippingAddress } = req.body;

    const result = await PaymentService.createPaymentOrder({ userId, sessionId, shippingAddress });
    sendSuccess(res, result, 201);
  } catch (err) { next(err); }
}

export async function verifyPayment(req, res, next) {
  try {
    const order = await PaymentService.verifyPayment(req.body);
    sendSuccess(res, { order, message: 'Payment verified successfully' });
  } catch (err) { next(err); }
}

export async function webhook(req, res, next) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    await PaymentService.handleWebhook(req.body, signature);
    res.status(200).json({ received: true });
  } catch (err) { next(err); }
}
