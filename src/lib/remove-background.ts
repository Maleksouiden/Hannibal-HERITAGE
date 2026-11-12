import { pathToFileURL } from "node:url";
import path from "node:path";
import { removeBackground } from "@imgly/background-removal-node";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const BG_REMOVE_MAX_BYTES = 8 * 1024 * 1024;

/**
 * Local ONNX matting via @imgly/background-removal-node (no API key).
 * Optional upgrade: set REMOVE_BG_API_KEY to use remove.bg for higher quality.
 */
export async function removeImageBackground(
  bytes: Buffer,
  mimeType: string,
): Promise<Buffer> {
  const type = ALLOWED_TYPES.has(mimeType) ? mimeType : "image/png";
  const apiKey = process.env.REMOVE_BG_API_KEY?.trim();
  if (apiKey) {
    return removeViaRemoveBg(bytes, apiKey);
  }
  return removeViaImgly(bytes, type);
}

async function removeViaImgly(bytes: Buffer, mimeType: string): Promise<Buffer> {
  const distDir = path.join(
    process.cwd(),
    "node_modules",
    "@imgly",
    "background-removal-node",
    "dist",
  );
  const publicPath = `${pathToFileURL(distDir).href}/`;
  const input = new Blob([new Uint8Array(bytes)], { type: mimeType });
  const result = await removeBackground(input, {
    publicPath,
    model: "medium",
    output: { format: "image/png", quality: 1 },
  });
  return Buffer.from(await result.arrayBuffer());
}

async function removeViaRemoveBg(
  bytes: Buffer,
  apiKey: string,
): Promise<Buffer> {
  const form = new FormData();
  form.append(
    "image_file",
    new Blob([new Uint8Array(bytes)], { type: "application/octet-stream" }),
    "upload.png",
  );
  form.append("size", "auto");
  form.append("format", "png");

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: form,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `remove.bg failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    );
  }

  return Buffer.from(await response.arrayBuffer());
}

export function isAllowedBgRemoveType(mimeType: string): boolean {
  return ALLOWED_TYPES.has(mimeType);
}
