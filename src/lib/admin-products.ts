import type { Catalog } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const CATEGORY_BY_CATALOG: Record<Catalog, { slug: string; name: string }> = {
  SAJNEN: { slug: "sajnen", name: "Sejnane" },
  OLIVE_WOOD: { slug: "olive-wood", name: "Olive wood" },
};

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** TND major units (3 decimals) → millimes. */
export function tndToMinor(major: number): number {
  return Math.round(major * 1000);
}

export function minorToTnd(minor: number): number {
  return minor / 1000;
}

export function isCatalog(value: string): value is Catalog {
  return value === "SAJNEN" || value === "OLIVE_WOOD";
}

export async function ensureCatalogCategory(catalog: Catalog) {
  const meta = CATEGORY_BY_CATALOG[catalog];
  return prisma.category.upsert({
    where: { slug: meta.slug },
    update: { name: meta.name, catalog },
    create: {
      slug: meta.slug,
      name: meta.name,
      catalog,
      description:
        catalog === "SAJNEN"
          ? "Handcrafted Sejnane pottery — UNESCO Intangible Cultural Heritage."
          : "Handcrafted Tunisian olive wood for the table and home.",
    },
  });
}

export function normalizeImageUrls(urls: string[]): string[] {
  return urls
    .map((url) => url.trim())
    .filter((url) => url.length > 0)
    .slice(0, 12);
}

export function serializeAdminProduct(
  product: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    catalog: Catalog;
    categoryId: string | null;
    priceMinor: number;
    currency: string;
    sku: string | null;
    stock: number;
    isPublished: boolean;
    isArchived: boolean;
    updatedAt: Date;
    images: Array<{ id: string; url: string; alt: string | null; sortOrder: number }>;
  },
) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description ?? "",
    catalog: product.catalog,
    categoryId: product.categoryId,
    priceMinor: product.priceMinor,
    priceTnd: minorToTnd(product.priceMinor),
    currency: product.currency,
    sku: product.sku,
    stock: product.stock,
    isPublished: product.isPublished,
    isArchived: product.isArchived,
    updatedAt: product.updatedAt.toISOString(),
    images: product.images
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.alt,
        sortOrder: image.sortOrder,
      })),
  };
}

export const adminProductInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
};
