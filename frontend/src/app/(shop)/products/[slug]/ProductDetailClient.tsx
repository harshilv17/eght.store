"use client";

import { useState } from "react";
import { ProductDetail, ProductVariant } from "@/types/product";
import { ColorSwatches } from "@/components/product/ColorSwatches";
import { SizeSelector } from "@/components/product/SizeSelector";
import { AddToBagButton } from "@/components/product/AddToBagButton";
import { Accordion } from "@/components/ui/Accordion";
import { formatCurrency } from "@/lib/format";

const ACCORDION_ITEMS = [
  {
    title: "FABRIC & CARE",
    content: "Premium construction. Refer to the care label for specific washing instructions. Dry clean recommended for outerwear.",
  },
  {
    title: "SHIPPING & RETURNS",
    content: "Complimentary standard shipping on all orders. Returns accepted within 14 days of delivery in original, unworn condition with tags attached.",
  },
];

interface ProductDetailClientProps {
  product: ProductDetail;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color))).filter(Boolean);
  const [selectedColor, setSelectedColor] = useState<string | null>(uniqueColors[0] ?? null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  function handleColorChange(color: string) {
    setSelectedColor(color);
    setSelectedSize(null);
  }

  const selectedVariant: ProductVariant | undefined = selectedColor && selectedSize
    ? product.variants.find((v) => v.color === selectedColor && v.size === selectedSize)
    : undefined;

  const bagItem = selectedVariant
    ? {
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        size: selectedVariant.size,
        color: selectedVariant.color,
        sku: selectedVariant.sku,
        price: product.price,
        quantity: 1,
        images: product.images ?? [],
        stockQty: selectedVariant.stock_qty,
      }
    : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Name + price */}
      <div>
        <h1 className="text-headline-lg text-[var(--color-primary)] uppercase leading-tight">
          {product.name}
        </h1>
        <p className="text-body-lg text-[var(--color-secondary)] mt-2">
          {formatCurrency(product.price)}
          {product.compare_price != null && product.compare_price > product.price && (
            <span className="ml-3 line-through text-[var(--color-on-surface-variant)]">
              {formatCurrency(product.compare_price)}
            </span>
          )}
        </p>
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-body-md text-[var(--color-on-surface-variant)]">{product.description}</p>
      )}

      <hr className="border-t border-[var(--color-outline-variant)]" />

      {/* Color swatches */}
      {product.variants.length > 0 && (
        <ColorSwatches
          variants={product.variants}
          selected={selectedColor}
          onChange={handleColorChange}
        />
      )}

      {/* Size selector */}
      {product.variants.length > 0 && (
        <SizeSelector
          variants={product.variants}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onChange={setSelectedSize}
        />
      )}

      {/* Add to bag */}
      <AddToBagButton
        item={bagItem}
        disabled={product.total_stock === 0}
      />

      {/* Accordions */}
      <Accordion items={ACCORDION_ITEMS} />
    </div>
  );
}
