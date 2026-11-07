import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Panier | Hannibal HERITAGE",
  description: "Review items in your Hannibal HERITAGE shopping cart.",
};

export default function PanierPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 pb-28 sm:px-6 sm:py-16 sm:pb-16">
      <header className="mb-8 sm:mb-10">
        <p className="text-xs tracking-[0.22em] text-[#8a8278] uppercase">
          Cart
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
          Panier
        </h1>
      </header>
      <CartView />
    </main>
  );
}
