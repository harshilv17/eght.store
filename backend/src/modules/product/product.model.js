import { query } from '../../config/db.js';

export async function getProducts({ limit, offset, categorySlug, search }) {
  let sql = `
    SELECT p.id, p.name, p.slug, p.price, p.compare_price, p.images, p.tags,
           c.name AS category_name, c.slug AS category_slug,
           COALESCE(SUM(v.stock_qty), 0) AS total_stock
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_variants v ON v.product_id = p.id
    WHERE p.is_active = true
  `;
  const params = [];

  if (categorySlug) {
    params.push(categorySlug);
    sql += ` AND c.slug = $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    sql += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
  }

  sql += ` GROUP BY p.id, c.name, c.slug ORDER BY p.created_at DESC`;
  params.push(limit, offset);
  sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const { rows } = await query(sql, params);
  return rows;
}

export async function getProductBySlug(slug) {
  const { rows } = await query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug = $1 AND p.is_active = true`,
    [slug]
  );
  if (!rows[0]) return null;

  const { rows: variants } = await query(
    'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY size',
    [rows[0].id]
  );

  return { ...rows[0], variants };
}

export async function createProduct({ name, slug, description, price, comparePrice, images, categoryId, tags }) {
  const { rows } = await query(
    `INSERT INTO products (name, slug, description, price, compare_price, images, category_id, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, slug, description, price, comparePrice, images, categoryId, tags]
  );
  return rows[0];
}

export async function createVariant({ productId, size, color, sku, stockQty }) {
  const { rows } = await query(
    `INSERT INTO product_variants (product_id, size, color, sku, stock_qty)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [productId, size, color, sku, stockQty]
  );
  return rows[0];
}

export async function updateVariantStock(variantId, qty, client) {
  const q = client || { query: (sql, p) => query(sql, p) };
  const { rows } = await q.query(
    `UPDATE product_variants SET stock_qty = stock_qty + $1
     WHERE id = $2 AND stock_qty + $1 >= 0 RETURNING stock_qty`,
    [qty, variantId]
  );
  return rows[0] || null;
}

export async function getCategories() {
  const { rows } = await query('SELECT * FROM categories ORDER BY name');
  return rows;
}

export async function createCategory({ name, slug, description }) {
  const { rows } = await query(
    'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
    [name, slug, description]
  );
  return rows[0];
}
