import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  listAdminHomeTemplates,
  getSiteSettings,
  updateSiteSettings,
  type SiteSettingsView,
} from "@/lib/site-content";

export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const [settings, templates] = await Promise.all([
    getSiteSettings(),
    listAdminHomeTemplates(),
  ]);

  return NextResponse.json({ settings, templates });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  let body: Partial<SiteSettingsView>;
  try {
    body = (await request.json()) as Partial<SiteSettingsView>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const settings = await updateSiteSettings({
    homeHeroPublished:
      body.homeHeroPublished !== undefined
        ? Boolean(body.homeHeroPublished)
        : undefined,
    showAccueil:
      body.showAccueil !== undefined ? Boolean(body.showAccueil) : undefined,
    showSajnen:
      body.showSajnen !== undefined ? Boolean(body.showSajnen) : undefined,
    showOliveWood:
      body.showOliveWood !== undefined ? Boolean(body.showOliveWood) : undefined,
    showAPropos:
      body.showAPropos !== undefined ? Boolean(body.showAPropos) : undefined,
  });

  return NextResponse.json({ settings });
}
