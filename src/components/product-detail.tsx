"use client";

import { Cormorant_Garamond, Figtree } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { DisplayPrice } from "@/components/display-price";
import { addToCart } from "@/lib/cart-store";
import type { CatalogProduct } from "@/lib/catalog-repository";
import {
  isLowStock,
  isOutOfStock,
  isSellable,
} from "@/lib/inventory";
import {
  catalogHref,
  catalogLabel,
  productImages,
  productPriceMinor,
} from "@/lib/product-display";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-pdp-display",
});

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pdp-body",
});

type ProductDetailProps = {
  product: CatalogProduct;
  related?: CatalogProduct[];
};

export function ProductDetail({ product, related = [] }: ProductDetailProps) {
  const images = productImages(product);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const thumbRail = useRef<HTMLDivElement>(null);
  const relatedRail = useRef<HTMLDivElement>(null);

  const priceMinor = productPriceMinor(product);
  const label = catalogLabel(product.catalog);
  const backHref = catalogHref(product.catalog);
  const sellable = isSellable(product);
  const collectionLabel =
    product.catalog === "SAJNEN" ? "Sejnane collection" : "Olive wood collection";

  const storyCopy = useMemo(() => {
    if (product.catalog === "SAJNEN") {
      return {
        title: "A tradition that lasts",
        body: "In Sejnane, pottery is a maternal craft — coiling, burnishing, and firing clay with techniques passed from mother to daughter. UNESCO recognizes this living tradition as Intangible Cultural Heritage of Humanity.",
        href: "/a-propos",
        image:
          related[0]?.imageSrc ??
          "/catalog/sajnen/beige-terracotta-sajnen-vessel.png",
      };
    }
    return {
      title: "Grain from ancient groves",
      body: "Tunisia’s olive trees stand for centuries. From their dense, swirling timber, artisans cut boards, bowls, and utensils — sanded smooth, never lacquered into anonymity.",
      href: "/a-propos",
      image:
        related[0]?.imageSrc ?? "/home/olive-wood-featured.png",
    };
  }, [product.catalog, related]);

  function handleAdd() {
    if (!sellable) return;
    addToCart(
      {
        slug: product.slug,
        catalog: product.catalog,
        name: product.name,
        imageSrc: product.imageSrc,
        priceMinor,
        currency: product.currency,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  function shiftThumb(delta: number) {
    thumbRail.current?.scrollBy({ top: delta * 88, behavior: "smooth" });
  }

  function shiftRelated(delta: number) {
    relatedRail.current?.scrollBy({ left: delta * 280, behavior: "smooth" });
  }

  return (
    <div
      className={`${display.variable} ${body.variable} relative flex w-full flex-1 flex-col overflow-hidden bg-[#f4efe6] text-[#1c1917]`}
      style={{ fontFamily: "var(--font-pdp-body), sans-serif" }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 35% 60% at 12% 0%, rgba(180,160,130,0.28), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[10px] tracking-[0.18em] text-[#8a8278] uppercase"
        >
          <Link href="/" className="transition hover:text-[#1c1917]">
            Accueil
          </Link>
          <span aria-hidden>/</span>
          <span>Collections</span>
          <span aria-hidden>/</span>
          <Link href={backHref} className="transition hover:text-[#1c1917]">
            {label}
          </Link>
        </nav>
      </div>

      <section className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:py-12">
        {/* Gallery */}
        <div className="flex min-w-0 gap-3 sm:gap-4">
          {images.length > 1 ? (
            <div className="hidden w-16 shrink-0 flex-col items-center gap-2 sm:flex">
              <button
                type="button"
                aria-label="Previous images"
                onClick={() => shiftThumb(-1)}
                className="inline-flex size-8 items-center justify-center text-[#6f675c] transition hover:text-[#1c1917]"
              >
                <ChevronUp />
              </button>
              <div
                ref={thumbRail}
                className="flex max-h-[28rem] w-full flex-col gap-2 overflow-y-auto scroll-smooth pr-1"
              >
                {images.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    aria-label={`View image ${index + 1}`}
                    aria-current={index === active}
                    onClick={() => setActive(index)}
                    className={`relative aspect-square w-full overflow-hidden rounded-xl bg-[#ebe4d8] ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b8a5] ${
                      index === active ? "ring-2 ring-[#1c1917]" : "ring-1 ring-transparent"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label="Next images"
                onClick={() => shiftThumb(1)}
                className="inline-flex size-8 items-center justify-center text-[#6f675c] transition hover:text-[#1c1917]"
              >
                <ChevronDown />
              </button>
            </div>
          ) : null}

          <div className="relative min-w-0 flex-1 overflow-hidden rounded-3xl bg-[#ebe4d8] aspect-square sm:aspect-[5/6]">
            <Image
              src={images[active] ?? product.imageSrc}
              alt={product.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Buy panel */}
        <div className="flex min-w-0 flex-col justify-center gap-5 animate-[auth-rise_700ms_ease-out]">
          <p className="text-[11px] tracking-[0.22em] text-[#6f675c] uppercase">
            — {collectionLabel}
          </p>
          <h1
            className="max-w-lg text-3xl leading-tight font-medium tracking-tight text-balance sm:text-5xl"
            style={{ fontFamily: "var(--font-pdp-display), serif" }}
          >
            {product.name}
          </h1>
          <DisplayPrice
            priceMinor={priceMinor}
            sourceCurrency={product.currency}
            className="text-2xl font-bold tracking-tight text-[#1c1917] sm:text-3xl"
          />

          <p
            className={`flex items-center gap-2 text-sm ${
              sellable
                ? isLowStock(product)
                  ? "text-amber-800"
                  : "text-[#2f6b3a]"
                : "text-red-900"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                sellable
                  ? isLowStock(product)
                    ? "bg-amber-700"
                    : "bg-[#2f6b3a]"
                  : "bg-red-800"
              }`}
              aria-hidden
            />
            {sellable
              ? `In stock — ${product.stock} available`
              : isOutOfStock(product)
                ? "Out of stock"
                : "Unavailable"}
          </p>

          <p className="max-w-md text-sm leading-7 text-[#5c564e] sm:text-[15px]">
            {product.description}
          </p>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-stretch">
            <div className="inline-flex min-h-12 items-center justify-between gap-4 rounded-md bg-[#e8dfd0] px-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={!sellable || qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="inline-flex size-9 items-center justify-center text-lg disabled:opacity-40"
              >
                −
              </button>
              <span className="min-w-6 text-center text-sm tabular-nums">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={!sellable || qty >= product.stock}
                onClick={() =>
                  setQty((q) => Math.min(product.stock || 99, q + 1))
                }
                className="inline-flex size-9 items-center justify-center text-lg disabled:opacity-40"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!sellable}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 bg-[#3d2f24] px-6 text-[11px] tracking-[0.16em] text-[#f7f3ec] uppercase transition hover:bg-[#2a2018] disabled:cursor-not-allowed disabled:bg-[#c4b8a5]"
            >
              <BagIcon />
              {!sellable
                ? isOutOfStock(product)
                  ? "Out of stock"
                  : "Unavailable"
                : added
                  ? "Added to panier"
                  : "Add to cart"}
            </button>
          </div>

          <ul className="mt-4 grid grid-cols-3 gap-3 border-t border-[#ddd4c5]/80 pt-6">
            <TrustItem icon={<DiamondIcon />} label="Authentic craftsmanship" />
            <TrustItem icon={<TruckIcon />} label="Secure delivery" />
            <TrustItem icon={<LeafIcon />} label="Tunisian heritage" />
          </ul>
        </div>
      </section>

      {/* Mobile thumbs */}
      {images.length > 1 ? (
        <ul className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 pb-4 sm:hidden">
          {images.map((src, index) => (
            <li key={`m-${src}-${index}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                className={`relative size-16 overflow-hidden rounded-xl bg-[#ebe4d8] ${
                  index === active ? "ring-2 ring-[#1c1917]" : ""
                }`}
              >
                <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Story */}
      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14">
        <div className="max-w-lg">
          <p className="text-[11px] tracking-[0.22em] text-[#6f675c] uppercase">
            The story behind the craft
          </p>
          <h2
            className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-pdp-display), serif" }}
          >
            {storyCopy.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#5c564e] sm:text-[15px]">
            {storyCopy.body}
          </p>
          <Link
            href={storyCopy.href}
            className="mt-7 inline-flex min-h-11 items-center border border-[#1c1917] bg-[#f7f3ec]/70 px-5 text-[11px] tracking-[0.16em] text-[#1c1917] uppercase transition hover:bg-[#1c1917] hover:text-[#f7f3ec]"
          >
            Discover more →
          </Link>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#ebe4d8]">
          <Image
            src={storyCopy.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Related */}
      {related.length > 0 ? (
        <section className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2
              className="text-2xl font-medium tracking-tight sm:text-3xl"
              style={{ fontFamily: "var(--font-pdp-display), serif" }}
            >
              You may also like
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous related"
                onClick={() => shiftRelated(-1)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-[#ddd4c5] text-[#1c1917] transition hover:bg-[#1c1917] hover:text-[#f7f3ec]"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                aria-label="Next related"
                onClick={() => shiftRelated(1)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-[#ddd4c5] text-[#1c1917] transition hover:bg-[#1c1917] hover:text-[#f7f3ec]"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div
            ref={relatedRail}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-2"
          >
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`${catalogHref(item.catalog)}/${item.slug}`}
                className="w-[12.5rem] shrink-0 sm:w-[14rem]"
              >
                <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl bg-[#ebe4d8]">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="224px"
                    className="object-cover transition duration-500 hover:scale-[1.03]"
                  />
                </div>
                <p
                  className="text-sm leading-snug text-[#1c1917]"
                  style={{ fontFamily: "var(--font-pdp-display), serif" }}
                >
                  {item.name}
                </p>
                <DisplayPrice
                  priceMinor={productPriceMinor(item)}
                  sourceCurrency={item.currency}
                  className="mt-1 text-sm font-semibold text-[#1c1917]"
                />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Value bar */}
      <section className="mt-8 border-t border-[#ddd4c5]/70 bg-[#ebe4d8]/70">
        <ul className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-0">
          <ValueItem
            icon={<PillarIcon />}
            label="A piece of Tunisian heritage"
          />
          <ValueItem
            icon={<TruckIcon />}
            label="Free delivery on orders over 300 TND"
            divide
          />
          <ValueItem icon={<ShieldIcon />} label="Secure payment" divide />
          <ValueItem icon={<HeadsetIcon />} label="Dedicated support" divide />
        </ul>
      </section>
    </div>
  );
}

function TrustItem({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <li className="flex flex-col items-start gap-2 text-left">
      <span className="text-[#6f675c]">{icon}</span>
      <span className="text-[10px] leading-4 tracking-[0.08em] text-[#5c564e] uppercase">
        {label}
      </span>
    </li>
  );
}

function ValueItem({
  icon,
  label,
  divide = false,
}: {
  icon: ReactNode;
  label: string;
  divide?: boolean;
}) {
  return (
    <li
      className={`flex items-center gap-3 text-sm text-[#3f3a34] lg:justify-center lg:px-4 ${
        divide ? "lg:border-l lg:border-[#d7cdb8]" : ""
      }`}
    >
      <span className="text-[#6f675c]">{icon}</span>
      <span className="leading-5">{label}</span>
    </li>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M3 9h18L12 21 3 9z" />
      <path d="M3 9l4-5h10l4 5" />
      <path d="M8 4l4 5 4-5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7v-7z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z" />
      <path d="M5 19c4-4 8-8 14-14" />
    </svg>
  );
}

function PillarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M4 20V8l8-4 8 4v12" />
      <path d="M4 10h16" />
      <path d="M8 20V12M12 20V12M16 20V12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13h3v5H4zM17 13h3v5h-3z" />
      <path d="M20 18v1a2 2 0 0 1-2 2h-5" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 14l6-6 6 6" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 10l6 6 6-6" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M14 6l-6 6 6 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M10 6l6 6-6 6" />
    </svg>
  );
}
