import { Cormorant_Garamond, Figtree } from "next/font/google";
import Link from "next/link";
import { DisplayPrice } from "@/components/display-price";
import { HomeFeaturedTemplates } from "@/components/home-featured-templates";
import { ZoomImage } from "@/components/zoom-image";
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
      className={`${display.variable} ${body.variable} flex w-full flex-1 flex-col bg-white text-[#1c1917]`}
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

      <section id="intro" className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-12">
        <div>
          <p className="flex items-center gap-3 text-[10px] tracking-[0.24em] text-[#8a8278] uppercase sm:text-[11px]">
            <span className="h-px w-8 bg-[#9b7653]" aria-hidden />
            Welcome to Hannibal HERITAGE
          </p>
          <h2
            className="mt-5 max-w-3xl text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl"
            style={{ fontFamily: "var(--font-home-display), serif" }}
          >
            Unique pieces, shaped by tradition and made for your home.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[#5c564e] sm:text-base sm:leading-8">
          We celebrate craftsmanship, elegance, and heritage — sharing the
          stories behind creations from Sejnane pottery ateliers and Tunisia’s
          olive wood workshops.
        </p>
      </section>

      <section className="border-y border-[#e9e3d9] bg-[#f7f3ec]">
        <ul className="mx-auto grid w-full max-w-6xl divide-y divide-[#ded5c8] px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          <li className="flex items-center gap-4 py-5 sm:px-5 sm:py-6 first:sm:pl-0">
            <span className="font-serif text-2xl text-[#9b7653]" aria-hidden>
              01
            </span>
            <span>
              <span className="block text-xs font-medium text-[#1c1917]">
                Living heritage
              </span>
              <span className="mt-1 block text-xs text-[#756b5d]">
                Sejnane pottery
              </span>
            </span>
          </li>
          <li className="flex items-center gap-4 py-5 sm:px-5 sm:py-6">
            <span className="font-serif text-2xl text-[#9b7653]" aria-hidden>
              02
            </span>
            <span>
              <span className="block text-xs font-medium text-[#1c1917]">
                Natural materials
              </span>
              <span className="mt-1 block text-xs text-[#756b5d]">
                Tunisian olive wood
              </span>
            </span>
          </li>
          <li className="flex items-center gap-4 py-5 sm:px-5 sm:py-6 sm:pr-0">
            <span className="font-serif text-2xl text-[#9b7653]" aria-hidden>
              03
            </span>
            <span>
              <span className="block text-xs font-medium text-[#1c1917]">
                Made by hand
              </span>
              <span className="mt-1 block text-xs text-[#756b5d]">
                Crafted in Tunisia
              </span>
            </span>
          </li>
        </ul>
      </section>

      <section className="border-b border-[#e8e8e5] bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] tracking-[0.24em] text-[#8a8278] uppercase sm:text-[11px]">
            Two traditions, one heritage
          </p>
          <h2
            className="mt-3 max-w-2xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-home-display), serif" }}
          >
            Crafted by hand. Rooted in Tunisia.
          </h2>
          <ul className="mt-9 grid gap-5 md:grid-cols-2 md:gap-6">
            <li>
              <Link
                href="/sajnen"
                className="group grid overflow-hidden border border-[#e8e8e5] bg-white transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(28,25,23,0.07)]"
              >
                <div className="group/image relative aspect-[16/10] overflow-hidden bg-white">
                  <ZoomImage
                    src="/home/tinja-pottery.webp"
                    alt="Sejnane pottery in an artisan workshop"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-start p-5 sm:p-7">
                  <p className="text-[10px] tracking-[0.2em] text-[#8a8278] uppercase">
                    UNESCO intangible heritage
                  </p>
                  <h3
                    className="mt-2 text-2xl font-medium"
                    style={{ fontFamily: "var(--font-home-display), serif" }}
                  >
                    Women of Sejnane
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#5c564e]">
                    Pottery shaped and fired by women artisans of Cap Bon, in a
                    tradition passed from one generation to the next.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-3 text-[10px] tracking-[0.16em] text-[#1c1917] uppercase">
                    Explore Sejnane <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                href="/olive-wood"
                className="group grid overflow-hidden border border-[#e8e8e5] bg-white transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(28,25,23,0.07)]"
              >
                <div className="group/image relative aspect-[16/10] overflow-hidden bg-white">
                  <ZoomImage
                    src="/home/olive-wood-featured.png"
                    alt="Olive wood craft"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col items-start p-5 sm:p-7">
                  <p className="text-[10px] tracking-[0.2em] text-[#8a8278] uppercase">
                    From ancient groves
                  </p>
                  <h3
                    className="mt-2 text-2xl font-medium"
                    style={{ fontFamily: "var(--font-home-display), serif" }}
                  >
                    Olive wood makers
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#5c564e]">
                    Boards, bowls, and utensils shaped from Tunisian olive wood,
                    each piece revealing its own natural grain.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-3 text-[10px] tracking-[0.16em] text-[#1c1917] uppercase">
                    Explore olive wood <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {featuredProducts.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#e8e8e5] pb-6">
            <div>
              <p className="text-[10px] tracking-[0.24em] text-[#8a8278] uppercase sm:text-[11px]">
                Selected for you
              </p>
              <h2
                className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl"
                style={{ fontFamily: "var(--font-home-display), serif" }}
              >
                Handcrafted for the table
              </h2>
            </div>
            <div className="flex gap-5 text-[10px] tracking-[0.14em] uppercase">
              <Link href="/sajnen" className="underline decoration-[#cfc4b2] underline-offset-4">
                Sejnane
              </Link>
              <Link href="/olive-wood" className="underline decoration-[#cfc4b2] underline-offset-4">
                Olive wood
              </Link>
            </div>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <li key={`${product.catalog}-${product.slug}`}>
                <Link
                  href={`/${product.catalog === "SAJNEN" ? "sajnen" : "olive-wood"}/${product.slug}`}
                  className="group flex flex-col gap-3"
                >
                  <div className="group/image relative aspect-square overflow-hidden border border-[#e9e3d9] bg-[#fbfaf8] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(28,25,23,0.08)]">
                    <ZoomImage
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-4 sm:p-6"
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

      <section className="border-t border-[#e8e8e5] bg-white px-4 py-16 sm:px-6 sm:py-20">
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
              image="/home/tinja-pottery.webp"
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
        <div className="group/image relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-[#eeeeeb] bg-white">
          <ZoomImage
            src={image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain"
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
