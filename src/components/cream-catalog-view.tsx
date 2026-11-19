"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DisplayPrice } from "@/components/display-price";
import { ZoomImage } from "@/components/zoom-image";
import type { CatalogProduct } from "@/lib/catalog-repository";
import { productPriceMinor } from "@/lib/product-display";

type SortId = "newest" | "name";

export type CreamCatalogFilter = {
  id: string;
  label: string;
};

type CreamCatalogViewProps = {
  products: CatalogProduct[];
  heroImageSrc: string;
  heroImageAlt: string;
  title: string;
  description: string;
  /** Product detail base path, e.g. `/sajnen` or `/olive-wood`. */
  basePath: string;
  collectionId: string;
  filters: CreamCatalogFilter[];
  matchFilter: (product: CatalogProduct, filterId: string) => boolean;
};

/**
 * Shared cream-mock catalog chrome (HH-26 Sejnane layout) for every collection.
 */
export function CreamCatalogView({
  products,
  heroImageSrc,
  heroImageAlt,
  title,
  description,
  basePath,
  collectionId,
  filters,
  matchFilter,
}: CreamCatalogViewProps) {
  const [filter, setFilter] = useState(filters[0]?.id ?? "all");
  const [sort, setSort] = useState<SortId>("newest");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const visible = useMemo(() => {
    const filtered = products.filter((product) => matchFilter(product, filter));
    const sorted = [...filtered];
    if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.reverse();
    }
    return sorted;
  }, [products, filter, sort, matchFilter]);

  function toggleLike(slug: string) {
    setLiked((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }

  function scrollToGrid() {
    document.getElementById(collectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="relative overflow-hidden bg-white text-[#1c1917]">
      <section className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8 sm:py-10">
        <div className="grid overflow-hidden rounded-2xl border border-[#e9e3d9] bg-[#f7f3ec] lg:min-h-[34rem] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col items-start justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <p className="flex items-center gap-3 text-[10px] tracking-[0.24em] text-[#756b5d] uppercase sm:text-[11px]">
              <span className="h-px w-8 bg-[#9b7653]" aria-hidden />
              Tunisian artisan collection
            </p>
            <h1
              className="mt-5 max-w-xl text-5xl leading-[0.98] font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-catalog-display), serif" }}
            >
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#5c564e] sm:text-base sm:leading-8">
              {description}
            </p>
            <button
              type="button"
              onClick={scrollToGrid}
              className="mt-8 inline-flex min-h-12 items-center gap-5 bg-[#1c1917] px-6 text-[10px] tracking-[0.2em] text-white uppercase transition hover:bg-[#3a342c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b7653] focus-visible:ring-offset-2"
            >
              Discover the collection <span aria-hidden>→</span>
            </button>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#d9d0c3] pt-5 text-[10px] tracking-[0.14em] text-[#756b5d] uppercase sm:text-[11px]">
              <span>{products.length} curated pieces</span>
              <span>Made in Tunisia</span>
            </div>
          </div>

          <div className="relative min-h-[20rem] bg-white sm:min-h-[26rem] lg:min-h-full">
            <div className="absolute inset-4 border border-[#eee9e1] sm:inset-6 lg:inset-8" aria-hidden />
            <ZoomImage
              src={heroImageSrc}
              alt={heroImageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-contain p-8 sm:p-12 lg:p-16"
            />
            <span className="absolute right-8 bottom-8 text-[9px] tracking-[0.2em] text-[#8a8278] uppercase sm:right-12 sm:bottom-12">
              {title} · Tunisia
            </span>
          </div>
        </div>
      </section>

      <section
        id={collectionId}
        className="relative mx-auto w-full max-w-[1440px] scroll-mt-24 px-4 pt-8 pb-12 sm:px-8 sm:pt-10 sm:pb-16"
      >
        <div className="flex flex-col gap-5 border-b border-[#e8e8e5] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.22em] text-[#8a8278] uppercase">
              The collection
            </p>
            <p className="mt-2 text-sm text-[#5c564e]">
              Showing {visible.length} of {products.length} pieces
            </p>
          </div>
          <nav
            aria-label="Product filters"
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={active}
                  className={`relative pb-1 text-[11px] tracking-[0.16em] uppercase transition ${
                    active
                      ? "text-[#1c1917]"
                      : "text-[#8a8278] hover:text-[#1c1917]"
                  }`}
                >
                  {item.label}
                  {active ? (
                    <span
                      className="absolute inset-x-0 -bottom-0.5 h-px bg-[#1c1917]"
                      aria-hidden
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>

          <label className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#6f675c] uppercase">
            Sort by:
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortId)}
              className="min-h-10 cursor-pointer border border-[#ddd4c5] bg-white px-3 py-2 text-[11px] tracking-[0.12em] text-[#1c1917] uppercase outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
            >
              <option value="newest">Newest First</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((product, index) => {
            const priceMinor = productPriceMinor(product);
            const isLiked = Boolean(liked[product.slug]);
            const href = `${basePath}/${product.slug}`;
            return (
              <li
                key={product.slug}
                className="animate-[auth-rise_700ms_ease-out]"
                style={{
                  animationDelay: `${Math.min(index, 12) * 40}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="group flex flex-col gap-3">
                  <div className="group/image relative aspect-square overflow-hidden border border-[#eee9e1] bg-[#fbfaf8] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(28,25,23,0.08)]">
                    <Link
                      href={href}
                      className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b8a5]"
                    >
                      <ZoomImage
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-4 sm:p-6"
                      />
                    </Link>
                    <button
                      type="button"
                      aria-label={
                        isLiked
                          ? `Remove ${product.name} from favorites`
                          : `Save ${product.name}`
                      }
                      aria-pressed={isLiked}
                      onClick={() => toggleLike(product.slug)}
                      className="absolute top-3 right-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-[#e8e4dc] bg-white/95 text-[#1c1917] shadow-sm backdrop-blur-sm transition hover:scale-105 hover:bg-white"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4"
                        fill={isLiked ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.6"
                        aria-hidden
                      >
                        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
                      </svg>
                    </button>
                  </div>
                  <Link
                    href={href}
                    className="flex flex-col gap-1 focus-visible:outline-none"
                  >
                    <h2
                      className="text-[15px] leading-snug text-[#1c1917] transition-colors group-hover:text-[#756b5d] sm:text-base"
                      style={{
                        fontFamily: "var(--font-catalog-display), serif",
                      }}
                    >
                      {product.name}
                    </h2>
                    <DisplayPrice
                      priceMinor={priceMinor}
                      sourceCurrency={product.currency}
                      className="text-sm font-semibold tracking-tight text-[#1c1917]"
                    />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        {visible.length === 0 ? (
          <p className="mt-10 text-sm text-[#5c564e]">
            No pieces in this filter yet.
          </p>
        ) : null}
      </section>

      <footer className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-10 pb-16 sm:px-6 sm:pb-20">
        <div className="flex items-center gap-3 text-[#6f675c]">
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden
          >
            <path d="M4 20V8l8-4 8 4v12" />
            <path d="M4 10h16" />
            <path d="M8 20V12" />
            <path d="M12 20V12" />
            <path d="M16 20V12" />
          </svg>
          <p className="text-[10px] tracking-[0.28em] uppercase">
            Tunisian heritage, timeless craftsmanship
          </p>
        </div>
      </footer>
    </div>
  );
}
