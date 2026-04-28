import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../../config/env.js';
import { AppError } from '../../middlewares/error.middleware.js';
import * as CartModel from '../cart/cart.model.js';
import * as OrderModel from '../order/order.model.js';

const razorpay = new Razorpay({
  key_id: env.razorpay.keyId,
  key_secret: env.razorpay.keySecret,
});

export async function createPaymentOrder({ userId, sessionId, shippingAddress }) {
  const cartId = await CartModel.findOrCreateCart(userId, sessionId);
  const items = await CartModel.getCartWithItems(cartId);

  if (items.length === 0) throw new AppError('Cart is empty', 400);

  const totalAmount = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const amountInPaise = Math.round(totalAmount * 100);

  const rzpOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: `eght_${Date.now()}`,
  });

  const orderItems = items.map(i => ({
    variantId: i.variant_id,
    productName: i.name,
    size: i.size,
    sku: i.sku,
    quantity: i.quantity,
    unitPrice: i.price,
  }));

  const order = await OrderModel.createOrder({
    userId,
    totalAmount,
    shippingAddress,
    items: orderItems,
  });

  await OrderModel.updateOrderPayment(order.id, {
    razorpayOrderId: rzpOrder.id,
    razorpayPaymentId: null,
    status: 'pending',
  });

  await CartModel.clearCart(cartId);

  return {
    orderId: order.id,
    razorpayOrderId: rzpOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    keyId: env.razorpay.keyId,
  };
}

export async function verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new AppError('Payment verification failed', 400);
  }

  const order = await OrderModel.findOrderByRazorpayId(razorpayOrderId);
  if (!order) throw new AppError('Order not found', 404);

  const updated = await OrderModel.updateOrderPayment(order.id, {
    razorpayOrderId,
    razorpayPaymentId,
    status: 'paid',
  });

  return updated;
}

export async function handleWebhook(body, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(JSON.stringify(body))
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new AppError('Invalid webhook signature', 400);
  }

  const { event, payload } = body;
  if (event === 'payment.captured') {
    const { order_id, id: paymentId } = payload.payment.entity;
    const order = await OrderModel.findOrderByRazorpayId(order_id);
    if (order && order.status !== 'paid') {
      await OrderModel.updateOrderPayment(order.id, {
        razorpayOrderId: order_id,
        razorpayPaymentId: paymentId,
        status: 'paid',
      });
    }
  }
}
