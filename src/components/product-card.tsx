import Image from "next/image";
import Link from "next/link";
import type { SeedProduct } from "@/data/sajnen-products";

type ProductCardProps = {
  product: SeedProduct;
  href: string;
};

export function ProductCard({ product, href }: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b8a5]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#ebe4d8]">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <h2 className="text-sm tracking-[0.04em] text-[#3f3a34] transition group-hover:text-[#1c1917]">
        {product.name}
      </h2>
    </Link>
  );
}
