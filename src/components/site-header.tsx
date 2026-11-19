"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
 * The bar is transparent at the top and gains a white surface after scrolling.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openPanel, setOpenPanel] = useState<{
    pathname: string;
    panel: "menu" | "search" | null;
  }>({ pathname: "", panel: null });
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

  const menuOpen =
    openPanel.pathname === pathname && openPanel.panel === "menu";
  const searchOpen =
    openPanel.pathname === pathname && openPanel.panel === "search";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPanel({ pathname, panel: null });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, pathname]);

  const navItems = useMemo(
    () => NAV_ITEMS.filter((item) => menuFlags[item.flag]),
    [menuFlags],
  );

  async function handleLogout() {
    await logout();
    closePanels();
    router.refresh();
  }

  function togglePanel(panel: "menu" | "search") {
    setOpenPanel((current) => ({
      pathname,
      panel:
        current.pathname === pathname && current.panel === panel
          ? null
          : panel,
    }));
  }

  function closePanels() {
    setOpenPanel({ pathname, panel: null });
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get("q") ?? "")
      .trim()
      .toLowerCase();
    closePanels();
    if (q.includes("olive")) {
      router.push("/olive-wood");
      return;
    }
    router.push("/sajnen");
  }

  const solid = scrolled || menuOpen || searchOpen;
  const lightChrome = pathname === "/" && !solid;
  const ink = lightChrome
    ? "text-white/90 hover:text-white"
    : "text-[#3f3a34] hover:text-[#1c1917]";
  const inkMuted = lightChrome ? "text-white/75" : "text-[#8a8278]";
  const menuInk = ink;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,box-shadow] duration-300 ${
        solid
          ? "border-[#e8e4dc] bg-white/96 shadow-[0_2px_16px_rgba(28,25,23,0.06)]"
          : "border-transparent bg-transparent shadow-none"
      }`}
    >
      <div className="mx-auto grid h-16 max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center gap-1 px-2 sm:h-20 sm:gap-4 sm:px-8">
        <div className="flex min-w-0 items-center justify-self-start">
          <button
            type="button"
            className={`inline-flex min-h-11 items-center gap-2.5 px-1 text-[10px] tracking-[0.18em] uppercase transition md:px-2 ${menuInk}`}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => togglePanel("menu")}
          >
            <span aria-hidden className="flex w-5 flex-col gap-[5px]">
              <span
                className={`block h-px bg-current transition-transform ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px bg-current transition-opacity ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px bg-current transition-transform ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
            <span className="hidden md:inline">Menu</span>
          </button>
          {user ? (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className={`inline-flex min-h-11 min-w-7 max-[360px]:min-w-6 items-center justify-center transition md:hidden ${ink}`}
              aria-label="Logout"
            >
              <AccountIcon />
            </button>
          ) : (
            <Link
              href="/login"
              className={`inline-flex min-h-11 min-w-7 max-[360px]:min-w-6 items-center justify-center transition md:hidden ${ink}`}
              aria-label="Account"
            >
              <AccountIcon />
            </Link>
          )}
        </div>

        <Link
          href="/"
          className="group flex flex-col items-center justify-self-center px-0 text-center md:px-1"
        >
          <span
            className={`font-serif text-sm leading-none font-medium tracking-[0.1em] uppercase max-[360px]:text-[13px] max-[360px]:tracking-[0.08em] md:text-2xl md:tracking-[0.14em] ${
              lightChrome ? "text-white" : "text-[#1c1917]"
            }`}
          >
            Hannibal
          </span>
          <span
            className={`mt-1 text-[7px] leading-none tracking-[0.36em] uppercase md:text-[9px] md:tracking-[0.44em] ${
              lightChrome ? "text-white/75" : "text-[#756b5d]"
            }`}
          >
            Heritage
          </span>
        </Link>

        <div className="flex min-w-0 items-center justify-self-end gap-0 md:gap-1.5">
          {user?.role === "ADMIN" ? (
            <Link
              href="/dashboard"
              className={`hidden min-h-11 items-center px-2 text-[10px] tracking-[0.14em] uppercase transition lg:inline-flex ${ink}`}
            >
              Dashboard
            </Link>
          ) : null}

          {user ? (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className={`hidden min-h-11 min-w-10 items-center justify-center transition md:inline-flex ${ink}`}
              aria-label="Logout"
            >
              <AccountIcon />
            </button>
          ) : (
            <Link
              href="/login"
              className={`hidden min-h-11 min-w-10 items-center justify-center transition md:inline-flex ${ink}`}
              aria-label="Account"
            >
              <AccountIcon />
            </Link>
          )}

          <Link
            href="/panier"
            className={`relative inline-flex min-h-11 min-w-7 max-[360px]:min-w-6 items-center justify-center transition md:min-w-10 ${ink}`}
            aria-label={`Cart (${cartCount})`}
          >
            <BagIcon />
            <span className={`absolute top-0.5 right-0 text-[9px] tabular-nums ${inkMuted}`}>
              {cartCount}
            </span>
          </Link>

          <Link
            href="/sajnen"
            className={`inline-flex min-h-11 min-w-7 max-[360px]:min-w-6 items-center justify-center transition md:min-w-10 ${ink}`}
            aria-label="Wishlist"
          >
            <HeartIcon />
          </Link>

          <button
            type="button"
            className={`inline-flex min-h-11 min-w-7 max-[360px]:min-w-6 items-center justify-center transition md:min-w-10 ${ink}`}
            aria-expanded={searchOpen}
            aria-controls={searchId}
            aria-label="Search"
            onClick={() => togglePanel("search")}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-[19px] sm:size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4 4" />
            </svg>
          </button>

          <label className="flex min-h-11 items-center text-[8px] tracking-[0.04em] uppercase md:text-[10px] md:tracking-[0.12em]">
            <span className="sr-only">Currency</span>
            <select
              value={currency}
              onChange={(event) =>
                setSelectedCurrency(event.target.value as CurrencyCode)
              }
              className={`max-w-[2.5rem] max-[360px]:max-w-[2rem] cursor-pointer border-0 bg-transparent py-2 text-[8px] max-[360px]:text-[7px] tracking-[0.04em] uppercase outline-none focus-visible:ring-1 focus-visible:ring-[#9b7653] md:max-w-[3.5rem] md:text-[10px] md:tracking-[0.1em] ${
                lightChrome ? "text-white" : "text-[#3f3a34]"
              }`}
              aria-label="Currency"
            >
              {available.map((code) => (
                <option key={code} value={code} className="text-[#1c1917]">
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
        className="border-t border-[#e8e8e5] bg-white"
      >
        <form
          onSubmit={onSearch}
          className="mx-auto flex max-w-6xl gap-2 px-3 py-4 sm:px-6"
        >
          <input
            name="q"
            type="search"
            placeholder="Search Sejnane or olive wood…"
            className="min-h-12 flex-1 border border-[#ddd4c5] bg-[#faf9f6] px-4 text-sm text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#9b7653]"
          />
          <button
            type="submit"
            className="inline-flex min-h-12 items-center bg-[#1c1917] px-5 text-[10px] tracking-[0.16em] text-[#f7f3ec] uppercase transition hover:bg-[#45382d]"
          >
            Search
          </button>
        </form>
      </div>

      {menuOpen ? (
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[60]"
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 size-full cursor-default bg-black/55"
            onClick={closePanels}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(26rem,88vw)] flex-col border-r border-white/10 bg-[#211e1a] px-6 pt-[calc(env(safe-area-inset-top,0px)_+_1.5rem)] pb-[calc(env(safe-area-inset-bottom,0px)_+_1.5rem)] text-[#f7f3ec] shadow-[12px_0_40px_rgba(0,0,0,0.2)] sm:px-10">
            <div className="flex items-start justify-between border-b border-white/15 pb-6">
              <Link
                href="/"
                onClick={closePanels}
                className="flex flex-col"
              >
                <span className="font-serif text-xl tracking-[0.14em] uppercase">
                  Hannibal
                </span>
                <span className="mt-1 text-[9px] tracking-[0.44em] text-white/65 uppercase">
                  Heritage
                </span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={closePanels}
                className="inline-flex size-11 -mr-2 -mt-2 items-center justify-center text-white/75 transition hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <p className="mt-8 mb-3 text-[10px] tracking-[0.2em] text-white/50 uppercase">
              Explore Hannibal Heritage
            </p>
            <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="Primary">
              <ul>
                {navItems.map((item) => (
                  <li key={item.href} className="border-b border-white/10">
                    <Link
                      href={item.href}
                      className="flex min-h-14 items-center justify-between gap-4 py-3 text-sm tracking-[0.11em] text-white/90 uppercase transition hover:pl-1 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
                      onClick={closePanels}
                      aria-current={
                        pathname === item.href ? "page" : undefined
                      }
                    >
                      {item.label}
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4 shrink-0 text-white/45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                ))}
                {!user ? (
                  <li className="border-b border-white/10">
                    <Link
                      href="/signup"
                      className="flex min-h-14 items-center justify-between gap-4 py-3 text-sm tracking-[0.11em] text-white/90 uppercase transition hover:pl-1 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
                      onClick={closePanels}
                    >
                      Create account
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4 shrink-0 text-white/45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                ) : null}
                {user?.role === "ADMIN" ? (
                  <li className="border-b border-white/10">
                    <Link
                      href="/dashboard"
                      className="flex min-h-14 items-center justify-between gap-4 py-3 text-sm tracking-[0.11em] text-white/90 uppercase transition hover:pl-1 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
                      onClick={closePanels}
                    >
                      Dashboard
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4 shrink-0 text-white/45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>

            <div className="mt-auto border-t border-white/15 pt-5">
              <p className="text-[9px] tracking-[0.18em] text-white/50 uppercase">
                Sejnane · Tunisia
              </p>
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    closePanels();
                    void handleLogout();
                  }}
                  className="mt-4 text-xs tracking-[0.12em] text-white/80 uppercase underline decoration-white/35 underline-offset-4 transition hover:text-white"
                >
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function AccountIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 sm:size-[22px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 sm:size-[22px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M5 8h14l-1 13H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 sm:size-[22px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M20.5 8.8c0 5.2-8.5 10.3-8.5 10.3S3.5 14 3.5 8.8a4.4 4.4 0 0 1 8.5-1.6 4.4 4.4 0 0 1 8.5 1.6z" />
    </svg>
  );
}
