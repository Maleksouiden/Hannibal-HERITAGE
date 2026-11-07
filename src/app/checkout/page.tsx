import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | Hannibal HERITAGE",
  description: "Complete your Hannibal HERITAGE order.",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <p className="text-xs tracking-[0.22em] text-[#8a8278] uppercase">
          Checkout
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Checkout
        </h1>
      </header>
      <CheckoutForm />
    </main>
  );
}
