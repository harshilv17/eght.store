"use client";

interface MarqueeProps {
  items?: string[];
  speed?: number;
}

const DEFAULT_ITEMS = [
  "NEW DROP — SEASON 03",
  "FREE SHIPPING OVER ₹2999",
  "LIMITED EDITION",
  "CRAFTED FOR THE STREETS",
  "NEW DROP — SEASON 03",
  "FREE SHIPPING OVER ₹2999",
  "LIMITED EDITION",
  "CRAFTED FOR THE STREETS",
];

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  return (
    <div
      className="w-full overflow-hidden bg-[var(--color-primary)] py-2"
      aria-hidden="true"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-label-caps text-[var(--color-on-primary)] px-8">
            {item}
            <span className="mx-8 opacity-40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
