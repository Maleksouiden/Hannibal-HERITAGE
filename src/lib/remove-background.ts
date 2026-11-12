import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const BG_REMOVE_MAX_BYTES = 8 * 1024 * 1024;

const requireFromCwd = createRequire(path.join(process.cwd(), "package.json"));

/**
 * Local ONNX matting via @imgly/background-removal-node when assets exist.
 * Fallback order: remove.bg (if key) → imgly → sharp chroma (never throws past chroma).
 */
export async function removeImageBackground(
  bytes: Buffer,
  mimeType: string,
): Promise<Buffer> {
  const type = ALLOWED_TYPES.has(mimeType) ? mimeType : "image/png";
  const apiKey = process.env.REMOVE_BG_API_KEY?.trim();

  if (apiKey) {
    try {
      return await removeViaRemoveBg(bytes, apiKey);
    } catch (err) {
      console.error("[remove-background] remove.bg failed, trying local", err);
    }
  }

  const publicPath = resolveImglyPublicPath();
  if (publicPath) {
    try {
      return await removeViaImgly(bytes, type, publicPath);
    } catch (err) {
      console.error(
        "[remove-background] imgly failed, falling back to chroma",
        err,
      );
    }
  } else {
    console.warn(
      "[remove-background] imgly resources.json missing; using chroma fallback",
    );
  }

  return removeViaChroma(bytes);
}

/** Candidate dirs that may hold resources.json + model chunks. */
export function resolveImglyDistDirs(): string[] {
  const dirs: string[] = [];
  const seen = new Set<string>();

  function add(dir: string) {
    const resolved = path.resolve(dir);
    if (seen.has(resolved)) return;
    seen.add(resolved);
    dirs.push(resolved);
  }

  try {
    const main = requireFromCwd.resolve("@imgly/background-removal-node");
    add(path.dirname(main));
  } catch {
    // package may be unresolved during trace; other candidates still apply
  }

  add(
    path.join(
      process.cwd(),
      "vendor",
      "imgly-bg-removal",
    ),
  );
  add(
    path.join(
      process.cwd(),
      "node_modules",
      "@imgly",
      "background-removal-node",
      "dist",
    ),
  );

  return dirs;
}

function resolveImglyPublicPath(): string | null {
  for (const distDir of resolveImglyDistDirs()) {
    if (existsSync(path.join(distDir, "resources.json"))) {
      return `${pathToFileURL(distDir).href}/`;
    }
  }
  return null;
}

async function removeViaImgly(
  bytes: Buffer,
  mimeType: string,
  publicPath: string,
): Promise<Buffer> {
  const { removeBackground } = await import("@imgly/background-removal-node");
  const input = new Blob([new Uint8Array(bytes)], { type: mimeType });
  const result = await removeBackground(input, {
    publicPath,
    model: "medium",
    output: { format: "image/png", quality: 1 },
    // Avoid worker quirks on some shared hosts
    proxyToWorker: false,
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

/**
 * Last-resort: sample corner colors and punch near-matching pixels to alpha 0.
 * Good enough for studio / solid backdrops when ONNX assets are unavailable.
 */
async function removeViaChroma(bytes: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(bytes)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (channels < 4 || width < 2 || height < 2) {
    return sharp(bytes).png().toBuffer();
  }

  const pixels = new Uint8Array(data);
  const samples = [
    pixelAt(pixels, width, channels, 0, 0),
    pixelAt(pixels, width, channels, width - 1, 0),
    pixelAt(pixels, width, channels, 0, height - 1),
    pixelAt(pixels, width, channels, width - 1, height - 1),
    pixelAt(pixels, width, channels, Math.floor(width / 2), 0),
    pixelAt(pixels, width, channels, 0, Math.floor(height / 2)),
  ];
  const bg = averageRgb(samples);
  const threshold = 42;

  for (let i = 0; i < pixels.length; i += channels) {
    const dr = pixels[i]! - bg.r;
    const dg = pixels[i + 1]! - bg.g;
    const db = pixels[i + 2]! - bg.b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist <= threshold) {
      pixels[i + 3] = 0;
    } else if (dist < threshold * 1.6) {
      const t = (dist - threshold) / (threshold * 0.6);
      pixels[i + 3] = Math.round(255 * Math.min(1, Math.max(0, t)));
    }
  }

  return sharp(pixels, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer();
}

function pixelAt(
  data: Uint8Array,
  width: number,
  channels: number,
  x: number,
  y: number,
): { r: number; g: number; b: number } {
  const i = (y * width + x) * channels;
  return { r: data[i]!, g: data[i + 1]!, b: data[i + 2]! };
}

function averageRgb(
  samples: { r: number; g: number; b: number }[],
): { r: number; g: number; b: number } {
  let r = 0;
  let g = 0;
  let b = 0;
  for (const s of samples) {
    r += s.r;
    g += s.g;
    b += s.b;
  }
  const n = samples.length || 1;
  return {
    r: Math.round(r / n),
    g: Math.round(g / n),
    b: Math.round(b / n),
  };
}

export function isAllowedBgRemoveType(mimeType: string): boolean {
  return ALLOWED_TYPES.has(mimeType);
}

export function imglyResourcesAvailable(): boolean {
  return resolveImglyPublicPath() !== null;
}
