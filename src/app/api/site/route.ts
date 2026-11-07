import { NextResponse } from "next/server";
import {
  getPublishedHomeTemplates,
  getSiteSettings,
} from "@/lib/site-content";

/** Public storefront site chrome + published home templates. */
export async function GET() {
  const [settings, templates] = await Promise.all([
    getSiteSettings(),
    getPublishedHomeTemplates(),
  ]);
  return NextResponse.json({ settings, templates });
}
