/**
 * Static olive wood catalog seed (SCRUM-9).
 * Derived from Notion "olive wood products" + local images under public/catalog/olive-wood.
 * Shape mirrors Prisma Product (+ primary image) so MySQL/admin CRUD can replace this later.
 */

import type { SeedProduct } from "./sajnen-products";

const DESCRIPTION =
  "Handcrafted from natural Tunisian olive wood — Mediterranean warmth and timeless craftsmanship.";

export const OLIVE_WOOD_PRODUCTS: SeedProduct[] = [
  { slug: "28-cm-cutting-board", name: "28 cm Cutting Board", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/28-cm-cutting-board.webp", imageAlt: "28 cm Cutting Board" },
  { slug: "35-cm-cutting-board", name: "35 cm Cutting Board", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/35-cm-cutting-board.webp", imageAlt: "35 cm Cutting Board" },
  { slug: "atelier-spoon-set", name: "Atelier Spoon Set", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/atelier-spoon-set.png", imageAlt: "Atelier Spoon Set" },
  { slug: "aurea-pasta-server", name: "Aurea Pasta Server", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/aurea-pasta-server.png", imageAlt: "Aurea Pasta Server" },
  { slug: "crest-duo", name: "Crest Duo", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/crest-duo.png", imageAlt: "Crest Duo" },
  { slug: "crest-server", name: "Crest Server", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/crest-server.png", imageAlt: "Crest Server" },
  { slug: "drumstick-cuttingboard", name: "Drumstick Cuttingboard", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/drumstick-cuttingboard.png", imageAlt: "Drumstick Cuttingboard" },
  { slug: "handcrafted-olive-wood-chessboard", name: "Handcrafted Olive Wood Chessboard", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/handcrafted-olive-wood-chessboard.png", imageAlt: "Handcrafted Olive Wood Chessboard" },
  { slug: "linen-sticks", name: "Linen Sticks", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/linen-sticks.png", imageAlt: "Linen Sticks" },
  { slug: "measuring-spoon", name: "Measuring Spoon", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/measuring-spoon.png", imageAlt: "Measuring Spoon" },
  { slug: "olive-oil-spoon", name: "Olive Oil Spoon", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/olive-oil-spoon.png", imageAlt: "Olive Oil Spoon" },
  { slug: "olive-wood-board", name: "Olive Wood Board", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/olive-wood-board.png", imageAlt: "Olive Wood Board" },
  { slug: "olive-wood-citrus-reamer", name: "Olive Wood Citrus Reamer", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/olive-wood-citrus-reamer.png", imageAlt: "Olive Wood Citrus Reamer" },
  { slug: "olive-wood-heart-trivet", name: "Olive Wood Heart Trivet", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/olive-wood-heart-trivet.png", imageAlt: "Olive Wood Heart Trivet" },
  { slug: "olive-wood-lidded-pot", name: "Olive Wood Lidded Pot", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/olive-wood-lidded-pot.png", imageAlt: "Olive Wood Lidded Pot" },
  { slug: "olive-wood-long-spoon", name: "Olive Wood Long Spoon", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/olive-wood-long-spoon.png", imageAlt: "Olive Wood Long Spoon" },
  { slug: "olive-wood-pot", name: "Olive Wood Pot", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/olive-wood-pot.png", imageAlt: "Olive Wood Pot" },
  { slug: "olive-wood-rolling-pin", name: "Olive Wood Rolling Pin", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/olive-wood-rolling-pin.png", imageAlt: "Olive Wood Rolling Pin" },
  { slug: "olive-wood-spatula", name: "Olive Wood Spatula", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/olive-wood-spatula.png", imageAlt: "Olive Wood Spatula" },
  { slug: "olive-wood-spiky-fork", name: "Olive Wood Spiky Fork", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/olive-wood-spiky-fork.png", imageAlt: "Olive Wood Spiky Fork" },
  { slug: "olive-wood-spreader", name: "Olive Wood Spreader", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/olive-wood-spreader.png", imageAlt: "Olive Wood Spreader" },
  { slug: "precise-cup-handmade", name: "Precise Cup Handmade", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/precise-cup-handmade.png", imageAlt: "Precise Cup Handmade" },
  { slug: "solstice-server", name: "Solstice Server", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/solstice-server.png", imageAlt: "Solstice Server" },
  { slug: "solstice-spoon", name: "Solstice Spoon", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/solstice-spoon.png", imageAlt: "Solstice Spoon" },
  { slug: "soup-lid", name: "Soup Lid", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/soup-lid.png", imageAlt: "Soup Lid" },
  { slug: "spice-bowl-with-lid-and-spoon", name: "Spice Bowl With Lid And Spoon", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/spice-bowl-with-lid-and-spoon.png", imageAlt: "Spice Bowl With Lid And Spoon" },
  { slug: "spice-bowl-with-lid-and-spoon-2", name: "Spice Bowl With Lid And Spoon 2", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/spice-bowl-with-lid-and-spoon-2.png", imageAlt: "Spice Bowl With Lid And Spoon 2" },
  { slug: "spice-spoon-5g", name: "Spice Spoon 5G", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/spice-spoon-5g.png", imageAlt: "Spice Spoon 5G" },
  { slug: "spice-spoon-7g", name: "Spice Spoon 7G", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/spice-spoon-7g.png", imageAlt: "Spice Spoon 7G" },
  { slug: "terra-trio", name: "Terra Trio", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/terra-trio.png", imageAlt: "Terra Trio" },
  { slug: "viking-cup", name: "Viking Cup", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/viking-cup.png", imageAlt: "Viking Cup" },
  { slug: "wooden-fish-utensil", name: "Wooden Fish Utensil", description: DESCRIPTION, catalog: "OLIVE_WOOD", priceMinor: 0, currency: "TND", isPublished: true, imageSrc: "/catalog/olive-wood/wooden-fish-utensil.png", imageAlt: "Wooden Fish Utensil" },
];

export function getOliveWoodProduct(slug: string): SeedProduct | undefined {
  return OLIVE_WOOD_PRODUCTS.find((product) => product.slug === slug);
}

export function listOliveWoodProducts(): SeedProduct[] {
  return OLIVE_WOOD_PRODUCTS.filter((product) => product.isPublished);
}
