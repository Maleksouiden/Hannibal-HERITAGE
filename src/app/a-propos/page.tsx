import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { AboutReveal } from "@/components/about-reveal";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-about-display",
});

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-about-body",
});

export const metadata: Metadata = {
  title: "À propos | Hannibal HERITAGE",
  description:
    "The story of Hannibal HERITAGE — Sejnane pottery recognized by UNESCO and olive wood shaped from Tunisia’s ancient groves.",
};

export default function AboutPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} flex w-full flex-1 flex-col bg-[#efe8dc] text-[#1c1917]`}
      style={{ fontFamily: "var(--font-about-body), sans-serif" }}
    >
      <section className="relative isolate min-h-[min(100dvh,52rem)] w-full overflow-hidden bg-[#1c1917]">
        <Image
          src="/home/sajnen-featured.png"
          alt="Handcrafted Sejnane terracotta vessel"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-[about-ken_28s_ease-in-out_infinite_alternate]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-[#1c1917]/55 to-[#1c1917]/25"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(247,243,236,0.12),transparent_55%)]" aria-hidden />

        <div className="relative z-10 mx-auto flex min-h-[min(100dvh,52rem)] w-full max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24">
          <AboutReveal>
            <p
              className="text-[11px] tracking-[0.28em] text-[#e8dfd0]/85 uppercase"
              style={{ fontFamily: "var(--font-about-body), sans-serif" }}
            >
              Hannibal HERITAGE
            </p>
            <h1
              className="mt-4 max-w-3xl text-4xl leading-[1.05] font-medium tracking-tight text-balance text-[#f7f3ec] sm:text-6xl md:text-7xl"
              style={{ fontFamily: "var(--font-about-display), serif" }}
            >
              Crafted in Tunisia, kept for the world
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#e8dfd0]/90 sm:text-lg sm:leading-8">
              We carry two living lineages — Sejnane pottery shaped by women
              artisans, and olive wood turned from ancient Mediterranean
              groves.
            </p>
          </AboutReveal>
        </div>
      </section>

      <AboutReveal className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#d9d0c2]">
            <Image
              src="/catalog/sajnen/beige-terracotta-sajnen-vessel.png"
              alt="Beige terracotta Sejnane vessel"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-xl">
            <p className="text-[11px] tracking-[0.24em] text-[#6f675c] uppercase">
              Sejnane
            </p>
            <h2
              className="mt-3 text-3xl leading-tight font-medium tracking-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-about-display), serif" }}
            >
              Earth, fire, and the hands of women
            </h2>
            <p className="mt-5 text-base leading-7 text-[#4a433b] sm:text-lg sm:leading-8">
              In the Cap Bon village of Sejnane, pottery is a maternal craft —
              coiling, burnishing, and firing clay with techniques passed from
              mother to daughter. UNESCO recognizes this living tradition as
              Intangible Cultural Heritage of Humanity.
            </p>
            <p className="mt-4 text-base leading-7 text-[#4a433b] sm:text-lg sm:leading-8">
              Each vessel keeps the mark of the maker: irregular rims, smoked
              blacks, ochre washes. Hannibal HERITAGE brings these pieces
              forward without sanding away their origin.
            </p>
            <Link
              href="/sajnen"
              className="mt-8 inline-flex min-h-11 items-center border border-[#1c1917] px-5 text-xs tracking-[0.18em] text-[#1c1917] uppercase transition hover:bg-[#1c1917] hover:text-[#f7f3ec]"
            >
              Explore Sejnane
            </Link>
          </div>
        </section>
      </AboutReveal>

      <section className="relative overflow-hidden border-y border-[#d7cdb8]/80 bg-[#2a3126] text-[#f3efe6]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(232,223,198,0.18), transparent 40%), radial-gradient(circle at 80% 80%, rgba(120,100,70,0.25), transparent 45%)",
          }}
          aria-hidden
        />
        <AboutReveal className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 max-w-xl lg:order-1">
            <p className="text-[11px] tracking-[0.24em] text-[#cbbfa8] uppercase">
              Olive wood
            </p>
            <h2
              className="mt-3 text-3xl leading-tight font-medium tracking-tight text-[#f7f3ec] sm:text-5xl"
              style={{ fontFamily: "var(--font-about-display), serif" }}
            >
              Grain from ancient groves
            </h2>
            <p className="mt-5 text-base leading-7 text-[#d8d0c2] sm:text-lg sm:leading-8">
              Tunisia’s olive trees stand for centuries. From their dense,
              swirling timber, artisans cut boards, bowls, and utensils —
              sanded smooth, never lacquered into anonymity.
            </p>
            <p className="mt-4 text-base leading-7 text-[#d8d0c2] sm:text-lg sm:leading-8">
              Olive wood carries warmth to the table: honeyed veins, soft
              weight in the hand, a Mediterranean quiet that belongs in daily
              ritual as much as in display.
            </p>
            <Link
              href="/olive-wood"
              className="mt-8 inline-flex min-h-11 items-center border border-[#f7f3ec]/70 px-5 text-xs tracking-[0.18em] text-[#f7f3ec] uppercase transition hover:bg-[#f7f3ec] hover:text-[#1c1917]"
            >
              Explore olive wood
            </Link>
          </div>
          <div className="relative order-1 aspect-[4/5] overflow-hidden bg-[#1c1917] lg:order-2">
            <Image
              src="/home/olive-wood-featured.png"
              alt="Handcrafted olive wood serving board"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </AboutReveal>
      </section>

      <AboutReveal className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="text-[11px] tracking-[0.24em] text-[#6f675c] uppercase">
          Our promise
        </p>
        <h2
          className="mt-4 text-3xl leading-tight font-medium tracking-tight text-balance sm:text-5xl"
          style={{ fontFamily: "var(--font-about-display), serif" }}
        >
          Heritage you can hold
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#4a433b] sm:text-lg sm:leading-8">
          Hannibal HERITAGE is a bridge between Tunisian ateliers and your
          home — authentic materials, transparent craft, and objects meant to
          last beyond a season.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sajnen"
            className="inline-flex min-h-11 items-center bg-[#1c1917] px-5 text-xs tracking-[0.18em] text-[#f7f3ec] uppercase transition hover:bg-transparent hover:text-[#1c1917] hover:outline hover:outline-1 hover:outline-[#1c1917]"
          >
            Shop Sejnane
          </Link>
          <Link
            href="/olive-wood"
            className="inline-flex min-h-11 items-center border border-[#1c1917] px-5 text-xs tracking-[0.18em] text-[#1c1917] uppercase transition hover:bg-[#1c1917] hover:text-[#f7f3ec]"
          >
            Shop olive wood
          </Link>
        </div>
      </AboutReveal>
    </div>
  );
}
