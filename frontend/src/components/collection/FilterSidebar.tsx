"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/types/product";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Grey", hex: "#9CA3AF" },
  { name: "Olive", hex: "#3d4035" },
];

interface FilterSidebarProps {
  categories: Category[];
  currentSlug: string;
}

export function FilterSidebar({ categories, currentSlug }: FilterSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 shrink-0">
      {/* Mobile toggle label */}
      <div className="flex justify-between items-center mb-8 lg:hidden">
        <span className="text-label-caps">FILTERS</span>
      </div>

      <div className="hidden lg:flex flex-col gap-10">
        {/* Category */}
        <div>
          <h3 className="text-label-caps border-b border-[var(--color-outline-variant)] pb-2 mb-4">
            CATEGORY
          </h3>
          <ul className="flex flex-col gap-3 text-body-md text-[var(--color-on-surface-variant)]">
            <li>
              <Link
                href="/collections"
                className={`hover:text-[var(--color-primary)] transition-colors ${
                  pathname === "/collections" ? "text-[var(--color-primary)] font-semibold" : ""
                }`}
              >
                All
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/collections/${cat.slug}`}
                  className={`hover:text-[var(--color-primary)] transition-colors ${
                    currentSlug === cat.slug ? "text-[var(--color-primary)] font-semibold" : ""
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Size */}
        <div>
          <h3 className="text-label-caps border-b border-[var(--color-outline-variant)] pb-2 mb-4">
            SIZE
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                className="py-2 border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] text-label-caps transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <h3 className="text-label-caps border-b border-[var(--color-outline-variant)] pb-2 mb-4">
            COLOR
          </h3>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => {
              const isLight = color.name === "White";
              return (
                <button
                  key={color.name}
                  aria-label={color.name}
                  className={`w-6 h-6 rounded-full hover:ring-1 hover:ring-offset-2 hover:ring-[var(--color-primary)] transition-all ${
                    isLight ? "border border-[var(--color-outline-variant)]" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
