import { Suspense } from "react";
import { AdminOrdersPanel } from "@/components/admin-orders-panel";
import { listOrders } from "@/lib/orders";

async function OrdersContent() {
  const orders = await listOrders();
  return (
    <AdminOrdersPanel
      orders={orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        email: order.email,
        fullName: order.fullName,
        status: order.status,
        subtotalMinorTnd: order.subtotalMinorTnd,
        createdAt: order.createdAt,
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      }))}
    />
  );
}

export default function DashboardOrdersPage() {
  return (
    <main className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Invoices / orders
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e] sm:text-base">
          Checkout commandes from the file store — search by customer or order
          number. Per-user views live under Users.
        </p>
      </header>
      <Suspense
        fallback={
          <div className="h-40 animate-pulse rounded-sm bg-[#ebe4d8]/70" />
        }
      >
        <OrdersContent />
      </Suspense>
    </main>
  );
}
