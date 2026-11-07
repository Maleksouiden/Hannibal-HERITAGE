import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { CurrencyCode } from "@/lib/currency-codes";
import { getOrderById } from "@/lib/orders";

type PageProps = {
  params: Promise<{ id: string }>;
};

/** Order ids are request-time; allow blocking under cacheComponents. */
export const instant = false;

function formatMoney(amount: number, currency: CurrencyCode): string {
  const fractionDigits = currency === "JPY" ? 0 : currency === "TND" ? 3 : 2;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return { title: "Order | Hannibal HERITAGE" };
  return { title: `Order ${order.orderNumber} | Hannibal HERITAGE` };
}

async function OrderConfirmationContent({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-16">
      <header className="flex flex-col gap-3">
        <p className="text-xs tracking-[0.22em] text-[#8a8278] uppercase">
          Confirmation
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Thank you
        </h1>
        <p className="text-sm leading-6 text-[#5c564e] sm:text-base sm:leading-7">
          Order <span className="text-[#1c1917]">{order.orderNumber}</span> is
          recorded. Payment is stubbed for now — invoicing comes later.
        </p>
      </header>

      <section className="flex flex-col gap-2 border-t border-[#ddd4c5]/70 pt-6 text-sm text-[#5c564e]">
        <h2 className="text-xs tracking-[0.16em] text-[#8a8278] uppercase">
          Contact
        </h2>
        <p className="text-[#1c1917]">{order.fullName}</p>
        <p>{order.email}</p>
        {order.phone ? <p>{order.phone}</p> : null}
      </section>

      <section className="flex flex-col gap-2 border-t border-[#ddd4c5]/70 pt-6 text-sm text-[#5c564e]">
        <h2 className="text-xs tracking-[0.16em] text-[#8a8278] uppercase">
          Shipping
        </h2>
        <p className="text-[#1c1917]">{order.shippingLine1}</p>
        {order.shippingLine2 ? <p>{order.shippingLine2}</p> : null}
        <p>
          {order.shippingPostalCode} {order.shippingCity}
        </p>
        <p>{order.shippingCountry}</p>
      </section>

      <section className="flex flex-col gap-3 border-t border-[#ddd4c5]/70 pt-6">
        <h2 className="text-xs tracking-[0.16em] text-[#8a8278] uppercase">
          Items
        </h2>
        <ul className="flex flex-col gap-2 text-sm text-[#5c564e]">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="tabular-nums text-[#1c1917]">
                {formatMoney(item.lineTotalMinorTnd / 1000, "TND")}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-baseline justify-between border-t border-[#ddd4c5]/70 pt-4">
          <span className="text-xs tracking-[0.16em] text-[#5c564e] uppercase">
            Total ({order.displayCurrency})
          </span>
          <span className="text-lg tabular-nums text-[#1c1917]">
            {formatMoney(
              order.subtotalDisplay,
              order.displayCurrency as CurrencyCode,
            )}
          </span>
        </div>
        <p className="text-xs text-[#8a8278]">
          Catalog subtotal {formatMoney(order.subtotalMinorTnd / 1000, "TND")} ·
          payment status: {order.paymentStatus}
        </p>
      </section>

      <Link
        href="/"
        className="mt-4 inline-flex w-fit text-xs tracking-[0.16em] text-[#5c564e] uppercase hover:text-[#1c1917]"
      >
        ← Continue shopping
      </Link>
    </main>
  );
}

export default function OrderConfirmationPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl flex-1 px-4 py-16">
          <div className="h-40 animate-pulse rounded-sm bg-[#ebe4d8]/70" />
        </main>
      }
    >
      <OrderConfirmationContent params={params} />
    </Suspense>
  );
}
