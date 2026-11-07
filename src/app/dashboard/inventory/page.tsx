import { AdminInventoryTable } from "@/components/admin-inventory-table";
import { isLowStock, isOutOfStock, sellabilityLabel } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export default async function DashboardInventoryPage() {
  const rows = await prisma.product.findMany({
    where: { isArchived: false },
    orderBy: [{ catalog: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      catalog: true,
      stock: true,
      vendingEnabled: true,
      lowStockThreshold: true,
      isPublished: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { url: true },
      },
    },
  });

  const products = rows.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    catalog: product.catalog,
    stock: product.stock,
    vendingEnabled: product.vendingEnabled,
    lowStockThreshold: product.lowStockThreshold,
    isPublished: product.isPublished,
    imageUrl: product.images[0]?.url ?? null,
    lowStock: isLowStock(product),
    outOfStock: isOutOfStock(product),
    statusLabel: sellabilityLabel(product),
  }));

  return (
    <main className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Inventory / vending
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e] sm:text-base">
          Set stock, toggle vending, and watch low-stock flags. Out-of-stock or
          vending-off products stay browseable when published but cannot be
          added to the panier or checked out.
        </p>
      </header>
      <AdminInventoryTable initialProducts={products} />
    </main>
  );
}
