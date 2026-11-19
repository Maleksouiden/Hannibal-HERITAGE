"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  cartLineId,
  getCartLines,
  getEmptyCartSnapshot,
  getCartSubtotalMinor,
  removeFromCart,
  setCartQuantity,
  subscribeCart,
  type CartLine,
} from "@/lib/cart-store";
import { DisplayPrice } from "@/components/display-price";
import { catalogHref, catalogLabel } from "@/lib/product-display";

function productHref(line: CartLine): string {
  return `${catalogHref(line.catalog)}/${line.slug}`;
}

export function CartView() {
  const lines = useSyncExternalStore(
    subscribeCart,
    getCartLines,
    getEmptyCartSnapshot,
  );
  const subtotalMinor = useSyncExternalStore(
    subscribeCart,
    getCartSubtotalMinor,
    () => 0,
  );

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center border border-[#e9e3d9] bg-[#fbfaf8] px-5 py-14 text-center sm:px-10 sm:py-20">
        <span className="flex size-14 items-center justify-center rounded-full border border-[#e1d9cc] text-[#756b5d]" aria-hidden>
          <BagIcon />
        </span>
        <p className="mt-6 text-[10px] tracking-[0.22em] text-[#8a8278] uppercase">
          Your next favourite piece
        </p>
        <h2 className="mt-2 text-3xl font-medium tracking-tight text-[#1c1917] sm:text-4xl">
          Your panier is empty
        </h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-[#5c564e]">
          Explore handcrafted pieces from Tunisia and find something made to
          stay in your home for years to come.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/sajnen"
            className="inline-flex min-h-12 items-center justify-center bg-[#293126] px-5 text-[10px] tracking-[0.16em] text-white uppercase transition hover:bg-[#3b4736]"
          >
            Explore Sejnane
          </Link>
          <Link
            href="/olive-wood"
            className="inline-flex min-h-12 items-center justify-center border border-[#d8d0c3] bg-white px-5 text-[10px] tracking-[0.16em] text-[#1c1917] uppercase transition hover:border-[#1c1917]"
          >
            Explore olive wood
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-14">
      <ul className="flex min-w-0 flex-col divide-y divide-[#ddd4c5]/70">
        {lines.map((line) => (
          <li
            key={cartLineId(line)}
            className="grid grid-cols-[80px_minmax(0,1fr)] gap-3 border-b border-[#e9e3d9] py-5 first:pt-0 sm:grid-cols-[128px_minmax(0,1fr)_auto] sm:gap-6 sm:py-6"
          >
            <Link
              href={productHref(line)}
              className="group relative aspect-square overflow-hidden border border-[#e9e3d9] bg-white"
            >
              <Image
                src={line.imageSrc}
                alt={line.name}
                fill
                sizes="128px"
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </Link>

            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-[10px] tracking-[0.18em] text-[#8a8278] uppercase">
                {catalogLabel(line.catalog)}
              </p>
              <Link
                href={productHref(line)}
                className="break-words text-sm tracking-[0.02em] text-[#1c1917] hover:underline"
              >
                {line.name}
              </Link>
              <DisplayPrice
                priceMinor={line.priceMinor}
                sourceCurrency={line.currency}
                className="text-sm text-[#5c564e]"
              />

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs tracking-[0.12em] text-[#5c564e] uppercase">
                  Qty
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={line.quantity}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (Number.isFinite(value)) {
                        setCartQuantity(line.catalog, line.slug, value);
                      }
                    }}
                    className="min-h-11 w-16 border border-[#ddd4c5] bg-white px-2 py-2 text-sm tabular-nums text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#9b7653]"
                    aria-label={`Quantity for ${line.name}`}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeFromCart(line.catalog, line.slug)}
                  className="inline-flex min-h-11 items-center text-xs tracking-[0.12em] text-[#8a8278] uppercase transition hover:text-[#1c1917]"
                >
                  Remove
                </button>
              </div>

              <DisplayPrice
                priceMinor={line.priceMinor * line.quantity}
                sourceCurrency={line.currency}
                className="text-sm tabular-nums text-[#1c1917] sm:hidden"
              />
            </div>

            <DisplayPrice
              priceMinor={line.priceMinor * line.quantity}
              sourceCurrency={line.currency}
              className="hidden text-right text-sm tabular-nums text-[#1c1917] sm:block"
            />
          </li>
        ))}
      </ul>

      <aside className="sticky bottom-0 z-20 -mx-4 flex flex-col gap-4 border-t border-[#ddd4c5] bg-[#f7f3ec]/95 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:rounded-xl sm:border sm:p-5 lg:static lg:mx-0 lg:rounded-2xl lg:p-6">
        <h2 className="text-[10px] tracking-[0.2em] text-[#756b5d] uppercase">
          Order summary
        </h2>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-xs tracking-[0.16em] text-[#5c564e] uppercase">
            Subtotal
          </span>
          <DisplayPrice
            priceMinor={subtotalMinor}
            sourceCurrency="TND"
            className="text-lg tabular-nums text-[#1c1917]"
          />
        </div>
        <p className="text-xs leading-5 text-[#756b5d]">
          Delivery is calculated at checkout. Display currency converts for
          viewing only; stored prices stay in TND.
        </p>
        <Link
          href="/checkout"
          className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#293126] px-5 py-3 text-center text-[10px] tracking-[0.18em] text-white uppercase transition hover:bg-[#3b4736] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b7653] focus-visible:ring-offset-2"
        >
          Continue to checkout <span aria-hidden>→</span>
        </Link>
      </aside>
    </div>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <path d="M5 8h14l-1 13H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
