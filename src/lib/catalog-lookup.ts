import { listOliveWoodProducts } from "@/data/olive-wood-products";
import {
  listSajnenProducts,
  type CatalogId,
  type SeedProduct,
} from "@/data/sajnen-products";
import { productPriceMinor } from "@/lib/product-display";

export function findCatalogProduct(
  catalog: CatalogId,
  slug: string,
): SeedProduct | undefined {
  const list =
    catalog === "SAJNEN" ? listSajnenProducts() : listOliveWoodProducts();
  return list.find((product) => product.slug === slug);
}

export function resolveUnitPriceMinor(
  catalog: CatalogId,
  slug: string,
): { product: SeedProduct; priceMinor: number } | null {
  const product = findCatalogProduct(catalog, slug);
  if (!product) return null;
  return { product, priceMinor: productPriceMinor(product) };
}
