"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { SeedProduct } from "@/data/sajnen-products";
import { DisplayPrice } from "@/components/display-price";
import { addToCart } from "@/lib/cart-store";
import {
  catalogHref,
  catalogLabel,
  productImages,
  productPriceMinor,
} from "@/lib/product-display";

type ProductDetailProps = {
  product: SeedProduct;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const images = productImages(product);
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const priceMinor = productPriceMinor(product);
  const label = catalogLabel(product.catalog);
  const backHref = catalogHref(product.catalog);

  function handleAdd() {
    addToCart({
      slug: product.slug,
      catalog: product.catalog,
      name: product.name,
      imageSrc: product.imageSrc,
      priceMinor,
      currency: product.currency,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-8 sm:grid-cols-2 sm:gap-12 sm:px-6 sm:py-16">
      <div className="flex min-w-0 flex-col gap-3">
        <div className="relative aspect-square overflow-hidden bg-[#ebe4d8]">
          <Image
            src={images[active] ?? product.imageSrc}
            alt={product.imageAlt}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        {images.length > 1 ? (
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {images.map((src, index) => (
              <li key={src}>
                <button
                  type="button"
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === active}
                  onClick={() => setActive(index)}
                  className={`relative aspect-square w-full overflow-hidden bg-[#ebe4d8] ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b8a5] ${
                    index === active ? "ring-2 ring-[#1c1917]" : ""
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
        <p className="text-xs tracking-[0.22em] text-[#8a8278] uppercase">
          {label}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-4xl">
          {product.name}
        </h1>
        <DisplayPrice
          priceMinor={priceMinor}
          sourceCurrency={product.currency}
          className="text-xl tracking-tight text-[#1c1917] sm:text-2xl"
        />
        <p className="max-w-md text-sm leading-6 text-[#5c564e] sm:text-base sm:leading-7">
          {product.description}
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex min-h-11 w-full items-center justify-center border border-[#1c1917] bg-[#1c1917] px-6 py-3 text-xs tracking-[0.16em] text-[#f7f3ec] uppercase transition hover:bg-transparent hover:text-[#1c1917] sm:w-auto"
          >
            {added ? "Added to panier" : "Add to panier"}
          </button>
          <Link
            href="/panier"
            className="inline-flex min-h-11 items-center justify-center text-xs tracking-[0.14em] text-[#5c564e] uppercase transition hover:text-[#1c1917] sm:justify-start"
          >
            View panier
          </Link>
        </div>
        <Link
          href={backHref}
          className="mt-4 inline-flex w-fit text-xs tracking-[0.16em] text-[#5c564e] uppercase transition hover:text-[#1c1917]"
        >
          ← Back to {label} catalog
        </Link>
      </div>
    </main>
  );
}
