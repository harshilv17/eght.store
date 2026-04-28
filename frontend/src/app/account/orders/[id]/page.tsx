"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/account/AuthGuard";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { OrderDetail } from "@/components/account/OrderDetail";
import { orderApi } from "@/lib/api";
import { Order } from "@/types/order";

function OrderDetailContent() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    orderApi
      .get(id)
      .then(setOrder)
      .catch(() => setError("Order not found."));
  }, [id]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-10 py-16 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        <AccountSidebar />
        <div className="flex-1">
          {error ? (
            <p className="text-body-md text-[var(--color-error)]">{error}</p>
          ) : order === null ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-[var(--color-outline-variant)] border-t-[var(--color-primary)] rounded-full animate-spin" />
            </div>
          ) : (
            <OrderDetail order={order} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <AuthGuard>
      <OrderDetailContent />
    </AuthGuard>
  );
}
