"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

const fieldClass =
  "min-h-12 w-full border border-[#e1d9cc] bg-white px-3 py-3 text-base text-[#1c1917] outline-none transition focus-visible:border-[#9b7653] focus-visible:ring-1 focus-visible:ring-[#9b7653]/30 sm:text-sm";

export function AuthForm({ mode, nextPath }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      const next = safeNextPath(
        nextPath ?? searchParams.get("next") ?? undefined,
      );
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
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {mode === "signup" ? (
        <label className="flex flex-col gap-2 text-xs tracking-[0.14em] text-[#6f675c] uppercase">
          Full name
          <input
            name="fullName"
            type="text"
            required
            autoComplete="name"
            className={fieldClass}
          />
        </label>
      ) : null}

      <label className="flex flex-col gap-2 text-xs tracking-[0.14em] text-[#6f675c] uppercase">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 text-xs tracking-[0.14em] text-[#6f675c] uppercase">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={mode === "signup" ? 8 : undefined}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className={fieldClass}
        />
      </label>

      {error ? (
        <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#293126] px-5 text-[10px] tracking-[0.18em] text-white uppercase transition hover:bg-[#3b4736] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b7653] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            <Link
              href="/login"
              className="text-[#1c1917] underline decoration-[#cfc4b2] underline-offset-4 transition hover:decoration-[#1c1917]"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link
              href="/signup"
              className="text-[#1c1917] underline decoration-[#cfc4b2] underline-offset-4 transition hover:decoration-[#1c1917]"
            >
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
