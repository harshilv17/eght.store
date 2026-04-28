"use client";

import Link from "next/link";
import { Order } from "@/types/order";
import { formatCurrency, formatDate, formatOrderId } from "@/lib/format";

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
  const addr = order.shipping_address;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-label-caps text-[var(--color-on-surface-variant)] uppercase tracking-widest">
            Order {formatOrderId(order.id)}
          </p>
          <p className="text-body-md text-[var(--color-on-surface-variant)] mt-1">
            Placed {formatDate(order.created_at)}
          </p>
        </div>
        <span className="text-label-caps font-bold uppercase tracking-widest px-3 py-1.5 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)]">
          {order.status}
        </span>
      </div>

      {/* Items */}
      <section>
        <h2 className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface)] mb-4">
          Items
        </h2>
        <div className="flex flex-col divide-y divide-[var(--color-outline-variant)]">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4 gap-4">
              <div className="flex flex-col gap-0.5">
                <p className="text-body-md font-bold text-[var(--color-on-surface)]">
                  {item.product_name}
                </p>
                <p className="text-body-md text-[var(--color-on-surface-variant)]">
                  Size: {item.size} · SKU: {item.sku}
                </p>
                <p className="text-body-md text-[var(--color-on-surface-variant)]">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="text-body-md font-bold text-[var(--color-on-surface)] shrink-0">
                {formatCurrency(parseFloat(item.unit_price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Total */}
      <div className="flex items-center justify-between border-t border-[var(--color-outline-variant)] pt-4">
        <span className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
          Total
        </span>
        <span className="text-body-lg font-bold text-[var(--color-on-surface)]">
          {formatCurrency(parseFloat(order.total_amount))}
        </span>
      </div>

      {/* Shipping address */}
      {addr && (
        <section>
          <h2 className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface)] mb-3">
            Shipped To
          </h2>
          <div className="text-body-md text-[var(--color-on-surface-variant)] flex flex-col gap-0.5">
            <p className="font-bold text-[var(--color-on-surface)]">{addr.fullName}</p>
            <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
            <p>{addr.city}, {addr.state} – {addr.pincode}</p>
            <p>{addr.phone}</p>
          </div>
        </section>
      )}

      <Link
        href="/account/orders"
        className="self-start text-label-caps font-bold uppercase tracking-widest border-b border-[var(--color-primary)] pb-0.5 hover:text-[var(--color-on-tertiary-container)] hover:border-[var(--color-on-tertiary-container)] transition-colors"
      >
        Back to Orders
      </Link>
    </div>
  );
}
