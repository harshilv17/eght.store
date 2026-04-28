"use client";

import { ProductVariant } from "@/types/product";

interface ColorSwatchesProps {
  variants: ProductVariant[];
  selected: string | null;
  onChange: (color: string) => void;
}

function colorHex(colorName: string): string {
  const map: Record<string, string> = {
    black: "#000000",
    white: "#FFFFFF",
    grey: "#9CA3AF",
    gray: "#9CA3AF",
    olive: "#3d4035",
    navy: "#1e3a5f",
    cream: "#F5F0E8",
    beige: "#D4C5A9",
    brown: "#7C5C3A",
    red: "#C0392B",
    orange: "#E67E22",
  };
  return map[colorName.toLowerCase()] ?? "#888888";
}

export function ColorSwatches({ variants, selected, onChange }: ColorSwatchesProps) {
  const colors = Array.from(new Set(variants.map((v) => v.color))).filter(Boolean);

  if (!colors.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-label-caps text-[var(--color-primary)]">
        COLOR: {selected?.toUpperCase() ?? colors[0]?.toUpperCase()}
      </span>
      <div className="flex gap-2 flex-wrap">
        {colors.map((color) => {
          const isSelected = selected === color;
          const isLight = ["white", "cream", "beige"].includes(color.toLowerCase());

          return (
            <button
              key={color}
              aria-label={color}
              aria-pressed={isSelected}
              onClick={() => onChange(color)}
              className={`w-8 h-8 rounded-full transition-all ${
                isLight ? "border border-[var(--color-outline-variant)]" : ""
              } ${isSelected ? "ring-2 ring-offset-2 ring-[var(--color-primary)]" : "hover:ring-1 hover:ring-offset-2 hover:ring-[var(--color-primary)]"}`}
              style={{ backgroundColor: colorHex(color) }}
            />
          );
        })}
      </div>
    </div>
  );
}
