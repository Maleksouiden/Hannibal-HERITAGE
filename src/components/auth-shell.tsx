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
      ? "/home/tinja-pottery.webp"
      : "/home/sejnane-artisan.jpg";
  const imageAlt =
    mode === "login"
      ? "Sejnane pottery in an artisan workshop"
      : "A Sejnane artisan shaping a terracotta vessel";
  const eyebrow = mode === "login" ? "Welcome back" : "Join the atelier";
  const title =
    mode === "login" ? "Sign in to your account" : "Create your account";
  const supporting =
    mode === "login"
      ? "Continue discovering handcrafted Sejnane pottery and Tunisian olive wood."
      : "Save your details for future orders and follow Tunisian craft from kiln and grove to your table.";

  return (
    <div
      className={`${display.variable} ${body.variable} relative flex w-full flex-1 flex-col overflow-hidden bg-white`}
      style={{ fontFamily: "var(--font-auth-body), sans-serif" }}
    >
      <div className="relative mx-auto grid w-full max-w-[1440px] flex-1 lg:grid-cols-2">
        <aside className="relative min-h-[14rem] overflow-hidden bg-[#1c1917] sm:min-h-[20rem] lg:min-h-[32rem]">
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
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
            <p className="flex items-center gap-3 text-[10px] tracking-[0.28em] text-[#e8dfd0]/85 uppercase">
              <span className="h-px w-8 bg-[#d6b98f]" aria-hidden />
              Hannibal HERITAGE
            </p>
            <p
              className="mt-2 max-w-sm text-xl leading-tight font-medium text-[#f7f3ec] sm:mt-3 sm:text-3xl"
              style={{ fontFamily: "var(--font-auth-display), serif" }}
            >
              {mode === "login"
                ? "Objects with a Tunisian pulse"
                : "Begin with the makers"}
            </p>
          </div>
        </aside>

        <main className="relative flex flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16 xl:px-16">
          <div className="mx-auto w-full max-w-md animate-[auth-rise_700ms_ease-out]">
            <p className="flex items-center gap-3 text-[10px] tracking-[0.24em] text-[#756b5d] uppercase">
              <span className="h-px w-8 bg-[#9b7653]" aria-hidden />
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
            <div className="mt-8 border border-[#e9e3d9] bg-[#fbfaf8] p-5 sm:p-7">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
