import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getCatalogProduct, listCatalogProducts } from "@/lib/catalog-repository";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await listCatalogProducts("OLIVE_WOOD");
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct("OLIVE_WOOD", slug);
  if (!product) return { title: "Product | Hannibal HERITAGE" };
  return {
    title: `${product.name} | Hannibal HERITAGE`,
    description: product.description,
  };
}

export default async function OliveWoodProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getCatalogProduct("OLIVE_WOOD", slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
