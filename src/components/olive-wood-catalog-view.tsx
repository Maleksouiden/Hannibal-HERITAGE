"use client";

import { useCallback } from "react";
import {
  CreamCatalogView,
  type CreamCatalogFilter,
} from "@/components/cream-catalog-view";
import type { CatalogProduct } from "@/lib/catalog-repository";

type FilterId = "all" | "boards" | "utensils" | "bowls" | "servers";

const FILTERS: CreamCatalogFilter[] = [
  { id: "all", label: "All" },
  { id: "boards", label: "Boards" },
  { id: "utensils", label: "Utensils" },
  { id: "bowls", label: "Bowls" },
  { id: "servers", label: "Servers" },
];

function inCategory(product: CatalogProduct, filter: string): boolean {
  if (filter === "all") return true;
  const hay = `${product.name} ${product.slug}`.toLowerCase();
  switch (filter as FilterId) {
    case "boards":
      return /board|cuttingboard|chessboard|trivet/.test(hay);
    case "utensils":
      return /spoon|spatula|fork|spreader|reamer|sticks|rolling|measuring|fish/.test(
        hay,
      );
    case "bowls":
      return /bowl|pot|cup|lid/.test(hay);
    case "servers":
      return /server|duo|trio|pasta/.test(hay);
    default:
      return true;
  }
}

type OliveWoodCatalogViewProps = {
  products: CatalogProduct[];
  heroImageSrc: string;
};

export function OliveWoodCatalogView({
  products,
  heroImageSrc,
}: OliveWoodCatalogViewProps) {
  const matchFilter = useCallback(
    (product: CatalogProduct, filterId: string) =>
      inCategory(product, filterId),
    [],
  );

  return (
    <CreamCatalogView
      products={products}
      heroImageSrc={heroImageSrc}
      heroImageAlt="Featured olive wood piece"
      title="Olive wood"
      description="From Tunisia’s ancient olive groves — natural grain and exceptional craftsmanship for the table and home, shaped by local artisans."
      basePath="/olive-wood"
      collectionId="olive-wood-collection"
      filters={FILTERS}
      matchFilter={matchFilter}
    />
  );
}
