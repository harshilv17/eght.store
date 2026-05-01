export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  product_name: string;
  size: string;
  sku: string;
  quantity: number;
  unit_price: string;
}

export interface OrderDisplayBreakdown {
  subtotal: number;
  shipping: number;
  tax: number;
  taxLabel: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  shipping_address: Record<string, string>;
  country_code?: string;
  display_currency?: string;
  display_total?: string | number | null;
  display_breakdown?: OrderDisplayBreakdown | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderSummary {
  id: string;
  status: Order['status'];
  total_amount: string;
  created_at: string;
  item_count: string;
  country_code?: string;
  display_currency?: string;
  display_total?: string | number | null;
}
