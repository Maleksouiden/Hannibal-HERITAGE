"use client";

import Link from "next/link";
import type { SeedProduct } from "@/data/sajnen-products";
import { DisplayPrice } from "@/components/display-price";
import { ZoomImage } from "@/components/zoom-image";
import { productPriceMinor } from "@/lib/product-display";

type ProductCardProps = {
  product: SeedProduct;
  href: string;
};

export function ProductCard({ product, href }: ProductCardProps) {
  const priceMinor = productPriceMinor(product);

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b8a5]"
    >
      <div className="relative aspect-square overflow-hidden border border-[#e9e3d9] bg-[#fbfaf8] transition-shadow duration-300 group-hover:shadow-[0_12px_30px_rgba(28,25,23,0.08)]">
        <ZoomImage
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03] sm:p-6"
        />
      </div>
      <h2 className="font-serif text-sm leading-5 text-[#3f3a34] transition group-hover:text-[#756b5d] sm:text-base sm:leading-normal">
        {product.name}
      </h2>
      <DisplayPrice
        priceMinor={priceMinor}
        sourceCurrency={product.currency}
        className="text-sm font-semibold tabular-nums text-[#1c1917]"
      />
    </Link>
  );
}
