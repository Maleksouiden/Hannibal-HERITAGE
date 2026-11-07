import { listOrders, type OrderRecord } from "@/lib/orders";
import { ensureDbRuntime, prisma } from "@/lib/prisma";
import { formatProductPrice } from "@/lib/product-display";

export type AdminUserRow = {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: string;
  orderCount: number;
  orderTotalLabel: string;
};

export type AdminUserOrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  totalLabel: string;
  createdAt: string;
  itemCount: number;
};

function orderTotalLabel(order: OrderRecord): string {
  return formatProductPrice(order.subtotalMinorTnd, "TND");
}

export async function listAdminUsers(): Promise<AdminUserRow[]> {
  await ensureDbRuntime();
  const [users, orders] = await Promise.all([
    prisma.user.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    }),
    listOrders(),
  ]);

  const byEmail = new Map<string, OrderRecord[]>();
  for (const order of orders) {
    const key = order.email.toLowerCase();
    const bucket = byEmail.get(key) ?? [];
    bucket.push(order);
    byEmail.set(key, bucket);
  }

  return users.map((user) => {
    const userOrders = byEmail.get(user.email.toLowerCase()) ?? [];
    const totalMinor = userOrders.reduce(
      (sum, order) => sum + order.subtotalMinorTnd,
      0,
    );
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt.toISOString().slice(0, 10),
      orderCount: userOrders.length,
      orderTotalLabel: formatProductPrice(totalMinor, "TND"),
    };
  });
}

export async function getAdminUserDetail(id: string): Promise<{
  user: AdminUserRow;
  orders: AdminUserOrderRow[];
} | null> {
  await ensureDbRuntime();
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) return null;

  const orders = await listOrders();
  const userOrders = orders.filter(
    (order) => order.email.toLowerCase() === user.email.toLowerCase(),
  );
  const totalMinor = userOrders.reduce(
    (sum, order) => sum + order.subtotalMinorTnd,
    0,
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt.toISOString().slice(0, 10),
      orderCount: userOrders.length,
      orderTotalLabel: formatProductPrice(totalMinor, "TND"),
    },
    orders: userOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status.replaceAll("_", " "),
      totalLabel: orderTotalLabel(order),
      createdAt: order.createdAt.slice(0, 10),
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    })),
  };
}
