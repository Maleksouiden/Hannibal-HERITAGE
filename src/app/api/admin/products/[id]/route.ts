import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  adminProductInclude,
  ensureCatalogCategory,
  isCatalog,
  normalizeImageUrls,
  serializeAdminProduct,
  slugify,
  tndToMinor,
} from "@/lib/admin-products";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: adminProductInclude,
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product: serializeAdminProduct(product) });
}

type PatchBody = {
  name?: string;
  slug?: string;
  description?: string;
  catalog?: string;
  priceTnd?: number;
  sku?: string | null;
  stock?: number;
  isPublished?: boolean;
  imageUrls?: string[];
};

export async function PATCH(request: Request, context: Ctx) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  if (existing.isArchived) {
    return NextResponse.json(
      { error: "Archived products cannot be edited" },
      { status: 400 },
    );
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? existing.name;
  const description =
    body.description !== undefined
      ? body.description.trim()
      : (existing.description ?? "");
  const catalogRaw = body.catalog?.trim() ?? existing.catalog;
  if (!isCatalog(catalogRaw)) {
    return NextResponse.json(
      { error: "Catalog must be SAJNEN or OLIVE_WOOD" },
      { status: 400 },
    );
  }
  const slug = slugify(body.slug?.trim() || existing.slug);
  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 },
    );
  }

  if (slug !== existing.slug) {
    const clash = await prisma.product.findUnique({ where: { slug } });
    if (clash) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }

  let priceMinor = existing.priceMinor;
  if (body.priceTnd !== undefined) {
    const priceTnd = Number(body.priceTnd);
    if (!Number.isFinite(priceTnd) || priceTnd < 0) {
      return NextResponse.json(
        { error: "Price must be a non-negative number" },
        { status: 400 },
      );
    }
    priceMinor = tndToMinor(priceTnd);
  }

  const stock =
    body.stock !== undefined && Number.isFinite(body.stock)
      ? Math.max(0, Math.floor(body.stock))
      : existing.stock;

  const category = await ensureCatalogCategory(catalogRaw);

  const product = await prisma.$transaction(async (tx) => {
    if (body.imageUrls) {
      const urls = normalizeImageUrls(body.imageUrls);
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (urls.length > 0) {
        await tx.productImage.createMany({
          data: urls.map((url, sortOrder) => ({
            productId: id,
            url,
            alt: name,
            sortOrder,
          })),
        });
      }
    }

    return tx.product.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        catalog: catalogRaw,
        categoryId: category.id,
        priceMinor,
        sku:
          body.sku !== undefined
            ? body.sku?.trim() || null
            : existing.sku,
        stock,
        isPublished:
          body.isPublished !== undefined
            ? Boolean(body.isPublished)
            : existing.isPublished,
      },
      include: adminProductInclude,
    });
  });

  return NextResponse.json({ product: serializeAdminProduct(product) });
}
