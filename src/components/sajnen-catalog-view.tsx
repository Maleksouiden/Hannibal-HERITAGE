"use client";

import { useCallback } from "react";
import {
  CreamCatalogView,
  type CreamCatalogFilter,
} from "@/components/cream-catalog-view";
import type { CatalogProduct } from "@/lib/catalog-repository";

type FilterId = "all" | "pots" | "bowls" | "vases" | "feeders";

const FILTERS: CreamCatalogFilter[] = [
  { id: "all", label: "All" },
  { id: "pots", label: "Pots" },
  { id: "bowls", label: "Bowls" },
  { id: "vases", label: "Vases" },
  { id: "feeders", label: "Feeders" },
];

function inCategory(product: CatalogProduct, filter: string): boolean {
  if (filter === "all") return true;
  const hay = `${product.name} ${product.slug}`.toLowerCase();
  switch (filter as FilterId) {
    case "pots":
      return /\bpot\b|planter|with lid|with-legs|legs/.test(hay);
    case "bowls":
      return /bowl/.test(hay);
    case "vases":
      return /vase|vessel/.test(hay);
    case "feeders":
      return /feeder|feeding|bird-feeder|feeding-bird/.test(hay);
    default:
      return true;
  }
}

type SajnenCatalogViewProps = {
  products: CatalogProduct[];
  heroImageSrc: string;
};

export function SajnenCatalogView({
  products,
  heroImageSrc,
}: SajnenCatalogViewProps) {
  const matchFilter = useCallback(
    (product: CatalogProduct, filterId: string) =>
      inCategory(product, filterId),
    [],
  );

  return (
    <CreamCatalogView
      products={products}
      heroImageSrc={heroImageSrc}
      heroImageAlt="Featured Sejnane clay pot"
      title="Sejnane"
      description="Authentic Tunisian pottery shaped by skilled women artisans, rooted in a centuries-old tradition recognized by UNESCO as Intangible Cultural Heritage."
      basePath="/sajnen"
      collectionId="sajnen-collection"
      filters={FILTERS}
      matchFilter={matchFilter}
    />
  );
}
