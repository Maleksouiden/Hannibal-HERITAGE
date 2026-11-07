import type { Catalog } from "@/generated/prisma/client";
import { HOME_TEMPLATES, type HomeTemplate } from "@/lib/home-templates";
import { ensureDbRuntime, prisma } from "@/lib/prisma";

export type SiteMenuFlags = {
  showAccueil: boolean;
  showSajnen: boolean;
  showOliveWood: boolean;
  showAPropos: boolean;
};

export type SiteSettingsView = SiteMenuFlags & {
  homeHeroPublished: boolean;
};

export type HomeTemplateAdmin = HomeTemplate & {
  isPublished: boolean;
  sortOrder: number;
  catalogDb: Catalog;
};

const DEFAULT_SETTINGS: SiteSettingsView = {
  homeHeroPublished: true,
  showAccueil: true,
  showSajnen: true,
  showOliveWood: true,
  showAPropos: true,
};

function catalogToClient(catalog: Catalog): HomeTemplate["catalog"] {
  return catalog === "SAJNEN" ? "sajnen" : "olive-wood";
}

function catalogToDb(catalog: HomeTemplate["catalog"]): Catalog {
  return catalog === "sajnen" ? "SAJNEN" : "OLIVE_WOOD";
}

function mapTemplate(row: {
  id: string;
  catalog: Catalog;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  isPublished: boolean;
  sortOrder: number;
}): HomeTemplateAdmin {
  return {
    id: row.id,
    catalog: catalogToClient(row.catalog),
    catalogDb: row.catalog,
    title: row.title,
    body: row.body,
    ctaLabel: row.ctaLabel,
    href: row.href,
    imageSrc: row.imageSrc,
    imageAlt: row.imageAlt,
    isPublished: row.isPublished,
    sortOrder: row.sortOrder,
  };
}

export async function ensureSiteContentSeeded(): Promise<void> {
  // Must not catch — connection() postpone signals are not DB failures.
  await ensureDbRuntime();
  try {
    const existing = await prisma.homeFeaturedTemplate.count();
    if (existing === 0) {
      for (const [index, template] of HOME_TEMPLATES.entries()) {
        await prisma.homeFeaturedTemplate.create({
          data: {
            id: template.id,
            catalog: catalogToDb(template.catalog),
            title: template.title,
            body: template.body,
            ctaLabel: template.ctaLabel,
            href: template.href,
            imageSrc: template.imageSrc,
            imageAlt: template.imageAlt,
            isPublished: true,
            sortOrder: index,
          },
        });
      }
    }
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default" },
    });
  } catch {
    /* DB unavailable — callers fall back to static */
  }
}

export async function getSiteSettings(): Promise<SiteSettingsView> {
  await ensureSiteContentSeeded();
  try {
    const row = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    if (!row) return DEFAULT_SETTINGS;
    return {
      homeHeroPublished: row.homeHeroPublished,
      showAccueil: row.menuShowAccueil,
      showSajnen: row.menuShowSajnen,
      showOliveWood: row.menuShowOliveWood,
      showAPropos: row.menuShowAPropos,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Published home slides for the storefront (static fallback). */
export async function getPublishedHomeTemplates(): Promise<HomeTemplate[]> {
  await ensureSiteContentSeeded();
  try {
    const settings = await getSiteSettings();
    if (!settings.homeHeroPublished) return [];

    const rows = await prisma.homeFeaturedTemplate.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return HOME_TEMPLATES;
    return rows.map((row) => ({
      id: row.id,
      catalog: catalogToClient(row.catalog),
      title: row.title,
      body: row.body,
      ctaLabel: row.ctaLabel,
      href: row.href,
      imageSrc: row.imageSrc,
      imageAlt: row.imageAlt,
    }));
  } catch {
    return HOME_TEMPLATES;
  }
}

export async function listAdminHomeTemplates(): Promise<HomeTemplateAdmin[]> {
  await ensureSiteContentSeeded();
  const rows = await prisma.homeFeaturedTemplate.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(mapTemplate);
}

export async function updateHomeTemplate(
  id: string,
  data: {
    title?: string;
    body?: string;
    ctaLabel?: string;
    href?: string;
    imageSrc?: string;
    imageAlt?: string;
    isPublished?: boolean;
    sortOrder?: number;
  },
): Promise<HomeTemplateAdmin> {
  const row = await prisma.homeFeaturedTemplate.update({
    where: { id },
    data,
  });
  return mapTemplate(row);
}

export async function updateSiteSettings(
  data: Partial<SiteSettingsView>,
): Promise<SiteSettingsView> {
  await ensureSiteContentSeeded();
  const patch: {
    homeHeroPublished?: boolean;
    menuShowAccueil?: boolean;
    menuShowSajnen?: boolean;
    menuShowOliveWood?: boolean;
    menuShowAPropos?: boolean;
  } = {};
  if (data.homeHeroPublished !== undefined) {
    patch.homeHeroPublished = data.homeHeroPublished;
  }
  if (data.showAccueil !== undefined) patch.menuShowAccueil = data.showAccueil;
  if (data.showSajnen !== undefined) patch.menuShowSajnen = data.showSajnen;
  if (data.showOliveWood !== undefined) {
    patch.menuShowOliveWood = data.showOliveWood;
  }
  if (data.showAPropos !== undefined) patch.menuShowAPropos = data.showAPropos;

  const row = await prisma.siteSettings.update({
    where: { id: "default" },
    data: patch,
  });
  return {
    homeHeroPublished: row.homeHeroPublished,
    showAccueil: row.menuShowAccueil,
    showSajnen: row.menuShowSajnen,
    showOliveWood: row.menuShowOliveWood,
    showAPropos: row.menuShowAPropos,
  };
}
