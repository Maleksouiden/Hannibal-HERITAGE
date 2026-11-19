"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { HomeTemplate } from "@/lib/home-templates";

const AUTO_MS = 7000;

type HomeFeaturedTemplatesProps = {
  templates: HomeTemplate[];
};

export function HomeFeaturedTemplates({ templates }: HomeFeaturedTemplatesProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeIndex = templates.length > 0 ? active % templates.length : 0;

  useEffect(() => {
    if (paused || templates.length < 2) return;
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % templates.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, templates.length]);

  if (templates.length === 0) return null;

  return (
    <section
      className="relative isolate -mt-16 min-h-[100svh] w-full overflow-hidden bg-[#1c1917] sm:-mt-20"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {templates.map((template, index) => {
        const isActive = index === activeIndex;
        return (
          <article
            key={template.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              isActive ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={template.imageSrc}
              alt={template.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[8000ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#151311]/85 via-[#151311]/35 to-[#151311]/10"
              aria-hidden
            />

            <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-6xl flex-col items-start gap-4 px-5 pb-28 pt-28 sm:gap-5 sm:px-8 sm:pb-32 lg:px-10">
              <p className="flex items-center gap-3 text-[10px] tracking-[0.28em] text-white/85 uppercase sm:text-xs">
                <span className="h-px w-8 bg-white/70" aria-hidden />
                {template.catalog === "sajnen" ? "Sejnane" : "Olive wood"}
              </p>
              <h1
                className="max-w-3xl text-4xl leading-[1.05] font-medium tracking-tight text-balance text-white sm:text-5xl md:text-6xl"
                style={{ fontFamily: "var(--font-home-display), serif" }}
              >
                {template.title}
              </h1>
              <p className="max-w-xl text-sm leading-6 text-white/85 sm:text-base sm:leading-8">
                {template.body}
              </p>
              <Link
                href={template.href}
                className="mt-2 inline-flex min-h-12 items-center gap-5 bg-white px-6 text-[10px] tracking-[0.2em] text-[#1c1917] uppercase transition hover:bg-[#eee9e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c1917]"
                tabIndex={isActive ? 0 : -1}
              >
                {template.ctaLabel}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        );
      })}

      {templates.length > 1 ? (
        <div className="absolute right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-10 flex items-center gap-2 sm:right-8 lg:right-[max(calc((100vw-72rem)/2),2.5rem)]">
          {templates.map((template, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={template.id}
                type="button"
                aria-label={`Show ${template.catalog === "sajnen" ? "Sejnane" : "Olive wood"} slide`}
                aria-current={selected}
                className="flex min-h-11 min-w-11 items-center justify-center"
                onClick={() => setActive(index)}
              >
                <span
                  className={`block h-1 transition-all duration-500 ${
                    selected ? "w-8 bg-white" : "w-4 bg-white/45"
                  }`}
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <a
        href="#intro"
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-5 z-10 hidden items-center gap-3 text-[9px] tracking-[0.2em] text-white/75 uppercase sm:flex lg:left-[max(calc((100vw-72rem)/2),2.5rem)]"
      >
        <span className="flex size-9 items-center justify-center rounded-full border border-white/45">
          <span aria-hidden>↓</span>
        </span>
        Scroll to discover
      </a>
    </section>
  );
}
