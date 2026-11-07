import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Sign in | Hannibal HERITAGE",
  description: "Sign in to your Hannibal HERITAGE account.",
};

function AuthFormFallback() {
  return (
    <div
      className="min-h-48 animate-pulse rounded-sm bg-[#ebe4d8]/60"
      aria-hidden
    />
  );
}

export default function LoginPage() {
  return (
    <AuthShell mode="login">
      <Suspense fallback={<AuthFormFallback />}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
