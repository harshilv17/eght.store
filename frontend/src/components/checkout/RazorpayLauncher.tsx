"use client";

import { useEffect, useRef } from "react";
import { loadRazorpayScript, RazorpayResponse } from "@/lib/razorpay";

interface RazorpayLauncherProps {
  orderId: string;
  razorpayOrderId: string;
  keyId: string;
  amount: number;
  prefill: { name: string; email: string; contact: string };
  onSuccess: (response: RazorpayResponse) => void;
  onDismiss: () => void;
}

export function RazorpayLauncher({
  orderId: _orderId,
  razorpayOrderId,
  keyId,
  amount,
  prefill,
  onSuccess,
  onDismiss,
}: RazorpayLauncherProps) {
  const launched = useRef(false);

  useEffect(() => {
    if (launched.current) return;
    launched.current = true;

    loadRazorpayScript().then(() => {
      const rz = new window.Razorpay({
        key: keyId,
        order_id: razorpayOrderId,
        amount,
        currency: "INR",
        name: "EGHT Studios",
        prefill: {
          name: prefill.name,
          email: prefill.email,
          contact: prefill.contact,
        },
        theme: { color: "#000000" },
        handler: onSuccess,
        modal: { ondismiss: onDismiss },
      });
      rz.open();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
