"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/account/AuthGuard";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { OrdersList } from "@/components/account/OrdersList";
import { orderApi } from "@/lib/api";
import { OrderSummary } from "@/types/order";

function OrdersContent() {
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    orderApi
      .list()
      .then(setOrders)
      .catch(() => setError("Could not load orders."));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-10 py-16 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="text-headline-md font-bold uppercase tracking-tight text-[var(--color-primary)] mb-8">
            Orders
          </h1>
          {error ? (
            <p className="text-body-md text-[var(--color-error)]">{error}</p>
          ) : orders === null ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-[var(--color-outline-variant)] border-t-[var(--color-primary)] rounded-full animate-spin" />
            </div>
          ) : (
            <OrdersList orders={orders} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}
