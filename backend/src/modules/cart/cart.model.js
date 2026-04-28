import { query } from '../../config/db.js';

export async function findOrCreateCart(userId, sessionId) {
  const condition = userId ? 'user_id = $1' : 'session_id = $1';
  const value = userId || sessionId;

  let { rows } = await query(`SELECT id FROM carts WHERE ${condition}`, [value]);

  if (rows[0]) return rows[0].id;

  const result = await query(
    'INSERT INTO carts (user_id, session_id) VALUES ($1, $2) RETURNING id',
    [userId || null, sessionId || null]
  );
  return result.rows[0].id;
}

export async function getCartWithItems(cartId) {
  const { rows } = await query(
    `SELECT ci.id, ci.quantity,
            pv.id AS variant_id, pv.size, pv.color, pv.sku, pv.stock_qty,
            p.id AS product_id, p.name, p.slug, p.price, p.images
     FROM cart_items ci
     JOIN product_variants pv ON pv.id = ci.variant_id
     JOIN products p ON p.id = pv.product_id
     WHERE ci.cart_id = $1 AND p.is_active = true`,
    [cartId]
  );
  return rows;
}

export async function upsertCartItem(cartId, variantId, quantity) {
  await query(
    `INSERT INTO cart_items (cart_id, variant_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (cart_id, variant_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
    [cartId, variantId, quantity]
  );
}

export async function setCartItemQuantity(cartId, variantId, quantity) {
  if (quantity <= 0) {
    await query('DELETE FROM cart_items WHERE cart_id = $1 AND variant_id = $2', [cartId, variantId]);
  } else {
    await query(
      `INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, variant_id) DO UPDATE SET quantity = EXCLUDED.quantity`,
      [cartId, variantId, quantity]
    );
  }
}

export async function removeCartItem(cartId, variantId) {
  await query('DELETE FROM cart_items WHERE cart_id = $1 AND variant_id = $2', [cartId, variantId]);
}

export async function clearCart(cartId) {
  await query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
}

export async function mergeGuestCart(sessionId, userId) {
  const { rows: guestCart } = await query('SELECT id FROM carts WHERE session_id = $1', [sessionId]);
  if (!guestCart[0]) return;

  const guestCartId = guestCart[0].id;
  const userCartId = await findOrCreateCart(userId, null);

  const { rows: items } = await query('SELECT * FROM cart_items WHERE cart_id = $1', [guestCartId]);
  for (const item of items) {
    await setCartItemQuantity(userCartId, item.variant_id, item.quantity);
  }
  await query('DELETE FROM carts WHERE id = $1', [guestCartId]);
}
