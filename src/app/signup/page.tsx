import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Create account | Hannibal HERITAGE",
  description: "Create a Hannibal HERITAGE customer account.",
};

function AuthFormFallback() {
  return (
    <div
      className="min-h-48 animate-pulse rounded-sm bg-[#ebe4d8]/60"
      aria-hidden
    />
  );
}

export default function SignupPage() {
  return (
    <AuthShell mode="signup">
      <Suspense fallback={<AuthFormFallback />}>
        <AuthForm mode="signup" />
      </Suspense>
    </AuthShell>
  );
}
