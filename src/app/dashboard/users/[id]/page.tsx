import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAdminUserDetail } from "@/lib/admin-users";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function UserDetailContent({ params }: PageProps) {
  const { id } = await params;
  const detail = await getAdminUserDetail(id);
  if (!detail) notFound();
  const { user, orders } = detail;

  return (
    <>
      <header className="flex flex-col gap-2 border-b border-[#ddd4c5]/80 pb-6">
        <p className="text-[11px] tracking-[0.18em] text-[#8a8278] uppercase">
          {user.role}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {user.fullName}
        </h2>
        <p className="text-sm text-[#5c564e]">{user.email}</p>
        <p className="text-xs tracking-[0.1em] text-[#8a8278] uppercase">
          Joined {user.createdAt} · {user.orderCount} order
          {user.orderCount === 1 ? "" : "s"} · {user.orderTotalLabel}
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold tracking-tight">Commandes</h3>
        {orders.length === 0 ? (
          <p className="text-sm text-[#5c564e]">
            No checkout orders found for this email yet.
          </p>
        ) : (
          <ul className="divide-y divide-[#ddd4c5]/80 border-t border-[#ddd4c5]/80">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1c1917]">
                    {order.orderNumber}
                  </p>
                  <p className="mt-0.5 text-[11px] tracking-[0.1em] text-[#8a8278] uppercase">
                    {order.status} · {order.createdAt} · {order.itemCount}{" "}
                    item{order.itemCount === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold tabular-nums">
                    {order.totalLabel}
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
      </section>
    </>
  );
}

export default function DashboardUserDetailPage({ params }: PageProps) {
  return (
    <main className="flex flex-col gap-8">
      <Link
        href="/dashboard/users"
        className="w-fit text-xs tracking-[0.14em] text-[#5c564e] uppercase hover:text-[#1c1917]"
      >
        ← Users
      </Link>
      <Suspense
        fallback={
          <div className="h-40 animate-pulse rounded-sm bg-[#ebe4d8]/70" />
        }
      >
        <UserDetailContent params={params} />
      </Suspense>
    </main>
  );
}
