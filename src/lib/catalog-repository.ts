import { PRODUCT_GALLERIES } from "@/data/product-galleries";
import { listOliveWoodProducts } from "@/data/olive-wood-products";
import {
  listSajnenProducts,
  type CatalogId,
  type SeedProduct,
} from "@/data/sajnen-products";
import { prisma } from "@/lib/prisma";
import { productPriceMinor } from "@/lib/product-display";

export type CatalogProduct = SeedProduct & {
  images: string[];
  source: "database" | "static";
};

function fromStatic(
  product: SeedProduct,
): CatalogProduct {
  return {
    ...product,
    priceMinor: productPriceMinor(product),
    images: PRODUCT_GALLERIES[product.slug] ?? [product.imageSrc],
    source: "static",
  };
}

function staticList(catalog: CatalogId): CatalogProduct[] {
  const list =
    catalog === "SAJNEN" ? listSajnenProducts() : listOliveWoodProducts();
  return list.map(fromStatic);
}

async function databaseAvailable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

async function fromDatabase(
  catalog: CatalogId,
): Promise<CatalogProduct[] | null> {
  try {
    const rows = await prisma.product.findMany({
      where: { catalog, isPublished: true },
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { name: "asc" },
    });
    if (rows.length === 0) return null;
    return rows.map((row) => {
      const images =
        row.images.length > 0
          ? row.images.map((image) => image.url)
          : ["/file.svg"];
      return {
        slug: row.slug,
        name: row.name,
        description: row.description ?? "",
        catalog: row.catalog,
        priceMinor: row.priceMinor,
        currency: "TND",
        isPublished: true as const,
        imageSrc: images[0]!,
        imageAlt: row.images[0]?.alt ?? row.name,
        images,
        source: "database" as const,
      };
    });
  } catch {
    return null;
  }
}

/** Prefer MySQL catalogs; fall back to static Notion seed modules. */
export async function listCatalogProducts(
  catalog: CatalogId,
): Promise<CatalogProduct[]> {
  if (await databaseAvailable()) {
    const fromDb = await fromDatabase(catalog);
    if (fromDb && fromDb.length > 0) return fromDb;
  }
  return staticList(catalog);
}

export async function getCatalogProduct(
  catalog: CatalogId,
  slug: string,
): Promise<CatalogProduct | null> {
  if (await databaseAvailable()) {
    try {
      const row = await prisma.product.findFirst({
        where: { catalog, slug, isPublished: true },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });
      if (row) {
        const images =
          row.images.length > 0
            ? row.images.map((image) => image.url)
            : ["/file.svg"];
        return {
          slug: row.slug,
          name: row.name,
          description: row.description ?? "",
          catalog: row.catalog,
          priceMinor: row.priceMinor,
          currency: "TND",
          isPublished: true,
          imageSrc: images[0]!,
          imageAlt: row.images[0]?.alt ?? row.name,
          images,
          source: "database",
        };
      }
    } catch {
      /* fall through to static */
    }
  }

  const list = staticList(catalog);
  return list.find((product) => product.slug === slug) ?? null;
}
