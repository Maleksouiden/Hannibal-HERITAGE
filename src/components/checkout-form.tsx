"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { DisplayPrice } from "@/components/display-price";
import {
  clearCart,
  getCartLines,
  getEmptyCartSnapshot,
  getCartSubtotalMinor,
  subscribeCart,
} from "@/lib/cart-store";
import { useSelectedCurrency } from "@/lib/currency-rates-client";

const FIELD_CLASS =
  "min-h-12 border border-[#e1d9cc] bg-white px-3 py-2 text-base text-[#1c1917] outline-none transition focus:border-[#9b7653] focus:ring-1 focus:ring-[#9b7653]/30 sm:text-sm";

export function CheckoutForm() {
  const router = useRouter();
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
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center border border-[#e9e3d9] bg-[#fbfaf8] px-5 py-14 text-center sm:px-10 sm:py-20">
        <p className="text-[10px] tracking-[0.2em] text-[#8a8278] uppercase">
          Checkout
        </p>
        <h2 className="mt-2 font-serif text-3xl font-medium text-[#1c1917]">
          Your bag is waiting
        </h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-[#5c564e]">
          Add a handcrafted piece to your bag to continue with your order.
        </p>
        <Link
          href="/sajnen"
          className="mt-6 inline-flex min-h-12 items-center gap-3 bg-[#293126] px-5 text-[10px] tracking-[0.16em] text-white uppercase transition hover:bg-[#3b4736]"
        >
          Explore the collections <span aria-hidden>→</span>
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
      router.push(`/commande/${payload.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10"
    >
      <div className="flex flex-col gap-5">
        <section className="flex flex-col gap-4 border border-[#e9e3d9] bg-white p-5 sm:gap-5 sm:p-7">
          <div className="mb-1 flex items-center gap-3 border-b border-[#eee9e1] pb-4">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#f7f3ec] text-[10px] tabular-nums text-[#756b5d]">
              01
            </span>
            <div>
              <h2 className="text-base font-medium text-[#1c1917]">
                Contact details
              </h2>
              <p className="mt-0.5 text-xs text-[#8a8278]">
                Where we can reach you about your order.
              </p>
            </div>
          </div>
          <label className="flex flex-col gap-1.5 text-xs text-[#5c564e]">
            Email address
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className={FIELD_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-[#5c564e]">
            Full name
            <input
              name="fullName"
              type="text"
              required
              autoComplete="name"
              className={FIELD_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-[#5c564e]">
            Phone (optional)
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              className={FIELD_CLASS}
            />
          </label>
        </section>

        <section className="flex flex-col gap-4 border border-[#e9e3d9] bg-white p-5 sm:gap-5 sm:p-7">
          <div className="mb-1 flex items-center gap-3 border-b border-[#eee9e1] pb-4">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#f7f3ec] text-[10px] tabular-nums text-[#756b5d]">
              02
            </span>
            <div>
              <h2 className="text-base font-medium text-[#1c1917]">
                Delivery address
              </h2>
              <p className="mt-0.5 text-xs text-[#8a8278]">
                Add the address for your delivery.
              </p>
            </div>
          </div>
          <label className="flex flex-col gap-1.5 text-xs text-[#5c564e]">
            Address
            <input
              name="shippingLine1"
              type="text"
              required
              autoComplete="address-line1"
              className={FIELD_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-[#5c564e]">
            Apartment, suite, etc. (optional)
            <input
              name="shippingLine2"
              type="text"
              autoComplete="address-line2"
              className={FIELD_CLASS}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-xs text-[#5c564e]">
              City
              <input
                name="shippingCity"
                type="text"
                required
                autoComplete="address-level2"
                className={FIELD_CLASS}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs text-[#5c564e]">
              Postal code
              <input
                name="shippingPostalCode"
                type="text"
                required
                autoComplete="postal-code"
                className={FIELD_CLASS}
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5 text-xs text-[#5c564e]">
            Country
            <input
              name="shippingCountry"
              type="text"
              defaultValue="Tunisia"
              required
              autoComplete="country-name"
              className={FIELD_CLASS}
            />
          </label>
        </section>
      </div>

      <aside className="flex h-fit flex-col gap-4 border border-[#e9e3d9] bg-[#f7f3ec] p-5 sm:p-7 lg:sticky lg:top-28">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-[#756b5d] uppercase">
            Your selection
          </p>
          <h2 className="mt-1 font-serif text-2xl font-medium text-[#1c1917]">
            Order summary
          </h2>
        </div>
        <ul className="flex flex-col gap-3 border-y border-[#ded5c8] py-4 text-sm text-[#5c564e]">
          {lines.map((line) => (
            <li key={`${line.catalog}:${line.slug}`} className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 border border-[#e1d9cc] bg-white">
                <Image
                  src={line.imageSrc}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-xs leading-5 text-[#1c1917]">
                  {line.name}
                </p>
                <p className="mt-0.5 text-[10px] text-[#8a8278]">
                  Qty {line.quantity}
                </p>
              </div>
              <DisplayPrice
                priceMinor={line.priceMinor * line.quantity}
                sourceCurrency="TND"
                className="shrink-0 text-xs tabular-nums text-[#1c1917]"
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
        <p className="text-xs leading-5 text-[#756b5d]">
          Final charged total is recalculated on the server using catalog prices
          and Frankfurter rates ({displayCurrency}). Payment is stubbed.
        </p>
        {error ? (
          <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#293126] px-5 py-3 text-[10px] tracking-[0.18em] text-white uppercase transition hover:bg-[#3b4736] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b7653] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Placing order…" : "Place order"} {!pending ? <span aria-hidden>→</span> : null}
        </button>
        <Link
          href="/panier"
          className="inline-flex min-h-10 items-center text-[10px] tracking-[0.16em] text-[#5c564e] uppercase hover:text-[#1c1917]"
        >
          ← Back to shopping bag
        </Link>
      </aside>
    </form>
  );
}
