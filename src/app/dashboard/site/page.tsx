import { AdminSiteContent } from "@/components/admin-site-content";
import {
  getSiteSettings,
  listAdminHomeTemplates,
} from "@/lib/site-content";

export default async function DashboardSitePage() {
  const [settings, templates] = await Promise.all([
    getSiteSettings(),
    listAdminHomeTemplates(),
  ]);

  return (
    <main className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Site content
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e] sm:text-base">
          Edit home featured templates for Sejnane and olive wood, publish or
          hide the hero, and toggle header menu visibility.
        </p>
      </header>
      <AdminSiteContent
        initialSettings={settings}
        initialTemplates={templates}
      />
    </main>
  );
}
