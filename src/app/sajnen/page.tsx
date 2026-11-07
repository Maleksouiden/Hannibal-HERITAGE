import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { SajnenCatalogView } from "@/components/sajnen-catalog-view";
import { listCatalogProducts } from "@/lib/catalog-repository";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-catalog-display",
});

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-catalog-body",
});

export const metadata: Metadata = {
  title: "Sejnane pottery | Hannibal HERITAGE",
  description:
    "Browse handcrafted Sejnane pottery — authentic Tunisian ceramics shaped by women artisans.",
};

export default async function SajnenCatalogPage() {
  const products = await listCatalogProducts("SAJNEN");
  const hero =
    products.find((p) => p.slug === "2-legged-bumpy-clay-pot-with-lid") ??
    products[0];

  return (
    <div
      className={`${display.variable} ${body.variable} flex w-full flex-1 flex-col`}
      style={{ fontFamily: "var(--font-catalog-body), sans-serif" }}
    >
      <SajnenCatalogView
        products={products}
        heroImageSrc={
          hero?.imageSrc ?? "/catalog/sajnen/2-legged-bumpy-clay-pot-with-lid.png"
        }
      />
    </div>
  );
}
