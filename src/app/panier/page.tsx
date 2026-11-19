import type { Metadata } from "next";
import Link from "next/link";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Panier | Hannibal HERITAGE",
  description: "Review items in your Hannibal HERITAGE shopping cart.",
};

export default function PanierPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 pb-28 sm:px-8 sm:py-14 sm:pb-16">
      <header className="mb-8 border-b border-[#e9e3d9] pb-6 sm:mb-10 sm:pb-8">
        <p className="text-[10px] tracking-[0.22em] text-[#8a8278] uppercase">
          Your selection
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl leading-none font-medium tracking-tight sm:text-5xl">
              Shopping bag
            </h1>
            <p className="mt-3 text-sm text-[#5c564e]">
              Review your chosen pieces before continuing.
            </p>
          </div>
          <Link
            href="/sajnen"
            className="inline-flex min-h-11 items-center gap-2 text-[10px] tracking-[0.16em] text-[#5c564e] uppercase transition hover:text-[#1c1917]"
          >
            Continue shopping <span aria-hidden>→</span>
          </Link>
        </div>
      </header>
      <nav aria-label="Checkout progress" className="mb-8 sm:mb-10">
        <ol className="flex max-w-xl items-center gap-3 text-[9px] tracking-[0.14em] uppercase sm:gap-4 sm:text-[10px]">
          <li aria-current="step" className="flex items-center gap-2 text-[#1c1917]">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#293126] text-white">1</span>
            <span>Bag</span>
          </li>
          <li className="h-px flex-1 bg-[#ddd4c5]" aria-hidden />
          <li className="flex items-center gap-2 text-[#8a8278]">
            <span className="flex size-6 items-center justify-center rounded-full border border-[#d8d0c3]">2</span>
            <span>Details</span>
          </li>
          <li className="h-px flex-1 bg-[#ddd4c5]" aria-hidden />
          <li className="flex items-center gap-2 text-[#8a8278]">
            <span className="flex size-6 items-center justify-center rounded-full border border-[#d8d0c3]">3</span>
            <span>Confirmation</span>
          </li>
        </ol>
      </nav>
      <CartView />
    </main>
  );
}
