import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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

/** PDP stub — full detail (price, gallery, cart) comes in later tickets. */
export default async function OliveWoodProductStubPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getOliveWoodProduct(slug);
  if (!product) notFound();

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:gap-12 sm:px-6 sm:py-16">
      <div className="relative aspect-square overflow-hidden bg-[#ebe4d8]">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-5">
        <p className="text-xs tracking-[0.22em] text-[#8a8278] uppercase">
          Olive wood
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {product.name}
        </h1>
        <p className="max-w-md text-base leading-7 text-[#5c564e]">
          {product.description}
        </p>
        <p className="text-sm text-[#8a8278]">
          Product detail page stub — pricing and cart arrive in later stories.
        </p>
        <Link
          href="/olive-wood"
          className="mt-2 inline-flex w-fit text-xs tracking-[0.16em] text-[#5c564e] uppercase transition hover:text-[#1c1917]"
        >
          ← Back to olive wood catalog
        </Link>
      </div>
    </main>
  );
}
