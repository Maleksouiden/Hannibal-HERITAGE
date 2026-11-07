"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type InventoryRow = {
  id: string;
  slug: string;
  name: string;
  catalog: "SAJNEN" | "OLIVE_WOOD";
  stock: number;
  vendingEnabled: boolean;
  lowStockThreshold: number;
  isPublished: boolean;
  imageUrl: string | null;
  lowStock: boolean;
  outOfStock: boolean;
  statusLabel: string;
};

type AdminInventoryTableProps = {
  initialProducts: InventoryRow[];
};

function catalogLabel(catalog: InventoryRow["catalog"]) {
  return catalog === "SAJNEN" ? "Sejnane" : "Olive wood";
}

export function AdminInventoryTable({
  initialProducts,
}: AdminInventoryTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "low" | "out" | "disabled">(
    "all",
  );

  const visible = useMemo(() => {
    return products.filter((product) => {
      if (filter === "low") return product.lowStock;
      if (filter === "out") return product.outOfStock;
      if (filter === "disabled") return !product.vendingEnabled;
      return true;
    });
  }, [products, filter]);

  async function patch(
    id: string,
    body: Partial<{
      stock: number;
      vendingEnabled: boolean;
      lowStockThreshold: number;
    }>,
  ) {
    setPendingId(id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as {
        product?: InventoryRow;
        error?: string;
      };
      if (!response.ok || !data.product) {
        throw new Error(data.error ?? "Update failed");
      }
      setProducts((prev) =>
        prev.map((row) =>
          row.id === id
            ? {
                ...row,
                ...data.product!,
                imageUrl: row.imageUrl,
              }
            : row,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["low", "Low stock"],
            ["out", "Out of stock"],
            ["disabled", "Vending off"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`inline-flex min-h-11 items-center px-3 text-xs tracking-[0.14em] uppercase ${
              filter === value
                ? "bg-[#1c1917] text-[#f7f3ec]"
                : "border border-[#ddd4c5] text-[#5c564e]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      {visible.length === 0 ? (
        <p className="text-sm text-[#5c564e]">No products in this filter.</p>
      ) : (
        <ul className="divide-y divide-[#ddd4c5]/70 border-t border-[#ddd4c5]/70">
          {visible.map((product) => {
            const busy = pendingId === product.id;
            return (
              <li
                key={product.id}
                className="grid gap-4 py-5 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-start"
              >
                <div className="relative hidden aspect-square bg-[#ebe4d8] sm:block">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex flex-col gap-3">
                  <div>
                    <p className="truncate text-sm text-[#1c1917]">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs tracking-[0.08em] text-[#8a8278] uppercase">
                      {catalogLabel(product.catalog)} ·{" "}
                      {product.isPublished ? "Published" : "Draft"} ·{" "}
                      {product.statusLabel}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-end gap-3">
                    <label className="flex flex-col gap-1 text-xs tracking-[0.12em] text-[#5c564e] uppercase">
                      Stock
                      <input
                        type="number"
                        min={0}
                        step={1}
                        disabled={busy}
                        defaultValue={product.stock}
                        key={`stock-${product.id}-${product.stock}`}
                        onBlur={(event) => {
                          const next = Math.max(
                            0,
                            Math.floor(Number(event.target.value) || 0),
                          );
                          if (next !== product.stock) {
                            void patch(product.id, { stock: next });
                          }
                        }}
                        className="min-h-11 w-24 border border-[#ddd4c5] bg-transparent px-2 text-sm tabular-nums text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs tracking-[0.12em] text-[#5c564e] uppercase">
                      Low at ≤
                      <input
                        type="number"
                        min={0}
                        step={1}
                        disabled={busy}
                        defaultValue={product.lowStockThreshold}
                        key={`thr-${product.id}-${product.lowStockThreshold}`}
                        onBlur={(event) => {
                          const next = Math.max(
                            0,
                            Math.floor(Number(event.target.value) || 0),
                          );
                          if (next !== product.lowStockThreshold) {
                            void patch(product.id, {
                              lowStockThreshold: next,
                            });
                          }
                        }}
                        className="min-h-11 w-24 border border-[#ddd4c5] bg-transparent px-2 text-sm tabular-nums text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5]"
                      />
                    </label>
                    <label className="flex min-h-11 items-center gap-2 text-xs tracking-[0.12em] text-[#5c564e] uppercase">
                      <input
                        type="checkbox"
                        checked={product.vendingEnabled}
                        disabled={busy}
                        onChange={(event) =>
                          void patch(product.id, {
                            vendingEnabled: event.target.checked,
                          })
                        }
                        className="size-4"
                      />
                      Vending on
                    </label>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
