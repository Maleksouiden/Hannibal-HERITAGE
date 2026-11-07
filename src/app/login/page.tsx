import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in | Hannibal HERITAGE",
  description: "Sign in to your Hannibal HERITAGE account.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-16">
      <header className="mb-8 max-w-md sm:mb-10">
        <p className="text-xs tracking-[0.22em] text-[#8a8278] uppercase">
          Account
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#5c564e] sm:mt-4 sm:text-base sm:leading-7">
          Customers and admins use the same sign-in form. Role comes from your
          account.
        </p>
      </header>
      <AuthForm mode="login" />
    </main>
  );
}
