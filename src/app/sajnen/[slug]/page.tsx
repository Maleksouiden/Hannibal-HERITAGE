import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductRouteFallback } from "@/components/catalog-route-fallback";
import { ProductDetail } from "@/components/product-detail";
import { listSajnenProducts } from "@/data/sajnen-products";
import {
  getCatalogProduct,
  listCatalogProducts,
} from "@/lib/catalog-repository";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Build-time only — static seed; never call Prisma/`connection()` here. */
export function generateStaticParams() {
  return listSajnenProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = listSajnenProducts().find((item) => item.slug === slug);
  if (!product) return { title: "Product | Hannibal HERITAGE" };
  return {
    title: `${product.name} | Hannibal HERITAGE`,
    description: product.description,
  };
}

async function SajnenProductContent({ params }: PageProps) {
  const { slug } = await params;
  const [product, catalog] = await Promise.all([
    getCatalogProduct("SAJNEN", slug),
    listCatalogProducts("SAJNEN"),
  ]);
  if (!product) notFound();
  const related = catalog.filter((item) => item.slug !== slug).slice(0, 8);
  return <ProductDetail product={product} related={related} />;
}

export default function SajnenProductPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ProductRouteFallback />}>
      <SajnenProductContent params={params} />
    </Suspense>
  );
}
