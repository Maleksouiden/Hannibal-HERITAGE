import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Create account | Hannibal HERITAGE",
  description: "Create a Hannibal HERITAGE customer account.",
};

export default function SignupPage() {
  return (
    <AuthShell mode="signup">
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
