export interface RawCartItem {
  id: string;
  quantity: number;
  variant_id: string;
  size: string;
  color: string;
  sku: string;
  stock_qty: number;
  product_id: string;
  name: string;
  slug: string;
  price: string;
  images: string[] | null;
}

export interface CartApiResponse {
  cartId: string;
  items: RawCartItem[];
  subtotal: string;
  itemCount: number;
}

export interface CartTotals {
  country: string;
  currency: string;
  taxLabel: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  subtotalInr: number;
  shippingInr: number;
  taxInr: number;
  totalInr: number;
}
