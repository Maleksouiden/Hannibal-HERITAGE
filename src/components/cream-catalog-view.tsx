"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DisplayPrice } from "@/components/display-price";
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
    <div className="relative overflow-hidden bg-[#f4efe6] text-[#1c1917]">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 40% 35% at 78% 18%, rgba(210,196,170,0.55), transparent 70%), radial-gradient(ellipse 28% 22% at 8% 92%, rgba(196,180,150,0.35), transparent 70%), radial-gradient(ellipse 24% 18% at 92% 88%, rgba(196,180,150,0.3), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-24 right-[8%] hidden h-[22rem] w-[22rem] rounded-full bg-[#e5dccb]/80 blur-[2px] lg:block"
        aria-hidden
      />
      <svg
        className="pointer-events-none absolute top-10 right-[42%] hidden h-40 w-32 text-[#cfc3ae]/45 lg:block"
        viewBox="0 0 120 160"
        fill="currentColor"
        aria-hidden
      >
        <ellipse cx="70" cy="30" rx="18" ry="40" transform="rotate(25 70 30)" />
        <ellipse cx="45" cy="70" rx="16" ry="36" transform="rotate(-15 45 70)" />
        <ellipse cx="85" cy="95" rx="14" ry="32" transform="rotate(40 85 95)" />
      </svg>

      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-10 pb-6 sm:px-6 sm:pt-14 lg:grid-cols-2 lg:gap-8 lg:pb-4">
        <div className="relative z-10 max-w-xl animate-[auth-rise_700ms_ease-out]">
          <div className="flex items-center gap-3">
            <p className="text-[11px] tracking-[0.28em] text-[#1c1917] uppercase">
              Catalog
            </p>
            <span className="h-px w-14 bg-[#1c1917]/70" aria-hidden />
          </div>
          <h1
            className="mt-5 text-5xl leading-none font-medium tracking-tight sm:text-7xl"
            style={{ fontFamily: "var(--font-catalog-display), serif" }}
          >
            {title}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#5c564e] sm:text-[15px] sm:leading-7">
            {description}
          </p>
          <button
            type="button"
            onClick={scrollToGrid}
            className="mt-8 inline-flex min-h-12 items-center bg-[#1c1917] px-6 text-[11px] tracking-[0.18em] text-[#f7f3ec] uppercase transition hover:bg-[#3a342c]"
          >
            Discover the collection →
          </button>
        </div>

        <div className="relative mx-auto flex w-full max-w-lg items-center justify-center lg:max-w-none lg:justify-end">
          <div
            className="absolute top-1/2 right-[8%] h-[18rem] w-[18rem] -translate-y-1/2 rounded-full bg-[#e8dfd0] sm:h-[22rem] sm:w-[22rem]"
            aria-hidden
          />
          <div className="relative z-10 w-[88%] max-w-md animate-[auth-rise_900ms_ease-out]">
            <Image
              src={heroImageSrc}
              alt={heroImageAlt}
              width={720}
              height={900}
              priority
              className="h-auto w-full object-contain drop-shadow-[0_24px_40px_rgba(40,30,20,0.12)]"
            />
          </div>
        </div>
      </section>

      <section
        id={collectionId}
        className="relative mx-auto w-full max-w-6xl px-4 pt-6 pb-8 sm:px-6"
      >
        <div className="flex flex-col gap-4 border-b border-[#ddd4c5]/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
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
              className="min-h-9 cursor-pointer border border-[#ddd4c5] bg-transparent px-2 py-1.5 text-[11px] tracking-[0.12em] text-[#1c1917] uppercase outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
            >
              <option value="newest">Newest First</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
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
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#ebe4d8]">
                    <Link
                      href={href}
                      className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b8a5]"
                    >
                      <Image
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
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
                      className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-[#f7f3ec]/80 text-[#1c1917] backdrop-blur-sm transition hover:bg-[#f7f3ec]"
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
                      className="text-[15px] leading-snug text-[#1c1917] sm:text-base"
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
