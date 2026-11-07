import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/admin-product-form";
import {
  adminProductInclude,
  serializeAdminProduct,
} from "@/lib/admin-products";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const row = await prisma.product.findUnique({
    where: { id },
    include: adminProductInclude,
  });
  if (!row || row.isArchived) notFound();

  const product = serializeAdminProduct(row);

  return (
    <main className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit product
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e]">
          Update details, images, category, and publish flag for{" "}
          <span className="text-[#1c1917]">{product.name}</span>.
        </p>
      </header>
      <AdminProductForm
        mode="edit"
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          catalog: product.catalog,
          priceTnd: product.priceTnd,
          sku: product.sku ?? "",
          stock: product.stock,
          isPublished: product.isPublished,
          imageUrls: product.images.map((image) => image.url),
        }}
      />
    </main>
  );
}
