"use client";

import Link from "next/link";
import { Order } from "@/types/order";
import { formatCurrency, formatDate, formatOrderId } from "@/lib/format";

interface OrderDetailProps {
  order: Order;
}

function snapshotFx(order: Order): { currency: string; rate: number } {
  const inrTotal = parseFloat(order.total_amount);
  const dispTotal = order.display_total != null ? parseFloat(String(order.display_total)) : inrTotal;
  const rate = inrTotal > 0 ? dispTotal / inrTotal : 1;
  return { currency: order.display_currency || "INR", rate };
}

export function OrderDetail({ order }: OrderDetailProps) {
  const addr = order.shipping_address;
  const { currency, rate } = snapshotFx(order);
  const fmt = (inr: number) =>
    formatCurrency(Math.round(inr * rate * 100) / 100, currency);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-label-caps text-[var(--color-on-surface-variant)] uppercase tracking-widest">
            Order {formatOrderId(order.id)}
          </h1>
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
                {fmt(parseFloat(item.unit_price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Totals */}
      <div className="flex flex-col gap-2 border-t border-[var(--color-outline-variant)] pt-4">
        {order.display_breakdown && (
          <>
            <Row label="Subtotal" value={formatCurrency(order.display_breakdown.subtotal, currency)} />
            <Row
              label="Shipping"
              value={
                order.display_breakdown.shipping === 0
                  ? "FREE"
                  : formatCurrency(order.display_breakdown.shipping, currency)
              }
            />
            <Row
              label={order.display_breakdown.taxLabel || "Tax"}
              value={formatCurrency(order.display_breakdown.tax, currency)}
            />
          </>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
            Total
          </span>
          <span className="text-body-lg font-bold text-[var(--color-on-surface)]">
            {order.display_total != null
              ? formatCurrency(parseFloat(String(order.display_total)), currency)
              : formatCurrency(parseFloat(order.total_amount), "INR")}
          </span>
        </div>
        {currency !== "INR" && (
          <p className="text-body-md text-[var(--color-on-surface-variant)] text-right">
            Charged ₹{parseFloat(order.total_amount).toFixed(2)} INR
          </p>
        )}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-body-md">
      <span className="text-[var(--color-on-surface-variant)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
