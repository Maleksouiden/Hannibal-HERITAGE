import { PRODUCT_GALLERIES } from "@/data/product-galleries";
import type { CatalogId, SeedProduct } from "@/data/sajnen-products";

/** Gallery sources: multi-image when available, otherwise primary. */
export function productImages(product: SeedProduct): string[] {
  return PRODUCT_GALLERIES[product.slug] ?? [product.imageSrc];
}

/**
 * Price in minor units. Seed may still be 0; use a stable placeholder
 * until MySQL/admin pricing (SCRUM-14 / dashboard) replaces it.
 */
export function productPriceMinor(product: SeedProduct): number {
  if (product.priceMinor > 0) return product.priceMinor;
  let hash = 0;
  for (let i = 0; i < product.slug.length; i++) {
    hash = (hash * 31 + product.slug.charCodeAt(i)) >>> 0;
  }
  return 45_000 + (hash % 36) * 5_000;
}

export function formatProductPrice(
  priceMinor: number,
  currency: SeedProduct["currency"] = "TND",
): string {
  const amount = priceMinor / 1000;
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency,
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount);
}

export function catalogLabel(catalog: CatalogId): string {
  return catalog === "SAJNEN" ? "Sejnane" : "Olive wood";
}

export function catalogHref(catalog: CatalogId): string {
  return catalog === "SAJNEN" ? "/sajnen" : "/olive-wood";
}
