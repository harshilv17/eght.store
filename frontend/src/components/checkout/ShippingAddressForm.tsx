"use client";

import { Input } from "@/components/ui/Input";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ShippingAddressErrors {
  fullName?: string;
  phone?: string;
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface ShippingAddressFormProps {
  value: ShippingAddress;
  onChange: (value: ShippingAddress) => void;
  errors: ShippingAddressErrors;
}

export function ShippingAddressForm({ value, onChange, errors }: ShippingAddressFormProps) {
  function set(field: keyof ShippingAddress, v: string) {
    onChange({ ...value, [field]: v });
  }

  return (
    <section>
      <h2 className="text-headline-md font-bold tracking-tight mb-4">Shipping</h2>

      <div className="flex flex-col gap-4">
        <Input
          label="Full name"
          placeholder="Jane Doe"
          value={value.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          error={errors.fullName}
          autoComplete="name"
          required
        />

        <Input
          label="Phone"
          type="tel"
          placeholder="+91 98765 43210"
          value={value.phone}
          onChange={(e) => set("phone", e.target.value)}
          error={errors.phone}
          autoComplete="tel"
          required
        />

        <Input
          label="Address"
          placeholder="House / flat no., street name"
          value={value.line1}
          onChange={(e) => set("line1", e.target.value)}
          error={errors.line1}
          autoComplete="address-line1"
          required
        />

        <Input
          label="Apartment, suite, etc. (optional)"
          placeholder="Apartment, suite, etc."
          value={value.line2}
          onChange={(e) => set("line2", e.target.value)}
          autoComplete="address-line2"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            placeholder="Mumbai"
            value={value.city}
            onChange={(e) => set("city", e.target.value)}
            error={errors.city}
            autoComplete="address-level2"
            required
          />

          <Input
            label="State"
            placeholder="Maharashtra"
            value={value.state}
            onChange={(e) => set("state", e.target.value)}
            error={errors.state}
            autoComplete="address-level1"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Pincode"
            placeholder="400001"
            value={value.pincode}
            onChange={(e) => set("pincode", e.target.value)}
            error={errors.pincode}
            autoComplete="postal-code"
            inputMode="numeric"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
              Country
            </label>
            <div className="w-full px-4 py-3 border border-[var(--color-outline-variant)] text-body-md text-[var(--color-on-surface)] bg-[var(--color-surface-container-lowest)]">
              India
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
