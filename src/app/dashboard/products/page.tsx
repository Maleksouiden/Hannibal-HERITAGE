import { AdminProductList } from "@/components/admin-product-list";
import {
  adminProductInclude,
  serializeAdminProduct,
} from "@/lib/admin-products";
import { ensureDbRuntime, prisma } from "@/lib/prisma";

export default async function DashboardProductsPage() {
  await ensureDbRuntime();
  const rows = await prisma.product.findMany({
    include: adminProductInclude,
    orderBy: [{ isArchived: "asc" }, { updatedAt: "desc" }],
  });
  const products = rows.map(serializeAdminProduct);

  return (
    <main className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Products
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e] sm:text-base">
          Create, edit, publish, and archive catalog products. Storefront only
          shows published, non-archived items from MySQL.
        </p>
      </header>
      <AdminProductList products={products} />
    </main>
  );
}
