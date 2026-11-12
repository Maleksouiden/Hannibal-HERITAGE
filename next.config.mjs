/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  serverExternalPackages: [
    "@imgly/background-removal-node",
    "onnxruntime-node",
    "sharp",
  ],
  // Keep imgly model chunks + resources.json in the server trace for Hostinger.
  outputFileTracingIncludes: {
    "/api/admin/tools/background-remove": [
      "./node_modules/@imgly/background-removal-node/dist/**/*",
      "./vendor/imgly-bg-removal/**/*",
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
