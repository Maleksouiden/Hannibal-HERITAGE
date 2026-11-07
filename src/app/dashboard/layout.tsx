import type { Metadata } from "next";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";
import { requireAdminPage } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard | Hannibal HERITAGE",
  description: "Admin dashboard for Hannibal HERITAGE.",
};

/** Admin shell uses cookies + Prisma; allow blocking under cacheComponents. */
export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminPage("/dashboard");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
      <aside className="flex flex-col gap-6 border-b border-[#ddd4c5]/70 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
        <div>
          <p className="text-xs tracking-[0.22em] text-[#8a8278] uppercase">
            Admin
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-[#5c564e]">{admin.fullName}</p>
        </div>
        <DashboardNav />
        <Link
          href="/"
          className="text-xs tracking-[0.14em] text-[#5c564e] uppercase hover:text-[#1c1917]"
        >
          ← Storefront
        </Link>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
