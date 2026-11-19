export type HomeTemplate = {
  id: string;
  catalog: "sajnen" | "olive-wood";
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

/**
 * Featured home templates from Notion HOME PAGE (SCRUM-7).
 * Copy sourced from Hannibal HERITAGE Content notes (Sejnane + olive wood).
 * Images are local copies of client-supplied Notion assets in `public/home/`.
 */
export const HOME_TEMPLATES: HomeTemplate[] = [
  {
    id: "sajnen",
    catalog: "sajnen",
    title: "Timeless Artistry, Handcrafted by Women of Sejnane",
    body: "Discover the beauty of authentic Tunisian pottery, shaped by skilled women artisans and rooted in a centuries-old tradition recognized by UNESCO as Intangible Cultural Heritage.",
    ctaLabel: "Explore Sejnane",
    href: "/sajnen",
    imageSrc: "/home/sejnane-artisan.jpg",
    imageAlt: "Sejnane artisan shaping a terracotta pot",
  },
  {
    id: "olive-wood",
    catalog: "olive-wood",
    title: "Rooted in Nature, Shaped by Tradition",
    body: "Discover the heart of Tunisia’s ancient olive groves, where natural beauty meets exceptional craftsmanship. Each piece is carefully handcrafted from natural olive wood, bringing Mediterranean warmth and timeless elegance into your home.",
    ctaLabel: "Explore Olive Wood",
    href: "/olive-wood",
    imageSrc: "/home/olive-wood-featured.png",
    imageAlt: "Handcrafted olive wood serving board",
  },
];
