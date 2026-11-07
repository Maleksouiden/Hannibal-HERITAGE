import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import {
  getSajnenProduct,
  listSajnenProducts,
} from "@/data/sajnen-products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listSajnenProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getSajnenProduct(slug);
  if (!product) return { title: "Product | Hannibal HERITAGE" };
  return {
    title: `${product.name} | Hannibal HERITAGE`,
    description: product.description,
  };
}

export default async function SajnenProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getSajnenProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
