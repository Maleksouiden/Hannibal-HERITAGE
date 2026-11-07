import Link from "next/link";
import { getDashboardOverview } from "@/lib/dashboard-stats";

export default async function DashboardHomePage() {
  const { stats, recentOrders } = await getDashboardOverview();

  return (
    <main className="flex flex-col gap-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Overview
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e] sm:text-base sm:leading-7">
          Live figures from MySQL — catalog health, accounts, and orders.
        </p>
      </header>

      <section aria-label="Key metrics">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const body = (
              <>
                <p className="text-[11px] tracking-[0.16em] text-[#8a8278] uppercase">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-[#1c1917] sm:text-3xl">
                  {stat.value}
                </p>
                {stat.hint ? (
                  <p className="mt-1 text-xs leading-5 text-[#6f675c]">
                    {stat.hint}
                  </p>
                ) : null}
              </>
            );

            return (
              <li key={stat.label} className="min-w-0 border-t border-[#ddd4c5]/90 pt-4">
                {stat.href ? (
                  <Link
                    href={stat.href}
                    className="block transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
                  >
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="Recent orders" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight">
            Recent orders
          </h3>
          <Link
            href="/dashboard/orders"
            className="text-[11px] tracking-[0.14em] text-[#5c564e] uppercase transition hover:text-[#1c1917]"
          >
            All orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="border-t border-[#ddd4c5]/90 pt-4 text-sm text-[#5c564e]">
            No orders in MySQL yet. Checkout still writes the file store until
            orders are migrated; product and inventory figures above are live.
          </p>
        ) : (
          <ul className="divide-y divide-[#ddd4c5]/80 border-t border-[#ddd4c5]/90">
            {recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#1c1917]">
                    {order.orderNumber}
                    <span className="font-normal text-[#8a8278]">
                      {" "}
                      · {order.fullName}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs tracking-[0.08em] text-[#8a8278] uppercase">
                    {order.status} · {order.createdAt}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-[#1c1917]">
                  {order.totalLabel}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
