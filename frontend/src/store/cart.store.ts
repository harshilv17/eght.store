import { create } from "zustand";

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  slug: string;
  size: string;
  color?: string;
  sku: string;
  price: number;
  quantity: number;
  images: string[];
  stockQty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  isLoading: boolean;
  open: () => void;
  close: () => void;
  setItems: (items: CartItem[], subtotal: number) => void;
  addItemOptimistic: (item: CartItem) => void;
  removeItemOptimistic: (variantId: string) => void;
  updateQtyOptimistic: (variantId: string, quantity: number) => void;
  clear: () => void;
  setLoading: (v: boolean) => void;
}

function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  subtotal: 0,
  isLoading: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  setItems: (items, subtotal) => set({ items, subtotal }),

  addItemOptimistic: (item) => {
    const items = [...get().items];
    const existing = items.findIndex((i) => i.variantId === item.variantId);
    if (existing >= 0) {
      items[existing] = { ...items[existing], quantity: items[existing].quantity + item.quantity };
    } else {
      items.push(item);
    }
    set({ items, subtotal: calcSubtotal(items) });
  },

  removeItemOptimistic: (variantId) => {
    const items = get().items.filter((i) => i.variantId !== variantId);
    set({ items, subtotal: calcSubtotal(items) });
  },

  updateQtyOptimistic: (variantId, quantity) => {
    const items = quantity === 0
      ? get().items.filter((i) => i.variantId !== variantId)
      : get().items.map((i) => i.variantId === variantId ? { ...i, quantity } : i);
    set({ items, subtotal: calcSubtotal(items) });
  },

  clear: () => set({ items: [], subtotal: 0 }),
  setLoading: (v) => set({ isLoading: v }),
}));
