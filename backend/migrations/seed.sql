-- Seed data for EGHT Studios

-- Enable uuid extension if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Outerwear', 'outerwear', 'Structured coats and jackets built for form and function.'),
  ('a1000000-0000-0000-0000-000000000002', 'Tops', 'tops', 'Premium tees, long-sleeves, and layering pieces.'),
  ('a1000000-0000-0000-0000-000000000003', 'Bottoms', 'bottoms', 'Trousers, shorts, and utility cuts.')
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (id, name, slug, description, price, compare_price, images, category_id, tags) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Void Coach Jacket',
    'void-coach-jacket',
    'Water-resistant shell with bonded lining. Dropped shoulders, utility pockets, press-stud placket. A foundation piece.',
    12500.00,
    15000.00,
    ARRAY['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
    'a1000000-0000-0000-0000-000000000001',
    ARRAY['new', 'featured']
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'Silhouette Overcoat',
    'silhouette-overcoat',
    'Longline wool-blend overcoat. Clean seams, no external stitching. Statement outerwear.',
    18900.00,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800'],
    'a1000000-0000-0000-0000-000000000001',
    ARRAY['limited']
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Structure Tee',
    'structure-tee',
    '280gsm heavyweight cotton. Boxy fit, raw hem, minimal branding. The essential layer.',
    3200.00,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'],
    'a1000000-0000-0000-0000-000000000002',
    ARRAY['new']
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'Seam Long Sleeve',
    'seam-long-sleeve',
    'Flatlock seam construction on 260gsm cotton-modal blend. Relaxed fit.',
    4100.00,
    4800.00,
    ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'],
    'a1000000-0000-0000-0000-000000000002',
    ARRAY[]::TEXT[]
  ),
  (
    'b1000000-0000-0000-0000-000000000005',
    'Utility Cargo Pant',
    'utility-cargo-pant',
    'Six-pocket cargo silhouette in ripstop cotton. Tapered leg, adjustable ankle tabs.',
    7800.00,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800'],
    'a1000000-0000-0000-0000-000000000003',
    ARRAY['new', 'limited']
  ),
  (
    'b1000000-0000-0000-0000-000000000006',
    'Wide Leg Trouser',
    'wide-leg-trouser',
    'Pressed crease, wide leg opening. Wool-poly blend. Dressed down or up.',
    6500.00,
    NULL,
    ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4b4cb5?w=800'],
    'a1000000-0000-0000-0000-000000000003',
    ARRAY[]::TEXT[]
  )
ON CONFLICT (slug) DO NOTHING;

-- Variants for Void Coach Jacket (b1000000-...-001)
INSERT INTO product_variants (product_id, size, color, sku, stock_qty) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'S',  'Black', 'VCJ-BLK-S',  10),
  ('b1000000-0000-0000-0000-000000000001', 'M',  'Black', 'VCJ-BLK-M',  8),
  ('b1000000-0000-0000-0000-000000000001', 'L',  'Black', 'VCJ-BLK-L',  5),
  ('b1000000-0000-0000-0000-000000000001', 'XL', 'Black', 'VCJ-BLK-XL', 3),
  ('b1000000-0000-0000-0000-000000000001', 'S',  'Olive', 'VCJ-OLV-S',  4),
  ('b1000000-0000-0000-0000-000000000001', 'M',  'Olive', 'VCJ-OLV-M',  6),
  ('b1000000-0000-0000-0000-000000000001', 'L',  'Olive', 'VCJ-OLV-L',  0),
  ('b1000000-0000-0000-0000-000000000001', 'XL', 'Olive', 'VCJ-OLV-XL', 2)
ON CONFLICT (sku) DO NOTHING;

-- Variants for Silhouette Overcoat (b1000000-...-002)
INSERT INTO product_variants (product_id, size, color, sku, stock_qty) VALUES
  ('b1000000-0000-0000-0000-000000000002', 'S',  'Black', 'SOC-BLK-S',  2),
  ('b1000000-0000-0000-0000-000000000002', 'M',  'Black', 'SOC-BLK-M',  3),
  ('b1000000-0000-0000-0000-000000000002', 'L',  'Black', 'SOC-BLK-L',  1),
  ('b1000000-0000-0000-0000-000000000002', 'XL', 'Black', 'SOC-BLK-XL', 0)
ON CONFLICT (sku) DO NOTHING;

-- Variants for Structure Tee (b1000000-...-003)
INSERT INTO product_variants (product_id, size, color, sku, stock_qty) VALUES
  ('b1000000-0000-0000-0000-000000000003', 'S',  'Black', 'STT-BLK-S',  15),
  ('b1000000-0000-0000-0000-000000000003', 'M',  'Black', 'STT-BLK-M',  20),
  ('b1000000-0000-0000-0000-000000000003', 'L',  'Black', 'STT-BLK-L',  18),
  ('b1000000-0000-0000-0000-000000000003', 'XL', 'Black', 'STT-BLK-XL', 10),
  ('b1000000-0000-0000-0000-000000000003', 'S',  'White', 'STT-WHT-S',  12),
  ('b1000000-0000-0000-0000-000000000003', 'M',  'White', 'STT-WHT-M',  15),
  ('b1000000-0000-0000-0000-000000000003', 'L',  'White', 'STT-WHT-L',  8),
  ('b1000000-0000-0000-0000-000000000003', 'XL', 'White', 'STT-WHT-XL', 0)
ON CONFLICT (sku) DO NOTHING;

-- Variants for Seam Long Sleeve (b1000000-...-004)
INSERT INTO product_variants (product_id, size, color, sku, stock_qty) VALUES
  ('b1000000-0000-0000-0000-000000000004', 'S',  'Grey',  'SLS-GRY-S',  6),
  ('b1000000-0000-0000-0000-000000000004', 'M',  'Grey',  'SLS-GRY-M',  9),
  ('b1000000-0000-0000-0000-000000000004', 'L',  'Grey',  'SLS-GRY-L',  7),
  ('b1000000-0000-0000-0000-000000000004', 'XL', 'Grey',  'SLS-GRY-XL', 4),
  ('b1000000-0000-0000-0000-000000000004', 'S',  'Black', 'SLS-BLK-S',  5),
  ('b1000000-0000-0000-0000-000000000004', 'M',  'Black', 'SLS-BLK-M',  8),
  ('b1000000-0000-0000-0000-000000000004', 'L',  'Black', 'SLS-BLK-L',  3),
  ('b1000000-0000-0000-0000-000000000004', 'XL', 'Black', 'SLS-BLK-XL', 0)
ON CONFLICT (sku) DO NOTHING;

-- Variants for Utility Cargo Pant (b1000000-...-005)
INSERT INTO product_variants (product_id, size, color, sku, stock_qty) VALUES
  ('b1000000-0000-0000-0000-000000000005', 'S',  'Black', 'UCP-BLK-S',  4),
  ('b1000000-0000-0000-0000-000000000005', 'M',  'Black', 'UCP-BLK-M',  6),
  ('b1000000-0000-0000-0000-000000000005', 'L',  'Black', 'UCP-BLK-L',  3),
  ('b1000000-0000-0000-0000-000000000005', 'XL', 'Black', 'UCP-BLK-XL', 2),
  ('b1000000-0000-0000-0000-000000000005', 'S',  'Olive', 'UCP-OLV-S',  3),
  ('b1000000-0000-0000-0000-000000000005', 'M',  'Olive', 'UCP-OLV-M',  5),
  ('b1000000-0000-0000-0000-000000000005', 'L',  'Olive', 'UCP-OLV-L',  0),
  ('b1000000-0000-0000-0000-000000000005', 'XL', 'Olive', 'UCP-OLV-XL', 1)
ON CONFLICT (sku) DO NOTHING;

-- Variants for Wide Leg Trouser (b1000000-...-006)
INSERT INTO product_variants (product_id, size, color, sku, stock_qty) VALUES
  ('b1000000-0000-0000-0000-000000000006', 'S',  'Black', 'WLT-BLK-S',  5),
  ('b1000000-0000-0000-0000-000000000006', 'M',  'Black', 'WLT-BLK-M',  7),
  ('b1000000-0000-0000-0000-000000000006', 'L',  'Black', 'WLT-BLK-L',  4),
  ('b1000000-0000-0000-0000-000000000006', 'XL', 'Black', 'WLT-BLK-XL', 2),
  ('b1000000-0000-0000-0000-000000000006', 'S',  'Grey',  'WLT-GRY-S',  3),
  ('b1000000-0000-0000-0000-000000000006', 'M',  'Grey',  'WLT-GRY-M',  4),
  ('b1000000-0000-0000-0000-000000000006', 'L',  'Grey',  'WLT-GRY-L',  2),
  ('b1000000-0000-0000-0000-000000000006', 'XL', 'Grey',  'WLT-GRY-XL', 0)
ON CONFLICT (sku) DO NOTHING;
