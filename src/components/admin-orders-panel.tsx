"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatProductPrice } from "@/lib/product-display";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  email: string;
  fullName: string;
  status: string;
  subtotalMinorTnd: number;
  createdAt: string;
  itemCount: number;
};

type AdminOrdersPanelProps = {
  orders: AdminOrderListItem[];
};

export function AdminOrdersPanel({ orders }: AdminOrdersPanelProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(q) ||
        order.email.toLowerCase().includes(q) ||
        order.fullName.toLowerCase().includes(q) ||
        order.status.toLowerCase().includes(q),
    );
  }, [orders, query]);

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-[11px] tracking-[0.14em] text-[#6f675c] uppercase">
        Search orders
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Order number, email, name…"
          className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 text-sm tracking-normal text-[#1c1917] normal-case outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
        />
      </label>

      <p className="text-xs text-[#8a8278]">
        {filtered.length} of {orders.length} orders
      </p>

      {filtered.length === 0 ? (
        <p className="border-t border-[#ddd4c5]/80 pt-4 text-sm text-[#5c564e]">
          {orders.length === 0
            ? "No checkout orders yet."
            : "No orders match this search."}
        </p>
      ) : (
        <ul className="divide-y divide-[#ddd4c5]/80 border-t border-[#ddd4c5]/80">
          {filtered.map((order) => (
            <li
              key={order.id}
              className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1c1917]">
                  {order.orderNumber}
                </p>
                <p className="mt-0.5 truncate text-sm text-[#5c564e]">
                  {order.fullName} · {order.email}
                </p>
                <p className="mt-1 text-[11px] tracking-[0.1em] text-[#8a8278] uppercase">
                  {order.status.replaceAll("_", " ")} · {order.createdAt.slice(0, 10)} ·{" "}
                  {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold tabular-nums">
                  {formatProductPrice(order.subtotalMinorTnd, "TND")}
                </p>
                <Link
                  href={`/commande/${order.id}`}
                  className="text-xs tracking-[0.12em] text-[#5c564e] uppercase hover:text-[#1c1917]"
                >
                  View →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
