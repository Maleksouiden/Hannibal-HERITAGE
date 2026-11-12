/**
 * Hostinger-safe build: clear stale Prisma client, generate, force SWC WASM
 * (Hostinger glibc may be too old for @next/swc-linux-x64-gnu).
 * Panel build command stays: npm run build
 *
 * Removes src/generated before prisma generate so a ZIP/upload cannot leave
 * root-owned or read-only files that cause EACCES on Hostinger.
 */
import { rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

process.env.NEXT_SWC_WASM = "1";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generatedDir = path.join(root, "src", "generated");

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: true,
    env: process.env,
    cwd: root,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

try {
  rmSync(generatedDir, { recursive: true, force: true });
  console.log(`Cleared ${generatedDir}`);
} catch (err) {
  console.warn(`Could not clear ${generatedDir}:`, err?.message ?? err);
}

// Repair bad modes from older Windows ZIPs (mode 000 → EACCES scandir).
if (process.platform !== "win32") {
  run("chmod", ["-R", "u+rwX,go+rX", "src", "public", "prisma", "scripts"]);
}

run("npx", ["prisma", "generate"]);
run("npx", ["next", "build"]);
