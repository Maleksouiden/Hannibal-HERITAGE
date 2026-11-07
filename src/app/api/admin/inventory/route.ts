import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { isLowStock, isOutOfStock, sellabilityLabel } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const products = await prisma.product.findMany({
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

  return NextResponse.json({
    products: products.map((product) => ({
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
    })),
  });
}
