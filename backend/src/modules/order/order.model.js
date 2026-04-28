import { query, getClient } from '../../config/db.js';

export async function createOrder({ userId, totalAmount, shippingAddress, items }) {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, totalAmount, JSON.stringify(shippingAddress)]
    );
    const order = rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, variant_id, product_name, size, sku, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [order.id, item.variantId, item.productName, item.size, item.sku, item.quantity, item.unitPrice]
      );

      const updated = await client.query(
        `UPDATE product_variants SET stock_qty = stock_qty - $1
         WHERE id = $2 AND stock_qty >= $1 RETURNING id`,
        [item.quantity, item.variantId]
      );
      if (updated.rows.length === 0) {
        throw new Error(`Insufficient stock for ${item.productName} (${item.size})`);
      }
    }

    await client.query('COMMIT');
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateOrderPayment(orderId, { razorpayOrderId, razorpayPaymentId, status }) {
  const { rows } = await query(
    `UPDATE orders SET razorpay_order_id = $1, razorpay_payment_id = $2, status = $3, updated_at = NOW()
     WHERE id = $4 RETURNING *`,
    [razorpayOrderId, razorpayPaymentId, status, orderId]
  );
  return rows[0];
}

export async function getOrderById(orderId, userId) {
  const { rows } = await query(
    `SELECT o.*, json_agg(oi.*) AS items
     FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.id = $1 AND ($2::uuid IS NULL OR o.user_id = $2)
     GROUP BY o.id`,
    [orderId, userId || null]
  );
  return rows[0] || null;
}

export async function getUserOrders(userId) {
  const { rows } = await query(
    `SELECT o.id, o.status, o.total_amount, o.created_at,
            COUNT(oi.id) AS item_count
     FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.user_id = $1
     GROUP BY o.id ORDER BY o.created_at DESC`,
    [userId]
  );
  return rows;
}

export async function findOrderByRazorpayId(razorpayOrderId) {
  const { rows } = await query(
    'SELECT * FROM orders WHERE razorpay_order_id = $1',
    [razorpayOrderId]
  );
  return rows[0] || null;
}
