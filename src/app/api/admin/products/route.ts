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

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { searchParams } = new URL(request.url);
  const includeArchived = searchParams.get("archived") === "1";

  const products = await prisma.product.findMany({
    where: includeArchived ? undefined : { isArchived: false },
    include: adminProductInclude,
    orderBy: [{ isArchived: "asc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({
    products: products.map(serializeAdminProduct),
  });
}

type CreateBody = {
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

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const catalog = body.catalog?.trim() ?? "";
  const description = body.description?.trim() ?? "";
  const slugInput = body.slug?.trim() || name;
  const slug = slugify(slugInput);
  const priceTnd = Number(body.priceTnd ?? 0);
  const stock = Number.isFinite(body.stock) ? Math.max(0, Math.floor(body.stock!)) : 0;
  const isPublished = Boolean(body.isPublished);
  const imageUrls = normalizeImageUrls(body.imageUrls ?? []);

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!isCatalog(catalog)) {
    return NextResponse.json(
      { error: "Catalog must be SAJNEN or OLIVE_WOOD" },
      { status: 400 },
    );
  }
  if (!slug) {
    return NextResponse.json({ error: "Valid slug is required" }, { status: 400 });
  }
  if (!Number.isFinite(priceTnd) || priceTnd < 0) {
    return NextResponse.json({ error: "Price must be a non-negative number" }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const category = await ensureCatalogCategory(catalog);
  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      catalog,
      categoryId: category.id,
      priceMinor: tndToMinor(priceTnd),
      currency: "TND",
      sku: body.sku?.trim() || null,
      stock,
      isPublished,
      isArchived: false,
      images: {
        create: imageUrls.map((url, sortOrder) => ({
          url,
          alt: name,
          sortOrder,
        })),
      },
    },
    include: adminProductInclude,
  });

  return NextResponse.json(
    { product: serializeAdminProduct(product) },
    { status: 201 },
  );
}
