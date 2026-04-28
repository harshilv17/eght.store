import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const visible = images.length > 0 ? images : [];

  if (!visible.length) {
    return (
      <div className="flex flex-col gap-2">
        <div className="aspect-[3/4] w-full bg-[var(--color-surface-container-high)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {visible.map((src, i) => (
        <div key={i} className="aspect-[3/4] w-full bg-[var(--color-surface-container-high)] relative overflow-hidden">
          <Image
            src={src}
            alt={i === 0 ? alt : `${alt} — view ${i + 1}`}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>
      ))}
    </div>
  );
}
