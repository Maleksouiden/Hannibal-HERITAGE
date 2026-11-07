"use client";

import Link from "next/link";
import { useId, useState, useSyncExternalStore } from "react";
import { CURRENCY_CODES, type CurrencyCode } from "@/lib/currency-codes";
import {
  getSelectedCurrency,
  setSelectedCurrency,
  subscribeCurrency,
} from "@/lib/currency-preference";
import { getCartCount, subscribeCart } from "@/lib/cart-store";
import { useCurrencyRates } from "@/lib/currency-rates-client";

const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/sajnen", label: "Sejnane" },
  { href: "/olive-wood", label: "Olive wood" },
  { href: "#a-propos", label: "À propos" },
] as const;

/**
 * Sticky brand header for Hannibal HERITAGE (SCRUM-6 / SCRUM-15 responsive).
 *
 * TODO(LOGOS): Replace the text mark below with brand assets once available
 * under `public/logos/` — Wordmark, Red Symbol, Elephant (see that folder’s README).
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const cartCount = useSyncExternalStore(
    subscribeCart,
    getCartCount,
    () => 0,
  );
  const currency = useSyncExternalStore(
    subscribeCurrency,
    getSelectedCurrency,
    () => "TND" as CurrencyCode,
  );
  const rates = useCurrencyRates();
  const available = rates
    ? CURRENCY_CODES.filter((code) => code in rates.rates)
    : [...CURRENCY_CODES];

  return (
    <header className="sticky top-0 z-50 border-b border-[#ddd4c5]/60 bg-[#f7f3ec]/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 sm:h-16 sm:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:px-6">
        <div className="justify-self-start">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 text-xs tracking-[0.14em] text-[#5c564e] uppercase transition hover:text-[#1c1917]"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label="Menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden className="flex w-4 flex-col gap-1">
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
            </span>
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>

        <Link
          href="/"
          className="justify-self-center truncate px-1 text-center text-[11px] font-semibold tracking-[0.14em] text-[#1c1917] uppercase sm:text-sm sm:tracking-[0.2em]"
        >
          Hannibal HERITAGE
        </Link>

        <div className="flex items-center justify-self-end gap-1 sm:gap-4">
          <label className="flex min-h-11 items-center gap-1 text-xs tracking-[0.12em] text-[#5c564e] uppercase">
            <span className="sr-only">Currency</span>
            <select
              value={currency}
              onChange={(event) =>
                setSelectedCurrency(event.target.value as CurrencyCode)
              }
              className="max-w-[4.5rem] cursor-pointer border-0 bg-transparent py-2 pr-0 text-xs tracking-[0.12em] text-[#5c564e] uppercase outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:max-w-none"
              aria-label="Currency"
            >
              {available.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>

          <Link
            href="/panier"
            className="inline-flex min-h-11 items-center px-1 text-[11px] tracking-[0.1em] text-[#5c564e] uppercase transition hover:text-[#1c1917] sm:text-xs sm:tracking-[0.14em]"
            aria-label={`Panier (${cartCount})`}
          >
            Panier
            <span className="ml-1 tabular-nums text-[#8a8278]">
              ({cartCount})
            </span>
          </Link>
        </div>
      </div>

      <nav
        id={menuId}
        hidden={!menuOpen}
        className="border-t border-[#ddd4c5]/60 bg-[#f7f3ec]"
        aria-label="Primary"
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-3 py-3 sm:px-6 sm:py-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-11 items-center py-2 text-sm tracking-[0.08em] text-[#3f3a34] transition hover:text-[#1c1917]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
