import { HomeFeaturedTemplates } from "@/components/home-featured-templates";
import { getPublishedHomeTemplates } from "@/lib/site-content";

export default async function Home() {
  const templates = await getPublishedHomeTemplates();

  return (
    <main className="flex w-full flex-1 flex-col">
      {templates.length > 0 ? (
        <HomeFeaturedTemplates templates={templates} />
      ) : (
        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
          <p className="text-xs tracking-[0.22em] text-[#8a8278] uppercase">
            Hannibal HERITAGE
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Artisan collections from Tunisia
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#5c564e] sm:text-base sm:leading-7">
            The home featured banner is unpublished. Browse Sejnane and olive
            wood from the menu.
          </p>
        </section>
      )}
    </main>
  );
}
