/**
 * Hostinger-safe build: generate Prisma client, force SWC WASM
 * (Hostinger glibc may be too old for @next/swc-linux-x64-gnu).
 * Panel build command stays: npm run build
 */
import { spawnSync } from "node:child_process";

process.env.NEXT_SWC_WASM = "1";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "generate"]);
run("npx", ["next", "build"]);
