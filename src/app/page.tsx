import { HomeLanding } from "@/components/home-landing";
import { listCatalogProducts } from "@/lib/catalog-repository";
import { getPublishedHomeTemplates } from "@/lib/site-content";

export default async function Home() {
  const [templates, sajnen, olive] = await Promise.all([
    getPublishedHomeTemplates(),
    listCatalogProducts("SAJNEN"),
    listCatalogProducts("OLIVE_WOOD"),
  ]);

  const featuredProducts = [...sajnen.slice(0, 2), ...olive.slice(0, 2)];

  return <HomeLanding templates={templates} featuredProducts={featuredProducts} />;
}
