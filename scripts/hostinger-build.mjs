/**
 * Hostinger-safe build:
 * - clear stale Prisma client
 * - force SWC WASM (Hostinger glibc may be too old for native @next/swc-*)
 * - build with webpack (Turbopack requires native SWC and fails on old glibc)
 *
 * Panel: Node 22, npm, build command `npm run build`, output `.next`
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
// Copy imgly ONNX resources to vendor/ so production publicPath resolves
run("node", ["scripts/ensure-imgly-resources.mjs"]);
// --webpack: avoid Turbopack's native-SWC requirement on Hostinger
run("npx", ["next", "build", "--webpack"]);
