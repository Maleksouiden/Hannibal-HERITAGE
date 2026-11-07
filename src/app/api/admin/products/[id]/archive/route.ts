import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  adminProductInclude,
  serializeAdminProduct,
} from "@/lib/admin-products";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Ctx) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      isArchived: true,
      isPublished: false,
    },
    include: adminProductInclude,
  });

  return NextResponse.json({ product: serializeAdminProduct(product) });
}
