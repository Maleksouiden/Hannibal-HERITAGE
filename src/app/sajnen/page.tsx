import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { listCatalogProducts } from "@/lib/catalog-repository";

export const metadata: Metadata = {
  title: "Sejnane pottery | Hannibal HERITAGE",
  description:
    "Browse handcrafted Sejnane pottery — authentic Tunisian ceramics shaped by women artisans.",
};

export default async function SajnenCatalogPage() {
  const products = await listCatalogProducts("SAJNEN");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs tracking-[0.22em] text-[#8a8278] uppercase">
          Catalog
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Sejnane
        </h1>
        <p className="mt-4 text-base leading-7 text-[#5c564e] sm:text-lg sm:leading-8">
          Authentic Tunisian pottery shaped by skilled women artisans, rooted in
          a centuries-old tradition recognized by UNESCO as Intangible Cultural
          Heritage.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} href={`/sajnen/${product.slug}`} />
          </li>
        ))}
      </ul>
    </main>
  );
}
