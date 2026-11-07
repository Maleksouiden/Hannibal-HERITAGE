"use client";

import Image from "next/image";
import { useState } from "react";
import type { HomeTemplateAdmin, SiteSettingsView } from "@/lib/site-content";

type AdminSiteContentProps = {
  initialSettings: SiteSettingsView;
  initialTemplates: HomeTemplateAdmin[];
};

const fieldClass =
  "min-h-11 w-full border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm";

export function AdminSiteContent({
  initialSettings,
  initialTemplates,
}: AdminSiteContentProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [templates, setTemplates] = useState(initialTemplates);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function saveSettings(next: SiteSettingsView) {
    setPending("settings");
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/site", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(next),
      });
      const data = (await response.json()) as {
        settings?: SiteSettingsView;
        error?: string;
      };
      if (!response.ok || !data.settings) {
        throw new Error(data.error ?? "Failed to save settings");
      }
      setSettings(data.settings);
      setMessage("Site settings saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setPending(null);
    }
  }

  async function saveTemplate(template: HomeTemplateAdmin) {
    setPending(template.id);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/site/templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          title: template.title,
          body: template.body,
          ctaLabel: template.ctaLabel,
          href: template.href,
          imageSrc: template.imageSrc,
          imageAlt: template.imageAlt,
          isPublished: template.isPublished,
          sortOrder: template.sortOrder,
        }),
      });
      const data = (await response.json()) as {
        template?: HomeTemplateAdmin;
        error?: string;
      };
      if (!response.ok || !data.template) {
        throw new Error(data.error ?? "Failed to save template");
      }
      setTemplates((prev) =>
        prev.map((row) => (row.id === template.id ? data.template! : row)),
      );
      setMessage(`Saved ${template.catalog} template`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setPending(null);
    }
  }

  function updateTemplate(
    id: string,
    patch: Partial<HomeTemplateAdmin>,
  ) {
    setTemplates((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      {message ? <p className="text-sm text-[#5c564e]">{message}</p> : null}

      <section className="flex flex-col gap-4">
        <h3 className="text-sm tracking-[0.16em] text-[#8a8278] uppercase">
          Sections &amp; menus
        </h3>
        <label className="flex min-h-11 items-center gap-3 text-sm text-[#5c564e]">
          <input
            type="checkbox"
            checked={settings.homeHeroPublished}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                homeHeroPublished: event.target.checked,
              }))
            }
            className="size-4"
          />
          Publish home featured hero
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ["showAccueil", "Menu: Accueil"],
              ["showSajnen", "Menu: Sejnane"],
              ["showOliveWood", "Menu: Olive wood"],
              ["showAPropos", "Menu: À propos"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex min-h-11 items-center gap-3 text-sm text-[#5c564e]"
            >
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    [key]: event.target.checked,
                  }))
                }
                className="size-4"
              />
              {label}
            </label>
          ))}
        </div>
        <button
          type="button"
          disabled={pending === "settings"}
          onClick={() => void saveSettings(settings)}
          className="inline-flex min-h-11 w-fit items-center border border-[#1c1917] bg-[#1c1917] px-4 text-xs tracking-[0.16em] text-[#f7f3ec] uppercase disabled:opacity-50"
        >
          {pending === "settings" ? "Saving…" : "Save settings"}
        </button>
      </section>

      <section className="flex flex-col gap-8">
        <h3 className="text-sm tracking-[0.16em] text-[#8a8278] uppercase">
          Home featured templates
        </h3>
        {templates.map((template) => (
          <article
            key={template.id}
            className="flex flex-col gap-4 border-t border-[#ddd4c5]/70 pt-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-lg font-semibold tracking-tight">
                {template.catalog === "sajnen" ? "Sejnane" : "Olive wood"}
              </h4>
              <label className="flex min-h-11 items-center gap-2 text-xs tracking-[0.12em] text-[#5c564e] uppercase">
                <input
                  type="checkbox"
                  checked={template.isPublished}
                  onChange={(event) =>
                    updateTemplate(template.id, {
                      isPublished: event.target.checked,
                    })
                  }
                  className="size-4"
                />
                Published
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
              <div className="relative aspect-square bg-[#ebe4d8]">
                {template.imageSrc ? (
                  <Image
                    src={template.imageSrc}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="160px"
                  />
                ) : null}
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
                  Title
                  <input
                    value={template.title}
                    onChange={(event) =>
                      updateTemplate(template.id, { title: event.target.value })
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
                  Body
                  <textarea
                    rows={4}
                    value={template.body}
                    onChange={(event) =>
                      updateTemplate(template.id, { body: event.target.value })
                    }
                    className={`${fieldClass} min-h-28`}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
                    CTA label
                    <input
                      value={template.ctaLabel}
                      onChange={(event) =>
                        updateTemplate(template.id, {
                          ctaLabel: event.target.value,
                        })
                      }
                      className={fieldClass}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
                    CTA href
                    <input
                      value={template.href}
                      onChange={(event) =>
                        updateTemplate(template.id, { href: event.target.value })
                      }
                      className={fieldClass}
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
                  Image path / URL
                  <input
                    value={template.imageSrc}
                    onChange={(event) =>
                      updateTemplate(template.id, {
                        imageSrc: event.target.value,
                      })
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
                  Image alt
                  <input
                    value={template.imageAlt}
                    onChange={(event) =>
                      updateTemplate(template.id, {
                        imageAlt: event.target.value,
                      })
                    }
                    className={fieldClass}
                  />
                </label>
                <button
                  type="button"
                  disabled={pending === template.id}
                  onClick={() => void saveTemplate(template)}
                  className="inline-flex min-h-11 w-fit items-center border border-[#1c1917] bg-[#1c1917] px-4 text-xs tracking-[0.16em] text-[#f7f3ec] uppercase disabled:opacity-50"
                >
                  {pending === template.id ? "Saving…" : "Save template"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
