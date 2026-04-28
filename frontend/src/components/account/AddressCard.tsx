"use client";

import { Address } from "@/types/user";

interface AddressCardProps {
  address: Address;
  onDelete: (id: string) => void;
}

export function AddressCard({ address, onDelete }: AddressCardProps) {
  return (
    <div className="border border-[var(--color-outline-variant)] p-5 flex flex-col gap-3 relative">
      {address.is_default && (
        <span className="absolute top-3 right-3 text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-tertiary-container)] text-[10px]">
          Default
        </span>
      )}

      <div className="text-body-md text-[var(--color-on-surface-variant)] flex flex-col gap-0.5">
        <p className="font-bold text-[var(--color-on-surface)]">{address.full_name}</p>
        <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
        <p>{address.city}, {address.state} – {address.pincode}</p>
        <p>{address.phone}</p>
      </div>

      <button
        onClick={() => onDelete(address.id)}
        className="self-start text-label-caps font-bold uppercase tracking-widest text-[var(--color-error)] hover:opacity-70 transition-opacity"
      >
        Remove
      </button>
    </div>
  );
}
