import { AdminProductForm } from "@/components/admin-product-form";

export default function NewProductPage() {
  return (
    <main className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          New product
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c564e]">
          Add a Sejnane or olive wood product with images and publish state.
        </p>
      </header>
      <AdminProductForm
        mode="create"
        initial={{
          name: "",
          slug: "",
          description: "",
          catalog: "SAJNEN",
          priceTnd: 0,
          sku: "",
          stock: 10,
          isPublished: false,
          imageUrls: [],
        }}
      />
    </main>
  );
}
