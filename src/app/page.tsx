import { Suspense } from "react";
import { HomeLanding } from "@/components/home-landing";
import { listCatalogProducts } from "@/lib/catalog-repository";
import { getPublishedHomeTemplates } from "@/lib/site-content";

async function HomeContent() {
  const [templates, sajnen, olive] = await Promise.all([
    getPublishedHomeTemplates(),
    listCatalogProducts("SAJNEN"),
    listCatalogProducts("OLIVE_WOOD"),
  ]);

  const featuredProducts = [...sajnen.slice(0, 2), ...olive.slice(0, 2)];

  return (
    <HomeLanding templates={templates} featuredProducts={featuredProducts} />
  );
}

function HomeFallback() {
  return (
    <div
      className="min-h-[70vh] w-full animate-pulse bg-[#1c1917]"
      aria-hidden
    />
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
