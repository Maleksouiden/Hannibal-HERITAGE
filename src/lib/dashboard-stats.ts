import { isLowStock, isOutOfStock, isSellable } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";
import { formatProductPrice } from "@/lib/product-display";

export type DashboardStat = {
  label: string;
  value: string;
  hint?: string;
  href?: string;
};

export type RecentOrderRow = {
  id: string;
  orderNumber: string;
  fullName: string;
  status: string;
  totalLabel: string;
  createdAt: string;
};

export type DashboardOverview = {
  stats: DashboardStat[];
  recentOrders: RecentOrderRow[];
};

/**
 * Server-side admin KPIs from MySQL via Prisma.
 */
export async function getDashboardOverview(): Promise<DashboardOverview> {
  const [
    products,
    categoryCount,
    userGroups,
    orderCount,
    paidAgg,
    recentOrders,
  ] = await Promise.all([
    prisma.product.findMany({
      where: { isArchived: false },
      select: {
        stock: true,
        vendingEnabled: true,
        lowStockThreshold: true,
        isPublished: true,
        catalog: true,
      },
    }),
    prisma.category.count(),
    prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
    }),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { subtotalMinorTnd: true },
      _count: { _all: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        fullName: true,
        status: true,
        subtotalMinorTnd: true,
        createdAt: true,
      },
    }),
  ]);

  const published = products.filter((p) => p.isPublished).length;
  const sellable = products.filter((p) => isSellable(p) && p.isPublished).length;
  const lowStock = products.filter((p) => isLowStock(p)).length;
  const outOfStock = products.filter((p) => isOutOfStock(p)).length;
  const sajnen = products.filter((p) => p.catalog === "SAJNEN").length;
  const olive = products.filter((p) => p.catalog === "OLIVE_WOOD").length;

  const customers =
    userGroups.find((g) => g.role === "CUSTOMER")?._count._all ?? 0;
  const admins = userGroups.find((g) => g.role === "ADMIN")?._count._all ?? 0;
  const revenueMinor = paidAgg._sum.subtotalMinorTnd ?? 0;
  const openOrders = paidAgg._count._all;

  const stats: DashboardStat[] = [
    {
      label: "Products",
      value: String(products.length),
      hint: `${sajnen} Sejnane · ${olive} olive wood`,
      href: "/dashboard/products",
    },
    {
      label: "Published",
      value: String(published),
      hint: "Live on the storefront",
      href: "/dashboard/products",
    },
    {
      label: "Sellable",
      value: String(sellable),
      hint: "Published, vending on, in stock",
      href: "/dashboard/inventory",
    },
    {
      label: "Low stock",
      value: String(lowStock),
      hint: "At or below threshold",
      href: "/dashboard/inventory",
    },
    {
      label: "Out of stock",
      value: String(outOfStock),
      hint: "Stock at zero",
      href: "/dashboard/inventory",
    },
    {
      label: "Categories",
      value: String(categoryCount),
      hint: "Catalog groupings",
    },
    {
      label: "Customers",
      value: String(customers),
      hint: `${admins} admin${admins === 1 ? "" : "s"}`,
    },
    {
      label: "Orders",
      value: String(orderCount),
      hint: `${openOrders} not cancelled`,
      href: "/dashboard/orders",
    },
    {
      label: "Revenue (TND)",
      value: formatProductPrice(revenueMinor, "TND"),
      hint: "Non-cancelled order subtotals",
      href: "/dashboard/orders",
    },
  ];

  return {
    stats,
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      fullName: order.fullName,
      status: order.status.replaceAll("_", " "),
      totalLabel: formatProductPrice(order.subtotalMinorTnd, "TND"),
      createdAt: order.createdAt.toISOString().slice(0, 10),
    })),
  };
}
