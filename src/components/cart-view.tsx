"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  cartLineId,
  getCartLines,
  getCartSubtotalMinor,
  removeFromCart,
  setCartQuantity,
  subscribeCart,
  type CartLine,
} from "@/lib/cart-store";
import {
  catalogHref,
  catalogLabel,
  formatProductPrice,
} from "@/lib/product-display";

function productHref(line: CartLine): string {
  return `${catalogHref(line.catalog)}/${line.slug}`;
}

export function CartView() {
  const lines = useSyncExternalStore(subscribeCart, getCartLines, () => []);
  const subtotalMinor = useSyncExternalStore(
    subscribeCart,
    getCartSubtotalMinor,
    () => 0,
  );

  if (lines.length === 0) {
    return (
      <div className="flex max-w-lg flex-col gap-5">
        <p className="text-base leading-7 text-[#5c564e]">
          Your panier is empty.
        </p>
        <div className="flex flex-wrap gap-4 text-xs tracking-[0.14em] uppercase">
          <Link href="/sajnen" className="text-[#5c564e] hover:text-[#1c1917]">
            Browse Sejnane
          </Link>
          <Link
            href="/olive-wood"
            className="text-[#5c564e] hover:text-[#1c1917]"
          >
            Browse olive wood
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-14">
      <ul className="flex flex-col divide-y divide-[#ddd4c5]/70">
        {lines.map((line) => (
          <li
            key={cartLineId(line)}
            className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:gap-6"
          >
            <Link
              href={productHref(line)}
              className="relative aspect-square overflow-hidden bg-[#ebe4d8]"
            >
              <Image
                src={line.imageSrc}
                alt={line.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </Link>

            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-[10px] tracking-[0.18em] text-[#8a8278] uppercase">
                {catalogLabel(line.catalog)}
              </p>
              <Link
                href={productHref(line)}
                className="text-sm tracking-[0.02em] text-[#1c1917] hover:underline"
              >
                {line.name}
              </Link>
              <p className="text-sm text-[#5c564e]">
                {formatProductPrice(line.priceMinor, line.currency)}
              </p>

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
                    className="w-16 border border-[#ddd4c5] bg-transparent px-2 py-1 text-sm tabular-nums text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
                    aria-label={`Quantity for ${line.name}`}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeFromCart(line.catalog, line.slug)}
                  className="text-xs tracking-[0.12em] text-[#8a8278] uppercase transition hover:text-[#1c1917]"
                >
                  Remove
                </button>
              </div>

              <p className="text-sm tabular-nums text-[#1c1917] sm:hidden">
                {formatProductPrice(
                  line.priceMinor * line.quantity,
                  line.currency,
                )}
              </p>
            </div>

            <p className="hidden text-right text-sm tabular-nums text-[#1c1917] sm:block">
              {formatProductPrice(
                line.priceMinor * line.quantity,
                line.currency,
              )}
            </p>
          </li>
        ))}
      </ul>

      <aside className="flex flex-col gap-4 border-t border-[#ddd4c5]/70 pt-6 lg:border-t-0 lg:pt-0">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-xs tracking-[0.16em] text-[#5c564e] uppercase">
            Subtotal
          </span>
          <span className="text-lg tabular-nums text-[#1c1917]">
            {formatProductPrice(subtotalMinor, "TND")}
          </span>
        </div>
        <p className="text-sm leading-6 text-[#8a8278]">
          Prices shown in TND. Checkout arrives in a later story.
        </p>
        <button
          type="button"
          disabled
          className="border border-[#ddd4c5] px-5 py-3 text-xs tracking-[0.16em] text-[#8a8278] uppercase"
        >
          Checkout soon
        </button>
      </aside>
    </div>
  );
}
