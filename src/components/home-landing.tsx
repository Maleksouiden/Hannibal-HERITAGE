import { Cormorant_Garamond, Figtree } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { DisplayPrice } from "@/components/display-price";
import { HomeFeaturedTemplates } from "@/components/home-featured-templates";
import type { CatalogProduct } from "@/lib/catalog-repository";
import type { HomeTemplate } from "@/lib/home-templates";
import { productPriceMinor } from "@/lib/product-display";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-home-display",
});

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-home-body",
});

type HomeLandingProps = {
  templates: HomeTemplate[];
  featuredProducts: CatalogProduct[];
};

export function HomeLanding({ templates, featuredProducts }: HomeLandingProps) {
  return (
    <div
      className={`${display.variable} ${body.variable} flex w-full flex-1 flex-col bg-[#f7f3ec] text-[#1c1917]`}
      style={{ fontFamily: "var(--font-home-body), sans-serif" }}
    >
      {templates.length > 0 ? (
        <HomeFeaturedTemplates templates={templates} />
      ) : (
        <section className="mx-auto flex w-full max-w-6xl flex-col justify-center px-4 py-24 sm:px-6">
          <p className="text-xs tracking-[0.22em] text-[#8a8278] uppercase">
            Hannibal HERITAGE
          </p>
          <h1
            className="mt-3 max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-home-display), serif" }}
          >
            Artisan collections from Tunisia
          </h1>
        </section>
      )}

      <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="text-[11px] tracking-[0.24em] text-[#8a8278] uppercase">
          Welcome to Hannibal HERITAGE
        </p>
        <h2
          className="mt-4 text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl"
          style={{ fontFamily: "var(--font-home-display), serif" }}
        >
          Unique pieces handcrafted for you with timeless design and love for
          slow living
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#5c564e] sm:text-base">
          We celebrate craftsmanship, elegance, and heritage — narrating the
          story behind each creation from Sejnane pottery ateliers and Tunisia’s
          olive wood workshops.
        </p>
      </section>

      <section className="border-y border-[#e4dccf] bg-[#efe8dc] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[11px] tracking-[0.24em] text-[#8a8278] uppercase">
            Featured artisans
          </p>
          <h2
            className="mt-3 text-center text-3xl font-medium tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-home-display), serif" }}
          >
            Collections rooted in place
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            <li>
              <Link href="/sajnen" className="group block overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#ebe4d8]">
                  <Image
                    src="/home/sajnen-featured.png"
                    alt="Sejnane pottery"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 text-[10px] tracking-[0.2em] text-[#8a8278] uppercase">
                  UNESCO heritage
                </p>
                <h3
                  className="mt-1 text-2xl font-medium"
                  style={{ fontFamily: "var(--font-home-display), serif" }}
                >
                  Women of Sejnane
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5c564e]">
                  Pottery coiled and fired by women artisans of Cap Bon —
                  Intangible Cultural Heritage of Humanity.
                </p>
                <span className="mt-4 inline-flex text-xs tracking-[0.16em] text-[#1c1917] uppercase underline decoration-[#cfc4b2] underline-offset-4">
                  View collection
                </span>
              </Link>
            </li>
            <li>
              <Link href="/olive-wood" className="group block overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#ebe4d8]">
                  <Image
                    src="/home/olive-wood-featured.png"
                    alt="Olive wood craft"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 text-[10px] tracking-[0.2em] text-[#8a8278] uppercase">
                  From ancient groves
                </p>
                <h3
                  className="mt-1 text-2xl font-medium"
                  style={{ fontFamily: "var(--font-home-display), serif" }}
                >
                  Olive wood makers
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5c564e]">
                  Boards, bowls, and utensils shaped from Tunisian olive timber —
                  grain that carries Mediterranean warmth.
                </p>
                <span className="mt-4 inline-flex text-xs tracking-[0.16em] text-[#1c1917] uppercase underline decoration-[#cfc4b2] underline-offset-4">
                  View collection
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {featuredProducts.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-[0.24em] text-[#8a8278] uppercase">
                Featured
              </p>
              <h2
                className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl"
                style={{ fontFamily: "var(--font-home-display), serif" }}
              >
                Handcrafted for the table
              </h2>
            </div>
            <Link
              href="/sajnen"
              className="text-xs tracking-[0.16em] text-[#1c1917] uppercase underline decoration-[#cfc4b2] underline-offset-4"
            >
              Feel it — browse Sejnane
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <li key={`${product.catalog}-${product.slug}`}>
                <Link
                  href={`/${product.catalog === "SAJNEN" ? "sajnen" : "olive-wood"}/${product.slug}`}
                  className="group flex flex-col gap-3"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#ebe4d8]">
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3
                    className="text-sm leading-snug sm:text-base"
                    style={{ fontFamily: "var(--font-home-display), serif" }}
                  >
                    {product.name}
                  </h3>
                  <DisplayPrice
                    priceMinor={productPriceMinor(product)}
                    sourceCurrency={product.currency}
                    className="text-sm font-semibold text-[#1c1917]"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="border-t border-[#e4dccf] bg-[#efe8dc] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] tracking-[0.24em] text-[#8a8278] uppercase">
            Latest notes
          </p>
          <h2
            className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-home-display), serif" }}
          >
            Stories behind the craft
          </h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            <EditorialCard
              tag="Heritage"
              title="Sejnane and UNESCO living tradition"
              href="/a-propos"
              image="/catalog/sajnen/beige-terracotta-sajnen-vessel.png"
            />
            <EditorialCard
              tag="Makers"
              title="Meet the women shaping Cap Bon clay"
              href="/sajnen"
              image="/catalog/sajnen/black-bumpy-bowl.jpg"
            />
            <EditorialCard
              tag="Materials"
              title="Why olive wood belongs on the table"
              href="/olive-wood"
              image="/home/olive-wood-featured.png"
            />
          </ul>
        </div>
      </section>
    </div>
  );
}

function EditorialCard({
  tag,
  title,
  href,
  image,
}: {
  tag: string;
  title: string;
  href: string;
  image: string;
}) {
  return (
    <li>
      <Link href={href} className="group block">
        <div className="relative mb-4 aspect-[16/10] overflow-hidden bg-[#ebe4d8]">
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        </div>
        <p className="text-[10px] tracking-[0.2em] text-[#8a8278] uppercase">
          {tag}
        </p>
        <h3
          className="mt-2 text-xl leading-snug font-medium"
          style={{ fontFamily: "var(--font-home-display), serif" }}
        >
          {title}
        </h3>
      </Link>
    </li>
  );
}
