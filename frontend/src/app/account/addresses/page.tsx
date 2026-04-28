"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthGuard } from "@/components/account/AuthGuard";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AddressCard } from "@/components/account/AddressCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { userApi } from "@/lib/api";
import { Address } from "@/types/user";
import { ApiError } from "@/types/api";

const schema = z.object({
  fullName: z.string().min(1, "Required"),
  phone: z.string().min(10, "Min 10 digits").max(15, "Max 15 digits"),
  line1: z.string().min(1, "Required"),
  line2: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  pincode: z.string().regex(/^\d{6}$/, "Must be 6 digits"),
  isDefault: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function AddressesContent() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { isDefault: false } });

  useEffect(() => {
    userApi.getAddresses().then(setAddresses).catch(() => {});
  }, []);

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      const added = await userApi.addAddress(data);
      setAddresses((prev) => [...prev, added]);
      reset();
      setShowForm(false);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Could not save address.");
    }
  }

  async function handleDelete(id: string) {
    await userApi.deleteAddress(id).catch(() => {});
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-10 py-16 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-headline-md font-bold uppercase tracking-tight text-[var(--color-primary)]">
              Addresses
            </h1>
            {!showForm && (
              <Button variant="secondary" onClick={() => setShowForm(true)}>
                Add Address
              </Button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 mb-10 p-6 border border-[var(--color-outline-variant)]">
              <h2 className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface)]">
                New Address
              </h2>

              {serverError && (
                <p role="alert" className="text-body-md text-[var(--color-error)]">{serverError}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input label="Full name" error={errors.fullName?.message} {...register("fullName")} className="col-span-2" />
                <Input label="Phone" type="tel" error={errors.phone?.message} {...register("phone")} />
                <Input label="Pincode" error={errors.pincode?.message} {...register("pincode")} />
              </div>

              <Input label="Address line 1" error={errors.line1?.message} {...register("line1")} />
              <Input label="Address line 2 (optional)" {...register("line2")} />

              <div className="grid grid-cols-2 gap-4">
                <Input label="City" error={errors.city?.message} {...register("city")} />
                <Input label="State" error={errors.state?.message} {...register("state")} />
              </div>

              <label className="flex items-center gap-2 text-body-md text-[var(--color-on-surface-variant)] cursor-pointer">
                <input type="checkbox" {...register("isDefault")} className="accent-[var(--color-primary)]" />
                Set as default address
              </label>

              <div className="flex gap-3 mt-2">
                <Button type="submit" loading={isSubmitting}>Save Address</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); reset(); }}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {addresses.length === 0 && !showForm ? (
            <p className="text-body-md text-[var(--color-on-surface-variant)]">
              No addresses saved yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <AddressCard key={addr.id} address={addr} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AddressesPage() {
  return (
    <AuthGuard>
      <AddressesContent />
    </AuthGuard>
  );
}
