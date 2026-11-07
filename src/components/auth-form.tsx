"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Mode = "login" | "signup";

type AuthFormProps = {
  mode: Mode;
  nextPath?: string;
};

function safeNextPath(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export function AuthForm({ mode, nextPath }: AuthFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const payload: Record<string, string> = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };
    if (mode === "signup") {
      payload.fullName = String(form.get("fullName") ?? "");
    }

    try {
      const response = await fetch(
        mode === "signup" ? "/api/auth/signup" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as {
        error?: string;
        user?: { role?: string };
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Authentication failed");
      }
      const next = safeNextPath(nextPath);
      const destination =
        next !== "/"
          ? next
          : data.user?.role === "ADMIN"
            ? "/dashboard"
            : "/";
      router.push(destination);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-5">
      {mode === "signup" ? (
        <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
          Full name
          <input
            name="fullName"
            type="text"
            required
            autoComplete="name"
            className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm"
          />
        </label>
      ) : null}

      <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={mode === "signup" ? 8 : undefined}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm"
        />
      </label>

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center border border-[#1c1917] bg-[#1c1917] px-5 py-3 text-xs tracking-[0.16em] text-[#f7f3ec] uppercase transition hover:bg-transparent hover:text-[#1c1917] disabled:opacity-50"
      >
        {pending
          ? mode === "signup"
            ? "Creating account…"
            : "Signing in…"
          : mode === "signup"
            ? "Create account"
            : "Sign in"}
      </button>

      <p className="text-sm text-[#5c564e]">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-[#1c1917] underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="text-[#1c1917] underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
