import { AppError } from '../../middlewares/error.middleware.js';
import { query } from '../../config/db.js';
import * as CartModel from './cart.model.js';
import { computeTotals } from '../../utils/pricing.js';

export async function getCart(userId, sessionId) {
  if (userId && sessionId) {
    await CartModel.mergeGuestCart(sessionId, userId);
  }
  const cartId = await CartModel.findOrCreateCart(userId, sessionId);
  const items = await CartModel.getCartWithItems(cartId);

  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  return { cartId, items, subtotal: subtotal.toFixed(2), itemCount: items.length };
}

export async function getCartTotals(userId, sessionId, country) {
  const cartId = await CartModel.findOrCreateCart(userId, sessionId);
  const items = await CartModel.getCartWithItems(cartId);
  const subtotalInr = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  return computeTotals({ subtotalInr, country });
}

export async function addItem(userId, sessionId, variantId, quantity = 1) {
  const { rows } = await query(
    'SELECT stock_qty FROM product_variants WHERE id = $1',
    [variantId]
  );
  if (!rows[0]) throw new AppError('Variant not found', 404);

  const cartId = await CartModel.findOrCreateCart(userId, sessionId);
  const { rows: existing } = await query(
    'SELECT quantity FROM cart_items WHERE cart_id = $1 AND variant_id = $2',
    [cartId, variantId]
  );
  const currentQty = existing[0]?.quantity || 0;

  if (currentQty + quantity > rows[0].stock_qty) {
    throw new AppError(`Only ${rows[0].stock_qty} units available`, 400);
  }

  await CartModel.upsertCartItem(cartId, variantId, quantity);
  return CartModel.getCartWithItems(cartId);
}

export async function updateItem(userId, sessionId, variantId, quantity) {
  const cartId = await CartModel.findOrCreateCart(userId, sessionId);
  await CartModel.setCartItemQuantity(cartId, variantId, quantity);
  return CartModel.getCartWithItems(cartId);
}

export async function removeItem(userId, sessionId, variantId) {
  const cartId = await CartModel.findOrCreateCart(userId, sessionId);
  await CartModel.removeCartItem(cartId, variantId);
  return CartModel.getCartWithItems(cartId);
}
