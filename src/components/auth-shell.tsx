import { Cormorant_Garamond, Figtree } from "next/font/google";
import Image from "next/image";
import type { ReactNode } from "react";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-auth-display",
});

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-auth-body",
});

type AuthShellProps = {
  mode: "login" | "signup";
  children: ReactNode;
};

export function AuthShell({ mode, children }: AuthShellProps) {
  const imageSrc =
    mode === "login"
      ? "/home/olive-wood-featured.png"
      : "/home/sajnen-featured.png";
  const imageAlt =
    mode === "login"
      ? "Handcrafted olive wood serving board"
      : "Handcrafted Sejnane terracotta vessel";
  const eyebrow = mode === "login" ? "Welcome back" : "Join the atelier";
  const title =
    mode === "login" ? "Sign in to your account" : "Create your account";
  const supporting =
    mode === "login"
      ? "Continue shopping Sejnane pottery and olive wood, or open the admin dashboard if you manage the store."
      : "Save your details for future orders and follow Tunisian craft from kiln and grove to your table.";

  return (
    <div
      className={`${display.variable} ${body.variable} relative flex w-full flex-1 flex-col overflow-hidden bg-[#ebe4d6]`}
      style={{ fontFamily: "var(--font-auth-body), sans-serif" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 10% 0%, rgba(255,255,255,0.55), transparent 45%), radial-gradient(ellipse at 90% 100%, rgba(90,78,58,0.12), transparent 40%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-6xl flex-1 lg:grid-cols-2">
        <aside className="relative hidden min-h-[28rem] overflow-hidden bg-[#1c1917] lg:block">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="50vw"
            className="object-cover animate-[about-ken_26s_ease-in-out_infinite_alternate]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-[#1c1917]/45 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="text-[11px] tracking-[0.28em] text-[#e8dfd0]/80 uppercase">
              Hannibal HERITAGE
            </p>
            <p
              className="mt-3 max-w-sm text-3xl leading-tight font-medium text-[#f7f3ec]"
              style={{ fontFamily: "var(--font-auth-display), serif" }}
            >
              {mode === "login"
                ? "Objects with a Tunisian pulse"
                : "Begin with the makers"}
            </p>
          </div>
        </aside>

        <main className="relative flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-md animate-[auth-rise_700ms_ease-out]">
            <p className="text-[11px] tracking-[0.24em] text-[#6f675c] uppercase">
              {eyebrow}
            </p>
            <h1
              className="mt-3 text-4xl leading-tight font-medium tracking-tight text-[#1c1917] sm:text-5xl"
              style={{ fontFamily: "var(--font-auth-display), serif" }}
            >
              {title}
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#4a433b] sm:text-base sm:leading-7">
              {supporting}
            </p>
            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
