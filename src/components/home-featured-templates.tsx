"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HOME_TEMPLATES } from "@/lib/home-templates";

const AUTO_MS = 7000;

/**
 * Moving featured templates under the sticky logo (SCRUM-7).
 * Notion: each slide is a product-family story (Sejnane / olive wood),
 * inspired by artisancollection-style rotating collection heroes.
 */
export function HomeFeaturedTemplates() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || HOME_TEMPLATES.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % HOME_TEMPLATES.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative isolate min-h-[calc(100dvh-4rem)] w-full overflow-hidden bg-[#1c1917]"
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
      {HOME_TEMPLATES.map((template, index) => {
        const isActive = index === active;
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
              className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/85 via-[#1c1917]/35 to-[#1c1917]/10"
              aria-hidden
            />

            <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-6xl flex-col gap-5 px-4 pb-16 pt-24 sm:px-6 sm:pb-20">
              <p className="text-xs tracking-[0.22em] text-[#e8dfd0]/80 uppercase">
                {template.catalog === "sajnen" ? "Sejnane" : "Olive wood"}
              </p>
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-[#f7f3ec] sm:text-5xl">
                {template.title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-[#e8dfd0]/90 sm:text-lg sm:leading-8">
                {template.body}
              </p>
              <div>
                <Link
                  href={template.href}
                  className="inline-block border border-[#f7f3ec]/70 px-5 py-3 text-xs tracking-[0.18em] text-[#f7f3ec] uppercase transition hover:bg-[#f7f3ec] hover:text-[#1c1917]"
                  tabIndex={isActive ? 0 : -1}
                >
                  {template.ctaLabel}
                </Link>
              </div>
            </div>
          </article>
        );
      })}

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {HOME_TEMPLATES.map((template, index) => (
          <button
            key={template.id}
            type="button"
            aria-label={`Show ${template.catalog === "sajnen" ? "Sejnane" : "Olive wood"} template`}
            aria-current={index === active}
            className={`h-1.5 transition-all duration-500 ${
              index === active
                ? "w-8 bg-[#f7f3ec]"
                : "w-3 bg-[#f7f3ec]/40 hover:bg-[#f7f3ec]/70"
            }`}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  );
}
