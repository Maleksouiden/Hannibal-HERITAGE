import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Sign in | Hannibal HERITAGE",
  description: "Sign in to your Hannibal HERITAGE account.",
};

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nextPath =
    params.next && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : undefined;

  return (
    <AuthShell mode="login">
      <AuthForm mode="login" nextPath={nextPath} />
    </AuthShell>
  );
}
