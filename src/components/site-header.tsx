"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { CURRENCY_CODES, type CurrencyCode } from "@/lib/currency-codes";
import {
  getSelectedCurrency,
  setSelectedCurrency,
  subscribeCurrency,
} from "@/lib/currency-preference";
import { getCartCount, subscribeCart } from "@/lib/cart-store";
import { useCurrencyRates } from "@/lib/currency-rates-client";
import { useAuthUser } from "@/lib/auth-client";
import type { SiteMenuFlags } from "@/lib/site-content";

const NAV_ITEMS = [
  { href: "/", label: "Accueil", flag: "showAccueil" },
  { href: "/sajnen", label: "Sejnane", flag: "showSajnen" },
  { href: "/olive-wood", label: "Olive wood", flag: "showOliveWood" },
  { href: "/a-propos", label: "À propos", flag: "showAPropos" },
] as const satisfies ReadonlyArray<{
  href: string;
  label: string;
  flag: keyof SiteMenuFlags;
}>;

const DEFAULT_MENU: SiteMenuFlags = {
  showAccueil: true,
  showSajnen: true,
  showOliveWood: true,
  showAPropos: true,
};

/**
 * Luxury storefront chrome inspired by Artisans Collection layout:
 * Menu | brand | Compte · Cart · Wishlist · Search · currency
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuFlags, setMenuFlags] = useState<SiteMenuFlags>(DEFAULT_MENU);
  const menuId = useId();
  const searchId = useId();
  const router = useRouter();
  const { user, logout } = useAuthUser();
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

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/site", { credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json()) as { settings?: SiteMenuFlags };
        if (!cancelled && data.settings) {
          setMenuFlags({
            showAccueil: data.settings.showAccueil,
            showSajnen: data.settings.showSajnen,
            showOliveWood: data.settings.showOliveWood,
            showAPropos: data.settings.showAPropos,
          });
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const navItems = useMemo(
    () => NAV_ITEMS.filter((item) => menuFlags[item.flag]),
    [menuFlags],
  );

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    router.refresh();
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get("q") ?? "")
      .trim()
      .toLowerCase();
    setSearchOpen(false);
    if (q.includes("olive")) {
      router.push("/olive-wood");
      return;
    }
    router.push("/sajnen");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e4dccf] bg-[#f7f3ec]/96 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:h-[4.25rem] sm:gap-4 sm:px-6">
        <div className="justify-self-start">
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 text-[11px] tracking-[0.18em] text-[#3f3a34] uppercase transition hover:text-[#1c1917]"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label="Menu"
            onClick={() => {
              setMenuOpen((open) => !open);
              setSearchOpen(false);
            }}
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
          className="group flex flex-col items-center justify-self-center px-1 text-center"
        >
          <span
            aria-hidden
            className="mb-0.5 text-[#8a8278] opacity-80 transition group-hover:text-[#1c1917]"
          >
            <svg viewBox="0 0 24 24" className="mx-auto size-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 20V8l8-4 8 4v12" />
              <path d="M4 10h16" />
              <path d="M8 20V12M12 20V12M16 20V12" />
            </svg>
          </span>
          <span className="text-[10px] font-semibold tracking-[0.22em] text-[#1c1917] uppercase sm:text-xs sm:tracking-[0.28em]">
            Hannibal HERITAGE
          </span>
        </Link>

        <div className="flex items-center justify-self-end gap-0.5 sm:gap-2">
          {user?.role === "ADMIN" ? (
            <Link
              href="/dashboard"
              className="hidden min-h-11 items-center px-1.5 text-[10px] tracking-[0.14em] text-[#5c564e] uppercase transition hover:text-[#1c1917] lg:inline-flex"
            >
              Dashboard
            </Link>
          ) : null}

          {user ? (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="hidden min-h-11 items-center px-1.5 text-[10px] tracking-[0.14em] text-[#5c564e] uppercase transition hover:text-[#1c1917] sm:inline-flex"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden min-h-11 items-center px-1.5 text-[10px] tracking-[0.14em] text-[#5c564e] uppercase transition hover:text-[#1c1917] sm:inline-flex"
            >
              Login
            </Link>
          )}

          <Link
            href="/panier"
            className="inline-flex min-h-11 items-center gap-1 px-1.5 text-[10px] tracking-[0.14em] text-[#5c564e] uppercase transition hover:text-[#1c1917]"
            aria-label={`Cart (${cartCount})`}
          >
            Cart
            <span className="tabular-nums text-[#8a8278]">{cartCount}</span>
          </Link>

          <Link
            href="/sajnen"
            className="hidden min-h-11 items-center px-1.5 text-[10px] tracking-[0.14em] text-[#5c564e] uppercase transition hover:text-[#1c1917] md:inline-flex"
            aria-label="Wishlist"
          >
            Wishlist
          </Link>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-[#5c564e] transition hover:text-[#1c1917]"
            aria-expanded={searchOpen}
            aria-controls={searchId}
            aria-label="Search"
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4 4" />
            </svg>
          </button>

          <label className="flex min-h-11 items-center pl-0.5 text-[10px] tracking-[0.12em] text-[#5c564e] uppercase">
            <span className="sr-only">Currency</span>
            <select
              value={currency}
              onChange={(event) =>
                setSelectedCurrency(event.target.value as CurrencyCode)
              }
              className="max-w-[3.75rem] cursor-pointer border-0 bg-transparent py-2 text-[10px] tracking-[0.12em] text-[#5c564e] uppercase outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
              aria-label="Currency"
            >
              {available.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div
        id={searchId}
        hidden={!searchOpen}
        className="border-t border-[#e4dccf] bg-[#f7f3ec]"
      >
        <form
          onSubmit={onSearch}
          className="mx-auto flex max-w-6xl gap-2 px-3 py-3 sm:px-6"
        >
          <input
            name="q"
            type="search"
            placeholder="Search Sejnane or olive wood…"
            className="min-h-11 flex-1 border border-[#ddd4c5] bg-transparent px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
          />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center bg-[#1c1917] px-4 text-[10px] tracking-[0.16em] text-[#f7f3ec] uppercase"
          >
            Search
          </button>
        </form>
      </div>

      <nav
        id={menuId}
        hidden={!menuOpen}
        className="border-t border-[#e4dccf] bg-[#f7f3ec]"
        aria-label="Primary"
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-3 py-3 sm:px-6 sm:py-4">
          {navItems.map((item) => (
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
          {!user ? (
            <li>
              <Link
                href="/signup"
                className="flex min-h-11 items-center py-2 text-sm tracking-[0.08em] text-[#3f3a34] transition hover:text-[#1c1917]"
                onClick={() => setMenuOpen(false)}
              >
                Create account
              </Link>
            </li>
          ) : null}
          {user?.role === "ADMIN" ? (
            <li>
              <Link
                href="/dashboard"
                className="flex min-h-11 items-center py-2 text-sm tracking-[0.08em] text-[#3f3a34] transition hover:text-[#1c1917]"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            </li>
          ) : null}
        </ul>
      </nav>
    </header>
  );
}
