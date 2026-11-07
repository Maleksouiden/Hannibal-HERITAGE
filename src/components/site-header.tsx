"use client";

import Link from "next/link";
import { useId, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/sajnen", label: "Sejnane" },
  { href: "#olive-wood", label: "Olive wood" },
  { href: "#a-propos", label: "À propos" },
] as const;

const CURRENCIES = ["TND", "EUR", "USD"] as const;

/**
 * Sticky brand header for Hannibal HERITAGE (SCRUM-6).
 *
 * TODO(LOGOS): Replace the text mark below with brand assets once available
 * under `public/logos/` — Wordmark, Red Symbol, Elephant (see that folder’s README).
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("TND");
  const menuId = useId();

  return (
    <header className="sticky top-0 z-50 border-b border-[#ddd4c5]/60 bg-[#f7f3ec]/95 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6">
        <div className="justify-self-start">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#5c564e] transition hover:text-[#1c1917]"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden className="flex w-4 flex-col gap-1">
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
            </span>
            Menu
          </button>
        </div>

        <Link
          href="/"
          className="justify-self-center text-center font-semibold tracking-[0.2em] text-[#1c1917] uppercase"
        >
          Hannibal HERITAGE
        </Link>

        <div className="flex items-center justify-self-end gap-3 sm:gap-4">
          <label className="flex items-center gap-1.5 text-xs tracking-[0.12em] uppercase text-[#5c564e]">
            <span className="sr-only">Currency</span>
            <select
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value as (typeof CURRENCIES)[number])
              }
              className="cursor-pointer border-0 bg-transparent py-1 pr-1 text-xs tracking-[0.12em] uppercase text-[#5c564e] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
              aria-label="Currency"
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>

          <Link
            href="#panier"
            className="text-xs tracking-[0.14em] uppercase text-[#5c564e] transition hover:text-[#1c1917]"
            aria-label="Panier"
          >
            Panier
            <span className="ml-1 tabular-nums text-[#8a8278]">(0)</span>
          </Link>
        </div>
      </div>

      <nav
        id={menuId}
        hidden={!menuOpen}
        className="border-t border-[#ddd4c5]/60 bg-[#f7f3ec]"
        aria-label="Primary"
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-2 text-sm tracking-[0.08em] text-[#3f3a34] transition hover:text-[#1c1917]"
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
