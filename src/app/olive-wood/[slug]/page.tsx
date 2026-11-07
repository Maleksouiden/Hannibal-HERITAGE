import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import {
  getOliveWoodProduct,
  listOliveWoodProducts,
} from "@/data/olive-wood-products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listOliveWoodProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getOliveWoodProduct(slug);
  if (!product) return { title: "Product | Hannibal HERITAGE" };
  return {
    title: `${product.name} | Hannibal HERITAGE`,
    description: product.description,
  };
}

export default async function OliveWoodProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getOliveWoodProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
