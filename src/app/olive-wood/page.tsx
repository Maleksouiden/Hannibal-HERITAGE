import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { OliveWoodCatalogView } from "@/components/olive-wood-catalog-view";
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
  title: "Olive wood | Hannibal HERITAGE",
  description:
    "Browse handcrafted Tunisian olive wood pieces — boards, utensils, and tableware.",
};

export default async function OliveWoodCatalogPage() {
  const products = await listCatalogProducts("OLIVE_WOOD");
  const hero =
    products.find((p) => p.slug === "olive-wood-board") ??
    products.find((p) => p.slug === "olive-wood-pot") ??
    products[0];

  return (
    <div
      className={`${display.variable} ${body.variable} flex w-full flex-1 flex-col`}
      style={{ fontFamily: "var(--font-catalog-body), sans-serif" }}
    >
      <OliveWoodCatalogView
        products={products}
        heroImageSrc={
          hero?.imageSrc ?? "/catalog/olive-wood/olive-wood-board.png"
        }
      />
    </div>
  );
}
