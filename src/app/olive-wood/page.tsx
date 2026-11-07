import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { listOliveWoodProducts } from "@/data/olive-wood-products";

export const metadata: Metadata = {
  title: "Olive wood | Hannibal HERITAGE",
  description:
    "Browse handcrafted Tunisian olive wood pieces — boards, utensils, and tableware.",
};

export default function OliveWoodCatalogPage() {
  const products = listOliveWoodProducts();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs tracking-[0.22em] text-[#8a8278] uppercase">
          Catalog
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Olive wood
        </h1>
        <p className="mt-4 text-base leading-7 text-[#5c564e] sm:text-lg sm:leading-8">
          From Tunisia’s ancient olive groves — natural beauty and exceptional
          craftsmanship for the table and home.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.slug}>
            <ProductCard
              product={product}
              href={`/olive-wood/${product.slug}`}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
