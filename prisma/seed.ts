import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { OLIVE_WOOD_PRODUCTS } from "../src/data/olive-wood-products";
import { PRODUCT_GALLERIES } from "../src/data/product-galleries";
import { SAJNEN_PRODUCTS } from "../src/data/sajnen-products";
import { HOME_TEMPLATES } from "../src/lib/home-templates";
import { productPriceMinor } from "../src/lib/product-display";

function createClient() {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.DATABASE_USER ?? "root",
    password: process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME ?? "hannibal_heritage",
    connectionLimit: 5,
  });
  return new PrismaClient({ adapter });
}

async function seedCatalog(
  prisma: PrismaClient,
  catalog: "SAJNEN" | "OLIVE_WOOD",
  categorySlug: string,
  categoryName: string,
  description: string,
  products: typeof SAJNEN_PRODUCTS,
) {
  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: { name: categoryName, description, catalog },
    create: {
      slug: categorySlug,
      name: categoryName,
      description,
      catalog,
    },
  });

  for (const seed of products) {
    const priceMinor = productPriceMinor(seed);
    const gallery = PRODUCT_GALLERIES[seed.slug] ?? [seed.imageSrc];
    const product = await prisma.product.upsert({
      where: { slug: seed.slug },
      update: {
        name: seed.name,
        description: seed.description,
        catalog,
        categoryId: category.id,
        priceMinor,
        currency: "TND",
        stock: 10,
        isPublished: true,
      },
      create: {
        slug: seed.slug,
        name: seed.name,
        description: seed.description,
        catalog,
        categoryId: category.id,
        priceMinor,
        currency: "TND",
        stock: 10,
        isPublished: true,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: gallery.map((url, sortOrder) => ({
        productId: product.id,
        url,
        alt: seed.imageAlt,
        sortOrder,
      })),
    });
  }
}

async function main() {
  const prisma = createClient();
  try {
    await seedCatalog(
      prisma,
      "SAJNEN",
      "sajnen",
      "Sejnane",
      "Handcrafted Sejnane pottery — UNESCO Intangible Cultural Heritage.",
      SAJNEN_PRODUCTS,
    );
    await seedCatalog(
      prisma,
      "OLIVE_WOOD",
      "olive-wood",
      "Olive wood",
      "Handcrafted Tunisian olive wood for the table and home.",
      OLIVE_WOOD_PRODUCTS,
    );

    const adminEmail = (
      process.env.ADMIN_EMAIL ?? "admin@hannibal.local"
    ).trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD ?? "admin1234";
    const adminName = process.env.ADMIN_NAME ?? "Hannibal Admin";
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        fullName: adminName,
        passwordHash,
        role: "ADMIN",
      },
      create: {
        email: adminEmail,
        fullName: adminName,
        passwordHash,
        role: "ADMIN",
      },
    });

    /** Durable storefront admins — survive reseed; existing passwords kept. */
    const EXTRA_ADMIN_EMAILS = [
      "maleksouiden689@gmail.com",
      ...(process.env.EXTRA_ADMIN_EMAILS ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
    ];

    for (const email of [...new Set(EXTRA_ADMIN_EMAILS)]) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        await prisma.user.update({
          where: { email },
          data: { role: "ADMIN" },
        });
        console.log(`Promoted existing user to ADMIN: ${email}`);
      } else {
        await prisma.user.create({
          data: {
            email,
            fullName: email.split("@")[0] ?? "Admin",
            passwordHash,
            role: "ADMIN",
          },
        });
        console.log(`Created ADMIN user: ${email}`);
      }
    }

    await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default" },
    });

    for (const [index, template] of HOME_TEMPLATES.entries()) {
      await prisma.homeFeaturedTemplate.upsert({
        where: { id: template.id },
        update: {
          title: template.title,
          body: template.body,
          ctaLabel: template.ctaLabel,
          href: template.href,
          imageSrc: template.imageSrc,
          imageAlt: template.imageAlt,
          catalog: template.catalog === "sajnen" ? "SAJNEN" : "OLIVE_WOOD",
          sortOrder: index,
        },
        create: {
          id: template.id,
          catalog: template.catalog === "sajnen" ? "SAJNEN" : "OLIVE_WOOD",
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

    const count = await prisma.product.count();
    console.log(`Seed complete. Products in DB: ${count}`);
    console.log(`Admin user ready: ${adminEmail}`);
    console.log("Site content templates seeded");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
