"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV: Array<{ href: string; label: string; exact?: boolean }> = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/inventory", label: "Inventory / vending" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/site", label: "Site content" },
  { href: "/dashboard/orders", label: "Invoices / orders" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-11 items-center px-3 text-sm tracking-[0.04em] transition ${
              active
                ? "bg-[#1c1917] text-[#f7f3ec]"
                : "text-[#3f3a34] hover:bg-[#ebe4d8]/70 hover:text-[#1c1917]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
