"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { DisplayPrice } from "@/components/display-price";
import {
  clearCart,
  getCartLines,
  getCartSubtotalMinor,
  subscribeCart,
} from "@/lib/cart-store";
import { useSelectedCurrency } from "@/lib/currency-rates-client";

export function CheckoutForm() {
  const lines = useSyncExternalStore(subscribeCart, getCartLines, () => []);
  const subtotalMinor = useSyncExternalStore(
    subscribeCart,
    getCartSubtotalMinor,
    () => 0,
  );
  const displayCurrency = useSelectedCurrency();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemPayload = useMemo(
    () =>
      lines.map((line) => ({
        catalog: line.catalog,
        slug: line.slug,
        quantity: line.quantity,
      })),
    [lines],
  );

  if (lines.length === 0) {
    return (
      <div className="flex max-w-lg flex-col gap-4">
        <p className="text-base text-[#5c564e]">
          Your panier is empty. Add items before checkout.
        </p>
        <Link
          href="/panier"
          className="text-xs tracking-[0.14em] text-[#5c564e] uppercase hover:text-[#1c1917]"
        >
          ← Back to panier
        </Link>
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          fullName: String(form.get("fullName") ?? ""),
          phone: String(form.get("phone") ?? ""),
          shippingLine1: String(form.get("shippingLine1") ?? ""),
          shippingLine2: String(form.get("shippingLine2") ?? ""),
          shippingCity: String(form.get("shippingCity") ?? ""),
          shippingPostalCode: String(form.get("shippingPostalCode") ?? ""),
          shippingCountry: String(form.get("shippingCountry") ?? "Tunisia"),
          displayCurrency,
          items: itemPayload,
        }),
      });
      const payload = (await response.json()) as {
        order?: { id: string };
        error?: string;
      };
      if (!response.ok || !payload.order) {
        throw new Error(payload.error ?? "Checkout failed");
      }
      clearCart();
      window.location.href = `/commande/${payload.order.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12"
    >
      <div className="flex flex-col gap-8 sm:gap-10">
        <section className="flex flex-col gap-4">
          <h2 className="text-sm tracking-[0.16em] text-[#8a8278] uppercase">
            Contact
          </h2>
          <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
            Full name
            <input
              name="fullName"
              type="text"
              required
              autoComplete="name"
              className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
            Phone (optional)
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm"
            />
          </label>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm tracking-[0.16em] text-[#8a8278] uppercase">
            Shipping
          </h2>
          <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
            Address
            <input
              name="shippingLine1"
              type="text"
              required
              autoComplete="address-line1"
              className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
            Address line 2
            <input
              name="shippingLine2"
              type="text"
              autoComplete="address-line2"
              className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
              City
              <input
                name="shippingCity"
                type="text"
                required
                autoComplete="address-level2"
                className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
              Postal code
              <input
                name="shippingPostalCode"
                type="text"
                required
                autoComplete="postal-code"
                className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
            Country
            <input
              name="shippingCountry"
              type="text"
              defaultValue="Tunisia"
              required
              autoComplete="country-name"
              className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm"
            />
          </label>
        </section>
      </div>

      <aside className="flex flex-col gap-4 border-t border-[#ddd4c5]/70 pt-6 lg:border-t-0 lg:pt-0">
        <h2 className="text-sm tracking-[0.16em] text-[#8a8278] uppercase">
          Order summary
        </h2>
        <ul className="flex flex-col gap-3 text-sm text-[#5c564e]">
          {lines.map((line) => (
            <li key={`${line.catalog}:${line.slug}`} className="flex justify-between gap-3">
              <span>
                {line.name} × {line.quantity}
              </span>
              <DisplayPrice
                priceMinor={line.priceMinor * line.quantity}
                sourceCurrency="TND"
                className="tabular-nums text-[#1c1917]"
              />
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between border-t border-[#ddd4c5]/70 pt-4">
          <span className="text-xs tracking-[0.16em] text-[#5c564e] uppercase">
            Total
          </span>
          <DisplayPrice
            priceMinor={subtotalMinor}
            sourceCurrency="TND"
            className="text-lg tabular-nums text-[#1c1917]"
          />
        </div>
        <p className="text-xs leading-5 text-[#8a8278]">
          Final charged total is recalculated on the server using catalog prices
          and Frankfurter rates ({displayCurrency}). Payment is stubbed.
        </p>
        {error ? <p className="text-sm text-red-800">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 w-full items-center justify-center border border-[#1c1917] bg-[#1c1917] px-5 py-3 text-xs tracking-[0.16em] text-[#f7f3ec] uppercase transition hover:bg-transparent hover:text-[#1c1917] disabled:opacity-50"
        >
          {pending ? "Placing order…" : "Place order"}
        </button>
        <Link
          href="/panier"
          className="text-xs tracking-[0.14em] text-[#5c564e] uppercase hover:text-[#1c1917]"
        >
          ← Back to panier
        </Link>
      </aside>
    </form>
  );
}
