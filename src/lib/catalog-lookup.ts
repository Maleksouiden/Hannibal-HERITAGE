import { listOliveWoodProducts } from "@/data/olive-wood-products";
import {
  listSajnenProducts,
  type CatalogId,
  type SeedProduct,
} from "@/data/sajnen-products";
import { getCatalogProduct } from "@/lib/catalog-repository";
import { productPriceMinor } from "@/lib/product-display";

function staticProduct(
  catalog: CatalogId,
  slug: string,
): SeedProduct | undefined {
  const list =
    catalog === "SAJNEN" ? listSajnenProducts() : listOliveWoodProducts();
  return list.find((product) => product.slug === slug);
}

export function findCatalogProduct(
  catalog: CatalogId,
  slug: string,
): SeedProduct | undefined {
  return staticProduct(catalog, slug);
}

export function resolveUnitPriceMinor(
  catalog: CatalogId,
  slug: string,
): { product: SeedProduct; priceMinor: number } | null {
  const product = staticProduct(catalog, slug);
  if (!product) return null;
  return { product, priceMinor: productPriceMinor(product) };
}

/** Prefer DB product pricing when MySQL is up; else static seed. */
export async function resolveUnitPriceMinorAsync(
  catalog: CatalogId,
  slug: string,
): Promise<{ product: SeedProduct; priceMinor: number } | null> {
  const fromDb = await getCatalogProduct(catalog, slug);
  if (fromDb) {
    return { product: fromDb, priceMinor: productPriceMinor(fromDb) };
  }
  return resolveUnitPriceMinor(catalog, slug);
}
