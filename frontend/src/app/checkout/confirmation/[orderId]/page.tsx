import { notFound } from "next/navigation";
import Link from "next/link";
import { env } from "@/lib/env";
import { Order } from "@/types/order";
import { OrderDetail } from "@/components/account/OrderDetail";

async function getOrder(id: string): Promise<Order | null> {
  try {
    const res = await fetch(`${env.apiUrl}/orders/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as Order;
  } catch {
    return null;
  }
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) notFound();

  return (
    <div className="max-w-[640px] mx-auto px-6 md:px-10 py-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="w-12 h-12 flex items-center justify-center border-2 border-[var(--color-primary)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-headline-lg font-bold tracking-tight">Order confirmed.</h1>
          <p className="text-body-lg text-[var(--color-on-surface-variant)]">
            Thank you for your purchase. We&apos;ll send a confirmation email shortly.
          </p>
        </div>

        <div className="border border-[var(--color-outline-variant)] p-6 md:p-8 bg-[var(--color-surface-container-lowest)]">
          <OrderDetail order={order} />
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center py-4 px-8 text-label-caps font-bold uppercase tracking-widest bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-surface-tint)] transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
