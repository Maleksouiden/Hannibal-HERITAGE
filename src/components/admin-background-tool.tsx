"use client";

import { useEffect, useState, type ChangeEvent } from "react";

type ResultItem = {
  id: string;
  name: string;
  previewUrl: string;
  blob: Blob;
};

const checkerStyle = {
  backgroundColor: "#1a1a1a",
  backgroundImage:
    "linear-gradient(45deg, #2e2e2e 25%, transparent 25%), linear-gradient(-45deg, #2e2e2e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2e2e2e 75%), linear-gradient(-45deg, transparent 75%, #2e2e2e 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
} as const;

export function AdminBackgroundTool() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ResultItem[]>([]);

  useEffect(() => {
    return () => {
      for (const item of results) URL.revokeObjectURL(item.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revoke only on unmount
  }, []);

  async function processFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;

    setPending(true);
    setError(null);

    const next: ResultItem[] = [];
    try {
      for (const file of list) {
        const form = new FormData();
        form.append("file", file);
        const response = await fetch("/api/admin/tools/background-remove", {
          method: "POST",
          credentials: "same-origin",
          body: form,
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(data?.error ?? `Failed on ${file.name}`);
        }

        const blob = await response.blob();
        next.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: `${file.name.replace(/\.[^.]+$/, "")}-nobg.png`,
          previewUrl: URL.createObjectURL(blob),
          blob,
        });
      }

      setResults((prev) => {
        for (const item of prev) URL.revokeObjectURL(item.previewUrl);
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Background removal failed");
    } finally {
      setPending(false);
    }
  }

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    event.currentTarget.value = "";
    if (!files?.length) return;
    void processFiles(files);
  }

  function download(item: ResultItem) {
    const link = document.createElement("a");
    link.href = item.previewUrl;
    link.download = item.name;
    link.click();
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-2 text-sm text-[#5c564e]">
          Upload image(s)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            disabled={pending}
            onChange={onPick}
            className="text-sm text-[#5c564e]"
          />
        </label>
        <p className="text-sm leading-6 text-[#5c564e]">
          Runs on the server with a local ONNX model (no paid key). First run
          may take longer while the model loads. Optional: set{" "}
          <code className="text-[#1c1917]">REMOVE_BG_API_KEY</code> for
          remove.bg quality.
        </p>
        {pending ? (
          <p className="text-sm text-[#1c1917]">Removing background…</p>
        ) : null}
        {error ? <p className="text-sm text-red-800">{error}</p> : null}
      </div>

      {results.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2">
          {results.map((item) => (
            <li key={item.id} className="flex flex-col gap-3">
              <div
                className="relative aspect-square overflow-hidden border border-[#ddd4c5]"
                style={checkerStyle}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm text-[#5c564e]">{item.name}</p>
                <button
                  type="button"
                  onClick={() => download(item)}
                  className="inline-flex min-h-11 shrink-0 items-center border border-[#1c1917] bg-[#1c1917] px-4 text-xs tracking-[0.14em] text-[#f7f3ec] uppercase"
                >
                  Download PNG
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
