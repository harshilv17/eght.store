export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  sku: string;
  stock_qty: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price: number | null;
  images: string[] | null;
  tags: string[] | null;
  category_name: string;
  category_slug: string;
  total_stock: number;
}

export interface ProductDetail extends Product {
  description: string | null;
  is_active: boolean;
  created_at: string;
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}
