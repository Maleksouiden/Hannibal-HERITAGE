/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  serverExternalPackages: ["sharp"],
  // rembg CLI + requirements ship with the app; Node spawns Python at runtime.
  outputFileTracingIncludes: {
    "/api/admin/tools/background-remove": [
      "./scripts/rembg_cli.py",
      "./requirements-rembg.txt",
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
