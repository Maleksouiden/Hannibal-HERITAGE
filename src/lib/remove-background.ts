import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import sharp from "sharp";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const BG_REMOVE_MAX_BYTES = 8 * 1024 * 1024;

const DEFAULT_REMBG_MODEL = "isnet-general-use";
const REMBG_TIMEOUT_MS = 180_000;

/**
 * Primary: Python rembg (isnet/u2net) via scripts/rembg_cli.py.
 * Fallback: remove.bg when REMOVE_BG_API_KEY is set, then sharp chroma.
 */
export async function removeImageBackground(
  bytes: Buffer,
  mimeType: string,
): Promise<Buffer> {
  void mimeType;

  try {
    return await removeViaRembg(bytes);
  } catch (err) {
    console.error("[remove-background] rembg failed, trying fallbacks", err);
  }

  const apiKey = process.env.REMOVE_BG_API_KEY?.trim();
  if (apiKey) {
    try {
      return await removeViaRemoveBg(bytes, apiKey);
    } catch (err) {
      console.error("[remove-background] remove.bg failed, trying chroma", err);
    }
  }

  return removeViaChroma(bytes);
}

function resolvePythonBin(): string {
  const fromEnv = process.env.BG_REMOVE_PYTHON?.trim();
  if (fromEnv) return fromEnv;
  return process.platform === "win32" ? "python" : "python3";
}

function resolveRembgScript(): string {
  const fromEnv = process.env.BG_REMOVE_REMBG_SCRIPT?.trim();
  if (fromEnv) return path.resolve(fromEnv);
  return path.join(process.cwd(), "scripts", "rembg_cli.py");
}

function resolveRembgModel(): string {
  return process.env.BG_REMOVE_MODEL?.trim() || DEFAULT_REMBG_MODEL;
}

async function removeViaRembg(bytes: Buffer): Promise<Buffer> {
  const script = resolveRembgScript();
  if (!existsSync(script)) {
    throw new Error(`rembg CLI missing at ${script}`);
  }

  const python = resolvePythonBin();
  const model = resolveRembgModel();
  const tmpRoot = await mkdtemp(path.join(os.tmpdir(), "hh-rembg-"));
  const inputPath = path.join(tmpRoot, "input.bin");
  const outputPath = path.join(tmpRoot, "output.png");

  try {
    await writeFile(inputPath, bytes);

    await new Promise<void>((resolve, reject) => {
      const refineOff =
        process.env.BG_REMOVE_REFINE?.trim().toLowerCase() === "0" ||
        process.env.BG_REMOVE_REFINE?.trim().toLowerCase() === "false";
      const args = [
        script,
        "--input",
        inputPath,
        "--output",
        outputPath,
        "--model",
        model,
        refineOff ? "--no-refine-fabric" : "--refine-fabric",
      ];
      const child = spawn(python, args, {
        stdio: ["ignore", "pipe", "pipe"],
        env: process.env,
        windowsHide: true,
      });

      let stderr = "";
      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        reject(new Error(`rembg timed out after ${REMBG_TIMEOUT_MS}ms`));
      }, REMBG_TIMEOUT_MS);

      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString("utf8");
        if (stderr.length > 4000) stderr = stderr.slice(-4000);
      });

      child.on("error", (err) => {
        clearTimeout(timer);
        reject(
          new Error(
            `Failed to start Python (${python}): ${err.message}. Install rembg: python -m pip install -r requirements-rembg.txt`,
          ),
        );
      });

      child.on("close", (code) => {
        clearTimeout(timer);
        if (code === 0) {
          resolve();
          return;
        }
        const detail = stderr.trim().slice(0, 500);
        reject(
          new Error(
            `rembg exited ${code}${detail ? `: ${detail}` : ""}. Ensure Python rembg is installed.`,
          ),
        );
      });
    });

    const png = await readFile(outputPath);
    if (png.length < 32) {
      throw new Error("rembg returned an empty PNG");
    }
    return png;
  } finally {
    await rm(tmpRoot, { recursive: true, force: true }).catch(() => undefined);
  }
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
 * Only useful for near-solid studio backdrops.
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
