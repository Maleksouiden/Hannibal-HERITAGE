/**
 * Copy @imgly/background-removal-node dist (resources.json + model chunks)
 * into vendor/imgly-bg-removal so Hostinger runtime can find assets even when
 * process.cwd() / package resolution differs from local npm layout.
 *
 * Run after npm install (hostinger-build does this before next build).
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vendorDir = path.join(root, "vendor", "imgly-bg-removal");
const requireFromRoot = createRequire(path.join(root, "package.json"));

function resolveDist() {
  try {
    const main = requireFromRoot.resolve("@imgly/background-removal-node");
    return path.dirname(main);
  } catch {
    const fallback = path.join(
      root,
      "node_modules",
      "@imgly",
      "background-removal-node",
      "dist",
    );
    return existsSync(path.join(fallback, "resources.json")) ? fallback : null;
  }
}

const dist = resolveDist();
if (!dist || !existsSync(path.join(dist, "resources.json"))) {
  console.warn(
    "[ensure-imgly-resources] @imgly/background-removal-node dist missing; chroma/remove.bg fallbacks will be used",
  );
  process.exit(0);
}

rmSync(vendorDir, { recursive: true, force: true });
mkdirSync(path.dirname(vendorDir), { recursive: true });
cpSync(dist, vendorDir, { recursive: true });
console.log(`[ensure-imgly-resources] Copied ${dist} → ${vendorDir}`);
