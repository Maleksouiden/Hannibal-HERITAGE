import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | Hannibal HERITAGE",
  description: "Complete your Hannibal HERITAGE order.",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-8 sm:py-14">
      <header className="mb-8 border-b border-[#e9e3d9] pb-6 sm:mb-10 sm:pb-8">
        <p className="text-[10px] tracking-[0.22em] text-[#8a8278] uppercase">
          Almost yours
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-none font-medium tracking-tight sm:text-5xl">
          Delivery details
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e]">
          A few details and these Tunisian-made pieces will be on their way to
          you.
        </p>
      </header>
      <nav aria-label="Checkout progress" className="mb-8 sm:mb-10">
        <ol className="flex max-w-xl items-center gap-3 text-[9px] tracking-[0.14em] uppercase sm:gap-4 sm:text-[10px]">
          <li className="flex items-center gap-2 text-[#756b5d]">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#293126] text-white">✓</span>
            <span>Bag</span>
          </li>
          <li className="h-px flex-1 bg-[#9b7653]" aria-hidden />
          <li aria-current="step" className="flex items-center gap-2 text-[#1c1917]">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#293126] text-white">2</span>
            <span>Details</span>
          </li>
          <li className="h-px flex-1 bg-[#ddd4c5]" aria-hidden />
          <li className="flex items-center gap-2 text-[#8a8278]">
            <span className="flex size-6 items-center justify-center rounded-full border border-[#d8d0c3]">3</span>
            <span>Confirmation</span>
          </li>
        </ol>
      </nav>
      <CheckoutForm />
    </main>
  );
}
