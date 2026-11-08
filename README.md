# Hannibal HERITAGE

Artisan e-commerce for **Hannibal HERITAGE** (Sejnane + olive wood).

Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + Prisma + MySQL**.

## Prerequisites

- Node.js 20+ (tested with Node 24)
- npm
- MySQL 8+ **or** Docker Desktop (recommended on Windows)

## Windows one-click setup (blank PC)

Works on a clean Windows machine with nothing installed yet.

1. Download or copy **`setup.exe`** (repo root, same as `setup/dist/setup.exe`).
2. Double-click it. **Approve the UAC prompt** — setup requests Administrator so silent installs work.
3. Wait while it installs missing tools (**Git**, **Node.js LTS**, **Docker Desktop** via winget → Chocolatey → official silent installers), refreshes `PATH`, clones/updates this repo under `%USERPROFILE%\Documents\GitHub\Hannibal` (or the folder next to an existing clone), runs `npm install`, creates `.env`, starts MySQL (`docker compose up -d`), runs Prisma generate / `migrate deploy` / seed, starts `npm run dev`, and opens [http://localhost:3000](http://localhost:3000).

If Docker’s engine needs a reboot/WSL2 on first install, the storefront still starts with the static catalog fallback; re-run `setup.exe` after Docker is ready to finish DB setup.

Details / rebuild: [`setup/README.md`](setup/README.md).

## Install (manual)

```powershell
cd C:\Users\CC\Documents\GitHub\Hannibal
npm install
copy .env.example .env
```

## MySQL on Windows

### Option A — Docker (recommended)

1. Start **Docker Desktop**.
2. From the repo:

```powershell
docker compose up -d
```

3. Defaults match `.env.example` (`hannibal` / `hannibal` / DB `hannibal_heritage` on host port `3307`).

### Option B — Local MySQL / MariaDB / XAMPP

1. Install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/), [MariaDB](https://mariadb.org/download/), or XAMPP with MySQL enabled.
2. Start the service (`MySQL80` / `MariaDB`).
3. Create the database and user:

```sql
CREATE DATABASE hannibal_heritage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hannibal'@'localhost' IDENTIFIED BY 'hannibal';
GRANT ALL PRIVILEGES ON hannibal_heritage.* TO 'hannibal'@'localhost';
FLUSH PRIVILEGES;
```

4. Align `.env` (`DATABASE_URL` + `DATABASE_*`).

## Prisma migrate + seed

```powershell
npm run db:generate
npm run db:migrate
npm run db:seed
```

`db:migrate` prompts for a migration name on first run (e.g. `init_catalogs`).  
`db:seed` loads Sejnane + olive wood from `src/data/*` into `Category` / `Product` / `ProductImage`.

| Script | Purpose |
| --- | --- |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Create/apply migrations |
| `npm run db:push` | Push schema without migration files |
| `npm run db:seed` | Seed catalogs from static Notion-derived data |
| `npm run db:studio` | Open Prisma Studio |

Models: `Category`, `Product`, `ProductImage`, `Order`, `OrderItem`. Catalogs: `SAJNEN`, `OLIVE_WOOD`.

## Run the app

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Catalog data source

- **With MySQL up + seeded:** `/sajnen` and `/olive-wood` (and PDPs) read published products from the database.
- **Fallback:** if `DATABASE_URL` is missing or MySQL is unreachable, the storefront uses the static seed modules under `src/data/` so the site still runs.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
