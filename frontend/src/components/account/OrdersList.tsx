"use client";

import Link from "next/link";
import { OrderSummary } from "@/types/order";
import { formatCurrency } from "@/lib/format";
import { formatDate, formatOrderId } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]",
  paid: "bg-[var(--color-primary)] text-[var(--color-on-primary)]",
  shipped: "bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)]",
  delivered: "bg-[var(--color-primary)] text-[var(--color-on-primary)]",
  cancelled: "bg-[var(--color-error)] text-[var(--color-on-error)]",
};

interface OrdersListProps {
  orders: OrderSummary[];
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
          No orders yet
        </p>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mt-2">
          Your order history will appear here.
        </p>
        <Link
          href="/collections"
          className="inline-block mt-6 text-label-caps font-bold uppercase tracking-widest border-b border-[var(--color-primary)] pb-0.5 hover:text-[var(--color-on-tertiary-container)] hover:border-[var(--color-on-tertiary-container)] transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-[var(--color-outline-variant)]">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="flex items-center justify-between py-5 gap-4 hover:bg-[var(--color-surface-container)] -mx-4 px-4 transition-colors"
        >
          <div className="flex flex-col gap-1">
            <p className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface)]">
              {formatOrderId(order.id)}
            </p>
            <p className="text-body-md text-[var(--color-on-surface-variant)]">
              {formatDate(order.created_at)} · {order.item_count} item{Number(order.item_count) !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span
              className={`text-label-caps font-bold uppercase tracking-widest px-2 py-1 ${
                STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
              }`}
            >
              {order.status}
            </span>
            <p className="text-body-md font-bold text-[var(--color-on-surface)]">
              {formatCurrency(parseFloat(order.total_amount))}
            </p>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-on-surface-variant)]">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
