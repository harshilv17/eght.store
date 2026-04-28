import { CartItem } from "@/store/cart.store";
import { RawCartItem, CartApiResponse } from "@/types/cart";

export function mapCartItem(raw: RawCartItem): CartItem {
  return {
    id: raw.id,
    variantId: raw.variant_id,
    productId: raw.product_id,
    name: raw.name,
    slug: raw.slug,
    size: raw.size,
    color: raw.color,
    sku: raw.sku,
    price: parseFloat(raw.price),
    quantity: raw.quantity,
    images: raw.images ?? [],
    stockQty: raw.stock_qty,
  };
}

export function mapCartResponse(cart: CartApiResponse): {
  items: CartItem[];
  subtotal: number;
} {
  return {
    items: cart.items.map(mapCartItem),
    subtotal: parseFloat(cart.subtotal),
  };
}
