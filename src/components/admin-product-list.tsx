"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export type AdminProductListItem = {
  id: string;
  slug: string;
  name: string;
  catalog: "SAJNEN" | "OLIVE_WOOD";
  priceTnd: number;
  isPublished: boolean;
  isArchived: boolean;
  images: Array<{ url: string }>;
};

type AdminProductListProps = {
  products: AdminProductListItem[];
};

function catalogLabel(catalog: AdminProductListItem["catalog"]) {
  return catalog === "SAJNEN" ? "Sejnane" : "Olive wood";
}

export function AdminProductList({ products }: AdminProductListProps) {
  const router = useRouter();
  const [showArchived, setShowArchived] = useState(false);
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      if (!showArchived && product.isArchived) return false;
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        catalogLabel(product.catalog).toLowerCase().includes(q)
      );
    });
  }, [products, showArchived, query]);

  async function archive(id: string) {
    if (!window.confirm("Archive this product?")) return;
    setPendingId(id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${id}/archive`, {
        method: "POST",
        credentials: "same-origin",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Archive failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Archive failed");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <label className="flex min-w-[min(100%,18rem)] flex-1 flex-col gap-2 text-[11px] tracking-[0.14em] text-[#6f675c] uppercase">
          Search articles
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, slug, or catalog…"
            className="min-h-11 border border-[#ddd4c5] bg-transparent px-3 text-sm tracking-normal text-[#1c1917] normal-case outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-h-11 items-center gap-2 text-sm text-[#5c564e]">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(event) => setShowArchived(event.target.checked)}
              className="size-4"
            />
            Show archived
          </label>
          <Link
            href="/dashboard/products/new"
            className="inline-flex min-h-11 items-center border border-[#1c1917] bg-[#1c1917] px-4 text-xs tracking-[0.16em] text-[#f7f3ec] uppercase"
          >
            New product
          </Link>
        </div>
      </div>

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      <p className="text-xs text-[#8a8278]">
        {visible.length} article{visible.length === 1 ? "" : "s"}
      </p>

      {visible.length === 0 ? (
        <p className="text-sm text-[#5c564e]">No products in this view.</p>
      ) : (
        <ul className="divide-y divide-[#ddd4c5]/70 border-t border-[#ddd4c5]/70">
          {visible.map((product) => {
            const thumb = product.images[0]?.url;
            return (
              <li
                key={product.id}
                className="grid grid-cols-[56px_minmax(0,1fr)] gap-3 py-4 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="relative aspect-square bg-[#ebe4d8]">
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="72px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-[#1c1917]">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs tracking-[0.08em] text-[#8a8278] uppercase">
                    {catalogLabel(product.catalog)} ·{" "}
                    {product.isArchived
                      ? "Archived"
                      : product.isPublished
                        ? "Published"
                        : "Draft"}{" "}
                    · {product.priceTnd.toFixed(3)} TND
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 sm:hidden">
                    {!product.isArchived ? (
                      <>
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="text-xs tracking-[0.12em] text-[#5c564e] uppercase"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          disabled={pendingId === product.id}
                          onClick={() => void archive(product.id)}
                          className="text-xs tracking-[0.12em] text-red-900 uppercase disabled:opacity-50"
                        >
                          Archive
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="hidden gap-4 sm:flex">
                  {!product.isArchived ? (
                    <>
                      <Link
                        href={`/dashboard/products/${product.id}/edit`}
                        className="inline-flex min-h-11 items-center text-xs tracking-[0.12em] text-[#5c564e] uppercase"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={pendingId === product.id}
                        onClick={() => void archive(product.id)}
                        className="inline-flex min-h-11 items-center text-xs tracking-[0.12em] text-red-900 uppercase disabled:opacity-50"
                      >
                        Archive
                      </button>
                    </>
                  ) : (
                    <span className="inline-flex min-h-11 items-center text-xs tracking-[0.12em] text-[#8a8278] uppercase">
                      Archived
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
