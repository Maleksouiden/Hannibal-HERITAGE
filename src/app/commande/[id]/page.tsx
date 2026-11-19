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
  return new Intl.NumberFormat("fr-TN", {
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
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-14">
      <header className="border border-[#e9e3d9] bg-[#f7f3ec] px-5 py-8 sm:px-10 sm:py-12">
        <p className="flex items-center gap-3 text-[10px] tracking-[0.22em] text-[#756b5d] uppercase">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#293126] text-white" aria-hidden>
            ✓
          </span>
          Order received
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-none font-medium tracking-tight sm:text-6xl">
          Thank you
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5c564e] sm:text-base sm:leading-8">
          Your order <span className="font-medium text-[#1c1917]">{order.orderNumber}</span> has been recorded. Thank you for supporting Tunisian craftsmanship.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <section className="flex flex-col gap-2 border border-[#e9e3d9] bg-white p-5 sm:p-6">
              <h2 className="text-[10px] tracking-[0.18em] text-[#8a8278] uppercase">
                Contact
              </h2>
              <p className="mt-1 text-sm font-medium text-[#1c1917]">{order.fullName}</p>
              <p className="text-sm text-[#5c564e]">{order.email}</p>
              {order.phone ? <p className="text-sm text-[#5c564e]">{order.phone}</p> : null}
            </section>

            <section className="flex flex-col gap-2 border border-[#e9e3d9] bg-white p-5 sm:p-6">
              <h2 className="text-[10px] tracking-[0.18em] text-[#8a8278] uppercase">
                Delivery address
              </h2>
              <p className="mt-1 text-sm font-medium text-[#1c1917]">{order.shippingLine1}</p>
              {order.shippingLine2 ? <p className="text-sm text-[#5c564e]">{order.shippingLine2}</p> : null}
              <p className="text-sm text-[#5c564e]">
                {order.shippingPostalCode} {order.shippingCity}
              </p>
              <p className="text-sm text-[#5c564e]">{order.shippingCountry}</p>
            </section>
          </div>

          <section className="flex flex-col gap-4 border border-[#e9e3d9] bg-white p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4 border-b border-[#eee9e1] pb-4">
              <div>
                <p className="text-[10px] tracking-[0.18em] text-[#8a8278] uppercase">
                  Made with care
                </p>
                <h2 className="mt-1 font-serif text-2xl font-medium text-[#1c1917]">
                  Your pieces
                </h2>
              </div>
              <span className="text-xs text-[#8a8278]">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <ul className="flex flex-col gap-3 text-sm text-[#5c564e]">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 tabular-nums text-[#1c1917]">
                    {formatMoney(item.lineTotalMinorTnd / 1000, "TND")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex h-fit flex-col gap-4 border border-[#e9e3d9] bg-[#f7f3ec] p-5 sm:p-7">
          <p className="text-[10px] tracking-[0.18em] text-[#756b5d] uppercase">
            Order summary
          </p>
          <div>
            <p className="text-xs text-[#8a8278]">Order number</p>
            <p className="mt-1 text-sm font-medium text-[#1c1917]">
              {order.orderNumber}
            </p>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-[#ded5c8] pt-4">
            <span className="text-xs tracking-[0.12em] text-[#5c564e] uppercase">
              Total ({order.displayCurrency})
            </span>
            <span className="text-lg font-medium tabular-nums text-[#1c1917]">
              {formatMoney(
                order.subtotalDisplay,
                order.displayCurrency as CurrencyCode,
              )}
            </span>
          </div>
          <p className="text-xs leading-5 text-[#756b5d]">
            Catalog subtotal {formatMoney(order.subtotalMinorTnd / 1000, "TND")}.
            Payment is not active yet; this order has been recorded.
          </p>
          <p className="text-[10px] tracking-[0.12em] text-[#8a8278] uppercase">
            Status: {order.paymentStatus}
          </p>
        </aside>
      </div>

      <Link
        href="/"
        className="mt-2 inline-flex min-h-11 w-fit items-center gap-3 bg-[#293126] px-5 text-[10px] tracking-[0.16em] text-white uppercase transition hover:bg-[#3b4736]"
      >
        Continue shopping <span aria-hidden>→</span>
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
