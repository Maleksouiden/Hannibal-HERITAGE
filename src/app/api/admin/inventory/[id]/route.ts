import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { isLowStock, isOutOfStock, sellabilityLabel } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

type PatchBody = {
  stock?: number;
  vendingEnabled?: boolean;
  lowStockThreshold?: number;
};

export async function PATCH(request: Request, context: Ctx) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing || existing.isArchived) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data: {
    stock?: number;
    vendingEnabled?: boolean;
    lowStockThreshold?: number;
  } = {};

  if (body.stock !== undefined) {
    const stock = Math.floor(Number(body.stock));
    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json(
        { error: "Stock must be a non-negative integer" },
        { status: 400 },
      );
    }
    data.stock = stock;
  }

  if (body.vendingEnabled !== undefined) {
    data.vendingEnabled = Boolean(body.vendingEnabled);
  }

  if (body.lowStockThreshold !== undefined) {
    const threshold = Math.floor(Number(body.lowStockThreshold));
    if (!Number.isFinite(threshold) || threshold < 0) {
      return NextResponse.json(
        { error: "Low-stock threshold must be a non-negative integer" },
        { status: 400 },
      );
    }
    data.lowStockThreshold = threshold;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No inventory fields to update" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data,
    select: {
      id: true,
      slug: true,
      name: true,
      catalog: true,
      stock: true,
      vendingEnabled: true,
      lowStockThreshold: true,
      isPublished: true,
    },
  });

  return NextResponse.json({
    product: {
      ...product,
      lowStock: isLowStock(product),
      outOfStock: isOutOfStock(product),
      statusLabel: sellabilityLabel(product),
    },
  });
}
