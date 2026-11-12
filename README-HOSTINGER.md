# Hannibal HERITAGE — Hostinger deploy

Upload this ZIP in Hostinger **Website → Advanced → Node.js** (or the Node.js app panel).

## Panel settings (confirmed)

| Setting | Value |
|---|---|
| Application type | Next.js |
| Node.js version | **22** |
| Package manager | **npm** |
| Build command | **`npm run build`** |
| Output directory | **`.next`** |
| Start command | **`npm run start`** (if the panel asks for one) |

## Environment variables

Set these in the Hostinger panel (do **not** upload a real `.env` with secrets).

Copy names from `.env.example`. Important for Hostinger:

- **MySQL must be the Hostinger remote database**, not `localhost:3307` (that port is only for local Docker).
- Set `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, and matching `DATABASE_URL` to the Hostinger MySQL credentials from hPanel.
- Set a strong `AUTH_SECRET` (long random string).
- Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` for the first seed if you run seeding on the server.
- Optional: `REMOVE_BG_API_KEY` for higher-quality admin background removal.

### SWC / older glibc

Hostinger Linux images may lack `GLIBC_2.29`, so the native `@next/swc-linux-x64-gnu` binary can fail. This package includes `@next/swc-wasm-nodejs` and the build script sets `NEXT_SWC_WASM=1` so Next uses the WASM compiler instead.

If you still see SWC/glibc errors, also add this env var in the panel:

```text
NEXT_SWC_WASM=1
```

## After upload

1. Upload and extract the ZIP (no `node_modules`, no `.next`, no `.git`, no real `.env`).
2. Set all env vars in the panel.
3. Trigger install + **`npm run build`** (builds Prisma client, then Next.js into `.next`).
4. Start with **`npm run start`** if required.
5. Run migrations / seed once against the **remote** Hostinger MySQL when ready, e.g. `npx prisma db push` and `npm run db:seed` (SSH or Hostinger terminal) — only after remote DB credentials are set.

## What this ZIP includes

- App source (`src/`), `public/`, `prisma/`
- `package.json` + `package-lock.json`
- `next.config.mjs` (plain JS config — Hostinger-safe)
- `.env.example` (template only)
- This README

## What is excluded

- `node_modules/`, `.next/`, `.git/`
- `src/generated/` (Prisma client) — build clears it and runs `prisma generate` as the app user
- Real `.env` / local secrets
- Local Docker-only tooling is optional; do not point production DB at `localhost:3307`
