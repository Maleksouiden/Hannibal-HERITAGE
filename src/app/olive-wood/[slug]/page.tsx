import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductRouteFallback } from "@/components/catalog-route-fallback";
import { ProductDetail } from "@/components/product-detail";
import { listOliveWoodProducts } from "@/data/olive-wood-products";
import {
  getCatalogProduct,
  listCatalogProducts,
} from "@/lib/catalog-repository";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Build-time only — static seed; never call Prisma/`connection()` here. */
export function generateStaticParams() {
  return listOliveWoodProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = listOliveWoodProducts().find((item) => item.slug === slug);
  if (!product) return { title: "Product | Hannibal HERITAGE" };
  return {
    title: `${product.name} | Hannibal HERITAGE`,
    description: product.description,
  };
}

async function OliveWoodProductContent({ params }: PageProps) {
  const { slug } = await params;
  const [product, catalog] = await Promise.all([
    getCatalogProduct("OLIVE_WOOD", slug),
    listCatalogProducts("OLIVE_WOOD"),
  ]);
  if (!product) notFound();
  const related = catalog.filter((item) => item.slug !== slug).slice(0, 8);
  return <ProductDetail product={product} related={related} />;
}

export default function OliveWoodProductPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ProductRouteFallback />}>
      <OliveWoodProductContent params={params} />
    </Suspense>
  );
}
