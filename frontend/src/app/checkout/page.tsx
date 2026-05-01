"use client";

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";
import { paymentApi } from "@/lib/api";
import { ContactSection } from "@/components/checkout/ContactSection";
import { ShippingAddressForm, ShippingAddress, ShippingAddressErrors } from "@/components/checkout/ShippingAddressForm";
import { ShippingMethodSelect, ShippingMethod } from "@/components/checkout/ShippingMethodSelect";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/Button";
import { RazorpayResponse } from "@/lib/razorpay";

const RazorpayLauncher = lazy(() =>
  import("@/components/checkout/RazorpayLauncher").then((m) => ({
    default: m.RazorpayLauncher,
  }))
);

interface CreateOrderResult {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

const SHIPPING_PRICES: Record<ShippingMethod, number> = {
  standard: 0,
  express: 250,
};

const EMPTY_ADDRESS: ShippingAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "IN",
};

function validateAddress(addr: ShippingAddress): ShippingAddressErrors {
  const errors: ShippingAddressErrors = {};
  if (!addr.fullName.trim()) errors.fullName = "Required";
  if (!addr.phone.trim()) errors.phone = "Required";
  else if (!/^\+?[\d\s\-]{7,15}$/.test(addr.phone.trim())) errors.phone = "Enter a valid phone number";
  if (!addr.line1.trim()) errors.line1 = "Required";
  if (!addr.city.trim()) errors.city = "Required";
  if (!addr.state.trim()) errors.state = "Required";
  if (!addr.pincode.trim()) errors.pincode = "Required";
  else if (!/^\d{6}$/.test(addr.pincode.trim())) errors.pincode = "Enter a 6-digit pincode";
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCartStore();
  const { user, isBootstrapping } = useAuthStore();
  const addToast = useUiStore((s) => s.addToast);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [addressErrors, setAddressErrors] = useState<ShippingAddressErrors>({});
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<(CreateOrderResult & { orderId: string }) | null>(null);

  useEffect(() => {
    if (!isBootstrapping && items.length === 0) {
      router.replace("/");
    }
  }, [isBootstrapping, items.length, router]);

  const effectiveEmail = user?.email ?? email;
  const effectiveName = user ? `${user.firstName} ${user.lastName}` : address.fullName;

  const validate = useCallback((): boolean => {
    let ok = true;

    if (!user) {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError("Enter a valid email address");
        ok = false;
      } else {
        setEmailError(undefined);
      }
    }

    const errs = validateAddress(address);
    setAddressErrors(errs);
    if (Object.keys(errs).length > 0) ok = false;

    return ok;
  }, [user, email, address]);

  async function handlePayClick() {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await paymentApi.createOrder({
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: address.country,
        },
      }) as CreateOrderResult;

      setPendingOrder(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initiate payment";
      addToast({ tone: "error", title: "Payment failed", description: msg });
      setIsSubmitting(false);
    }
  }

  async function handlePaymentSuccess(response: RazorpayResponse) {
    try {
      await paymentApi.verify({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });
      clear();
      router.push(`/checkout/confirmation/${pendingOrder!.orderId}`);
    } catch {
      addToast({
        tone: "error",
        title: "Verification failed",
        description: "Payment received but verification failed. Contact support.",
      });
      setIsSubmitting(false);
      setPendingOrder(null);
    }
  }

  function handleDismiss() {
    setIsSubmitting(false);
    setPendingOrder(null);
  }

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--color-outline-variant)] border-t-[var(--color-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  const shippingPrice = SHIPPING_PRICES[shippingMethod];

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10">
      <h1 className="sr-only">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-20">
        {/* Left — form */}
        <div className="flex flex-col gap-10">
          <ContactSection
            user={user}
            email={email}
            onChange={setEmail}
            error={emailError}
          />

          <ShippingAddressForm
            value={address}
            onChange={setAddress}
            errors={addressErrors}
          />

          <ShippingMethodSelect value={shippingMethod} onChange={setShippingMethod} />

          <section>
            <h2 className="text-headline-md font-bold tracking-tight mb-4">Payment</h2>
            <p className="text-body-md text-[var(--color-on-surface-variant)] mb-6">
              All transactions are secure and encrypted. Payment is processed via Razorpay.
            </p>
            <Button
              fullWidth
              loading={isSubmitting}
              onClick={handlePayClick}
              disabled={items.length === 0}
            >
              Pay now — {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(subtotal + shippingPrice)}
            </Button>
          </section>
        </div>

        {/* Right — order summary */}
        <aside className="lg:sticky lg:top-8 h-fit bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] p-6 md:p-8">
          <h2 className="text-label-caps font-bold uppercase tracking-widest mb-6">Order summary</h2>
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingPrice={shippingPrice}
          />
        </aside>
      </div>

      {pendingOrder && (
        <Suspense fallback={null}>
          <RazorpayLauncher
            orderId={pendingOrder.orderId}
            razorpayOrderId={pendingOrder.razorpayOrderId}
            keyId={pendingOrder.keyId}
            amount={pendingOrder.amount}
            prefill={{
              name: effectiveName,
              email: effectiveEmail,
              contact: address.phone,
            }}
            onSuccess={handlePaymentSuccess}
            onDismiss={handleDismiss}
          />
        </Suspense>
      )}
    </div>
  );
}
