"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ThemedFilePicker } from "@/components/themed-file-picker";

export type AdminProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  catalog: "SAJNEN" | "OLIVE_WOOD";
  priceTnd: number;
  sku: string;
  stock: number;
  isPublished: boolean;
  imageUrls: string[];
};

type AdminProductFormProps = {
  mode: "create" | "edit";
  initial: AdminProductFormValues;
};

const fieldClass =
  "min-h-11 w-full border border-[#ddd4c5] bg-transparent px-3 py-2 text-base text-[#1c1917] outline-none focus-visible:ring-1 focus-visible:ring-[#c4b8a5] sm:text-sm";

export function AdminProductForm({ mode, initial }: AdminProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [urlDraft, setUrlDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof AdminProductFormValues>(
    key: K,
    value: AdminProductFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function addUrl(url: string) {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (values.imageUrls.includes(trimmed)) return;
    update("imageUrls", [...values.imageUrls, trimmed].slice(0, 12));
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      let uploadFile: File = file;
      if (removeBackground) {
        try {
          const cutForm = new FormData();
          cutForm.append("file", file);
          const cutResponse = await fetch(
            "/api/admin/tools/background-remove",
            {
              method: "POST",
              credentials: "same-origin",
              body: cutForm,
            },
          );
          if (!cutResponse.ok) {
            const cutData = (await cutResponse.json().catch(() => null)) as {
              error?: string;
            } | null;
            throw new Error(cutData?.error ?? "Background removal failed");
          }
          const png = await cutResponse.blob();
          uploadFile = new File(
            [png],
            `${file.name.replace(/\.[^.]+$/, "")}-nobg.png`,
            { type: "image/png" },
          );
        } catch (bgErr) {
          // Never block product image save if BG remove fails — keep original.
          console.error("[admin-product-form] BG remove failed", bgErr);
          setError(
            bgErr instanceof Error
              ? `Background removal failed (${bgErr.message}); uploaded original image.`
              : "Background removal failed; uploaded original image.",
          );
          uploadFile = file;
        }
      }

      const form = new FormData();
      form.append("file", uploadFile);
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        credentials: "same-origin",
        body: form,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Upload failed");
      }
      addUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const payload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      catalog: values.catalog,
      priceTnd: values.priceTnd,
      sku: values.sku || null,
      stock: values.stock,
      isPublished: values.isPublished,
      imageUrls: values.imageUrls,
    };

    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${values.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as {
        product?: { id: string };
        error?: string;
      };
      if (!response.ok || !data.product) {
        throw new Error(data.error ?? "Save failed");
      }
      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setPending(false);
    }
  }

  async function onArchive() {
    if (!values.id) return;
    if (!window.confirm("Archive this product? It will leave the storefront.")) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${values.id}/archive`, {
        method: "POST",
        credentials: "same-origin",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Archive failed");
      }
      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Archive failed");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-5">
      <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
        Name
        <input
          required
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
        Slug
        <input
          value={values.slug}
          onChange={(event) => update("slug", event.target.value)}
          placeholder="auto from name if empty on create"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
        Catalog / category
        <select
          value={values.catalog}
          onChange={(event) =>
            update("catalog", event.target.value as "SAJNEN" | "OLIVE_WOOD")
          }
          className={fieldClass}
        >
          <option value="SAJNEN">Sejnane (Sajnen)</option>
          <option value="OLIVE_WOOD">Olive wood</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
        Description
        <textarea
          rows={4}
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          className={`${fieldClass} min-h-28`}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
          Price (TND)
          <input
            type="number"
            min={0}
            step="0.001"
            required
            value={values.priceTnd}
            onChange={(event) =>
              update("priceTnd", Number(event.target.value))
            }
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
          SKU
          <input
            value={values.sku}
            onChange={(event) => update("sku", event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[#5c564e]">
          Stock
          <input
            type="number"
            min={0}
            step={1}
            value={values.stock}
            onChange={(event) =>
              update("stock", Math.max(0, Math.floor(Number(event.target.value) || 0)))
            }
            className={fieldClass}
          />
        </label>
      </div>

      <label className="flex min-h-11 items-center gap-3 text-sm text-[#5c564e]">
        <input
          type="checkbox"
          checked={values.isPublished}
          onChange={(event) => update("isPublished", event.target.checked)}
          className="size-4"
        />
        Published on storefront
      </label>

      <section className="flex flex-col gap-3 border-t border-[#ddd4c5]/70 pt-5">
        <h3 className="text-sm tracking-[0.16em] text-[#8a8278] uppercase">
          Images
        </h3>
        <p className="text-sm text-[#5c564e]">
          Upload a file or paste an image URL (local path or absolute URL).
        </p>

        <label className="flex min-h-11 items-center gap-3 text-sm text-[#5c564e]">
          <input
            type="checkbox"
            checked={removeBackground}
            onChange={(event) => setRemoveBackground(event.target.checked)}
            disabled={uploading || pending}
            className="size-4"
          />
          Remove background before save (transparent PNG)
        </label>

        <ThemedFilePicker
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading || pending}
          buttonLabel={uploading ? "Uploading…" : "Choose image"}
          onFiles={(files) => {
            void onUpload(files?.[0] ?? null);
          }}
        />

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
          <input
            value={urlDraft}
            onChange={(event) => setUrlDraft(event.target.value)}
            placeholder="/catalog/... or https://..."
            className={fieldClass}
          />
          <button
            type="button"
            onClick={() => {
              addUrl(urlDraft);
              setUrlDraft("");
            }}
            className="inline-flex min-h-11 shrink-0 items-center border border-[#1c1917] px-3 text-xs tracking-[0.14em] uppercase"
          >
            Add URL
          </button>
        </div>

        {values.imageUrls.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {values.imageUrls.map((url) => (
              <li key={url} className="relative aspect-square bg-[#ebe4d8]">
                <Image
                  src={url}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="160px"
                />
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "imageUrls",
                      values.imageUrls.filter((item) => item !== url),
                    )
                  }
                  className="absolute top-1 right-1 bg-[#1c1917]/80 px-2 py-1 text-[10px] tracking-[0.12em] text-[#f7f3ec] uppercase"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending || uploading}
          className="inline-flex min-h-11 items-center justify-center border border-[#1c1917] bg-[#1c1917] px-5 py-3 text-xs tracking-[0.16em] text-[#f7f3ec] uppercase disabled:opacity-50"
        >
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Create product"
              : "Save changes"}
        </button>
        <Link
          href="/dashboard/products"
          className="inline-flex min-h-11 items-center text-xs tracking-[0.14em] text-[#5c564e] uppercase"
        >
          Cancel
        </Link>
        {mode === "edit" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => void onArchive()}
            className="inline-flex min-h-11 items-center text-xs tracking-[0.14em] text-red-900 uppercase disabled:opacity-50"
          >
            Archive
          </button>
        ) : null}
      </div>
    </form>
  );
}
