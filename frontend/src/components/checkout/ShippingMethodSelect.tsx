"use client";

export type ShippingMethod = "standard" | "express";

interface ShippingMethodSelectProps {
  value: ShippingMethod;
  onChange: (v: ShippingMethod) => void;
}

const METHODS: { id: ShippingMethod; label: string; description: string; price: string }[] = [
  {
    id: "standard",
    label: "Standard",
    description: "5–7 business days",
    price: "FREE",
  },
  {
    id: "express",
    label: "Express",
    description: "2–3 business days",
    price: "₹250",
  },
];

export function ShippingMethodSelect({ value, onChange }: ShippingMethodSelectProps) {
  return (
    <section>
      <h2 className="text-headline-md font-bold tracking-tight mb-4">Shipping method</h2>

      <div className="flex flex-col border border-[var(--color-outline-variant)]">
        {METHODS.map((method, idx) => (
          <label
            key={method.id}
            className={`flex items-center justify-between px-4 py-4 cursor-pointer transition-colors ${
              value === method.id
                ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                : "bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]"
            } ${idx > 0 ? "border-t border-[var(--color-outline-variant)]" : ""}`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={value === method.id}
                onChange={() => onChange(method.id)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  value === method.id
                    ? "border-[var(--color-on-primary)]"
                    : "border-[var(--color-outline)]"
                }`}
              >
                {value === method.id && (
                  <div className="w-2 h-2 rounded-full bg-[var(--color-on-primary)]" />
                )}
              </div>
              <div>
                <p className="text-label-caps font-bold uppercase tracking-widest">{method.label}</p>
                <p className={`text-body-md ${value === method.id ? "text-[var(--color-on-primary)]/70" : "text-[var(--color-on-surface-variant)]"}`}>
                  {method.description}
                </p>
              </div>
            </div>
            <span className="text-label-caps font-bold">{method.price}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
