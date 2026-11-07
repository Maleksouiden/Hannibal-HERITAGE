# Hannibal HERITAGE

Artisan e-commerce scaffold for **Hannibal HERITAGE** (Sajnen + olive wood catalogs later).

Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + Prisma + MySQL**.

## Prerequisites

- Node.js 20+ (tested with Node 24)
- npm
- MySQL 8+ (or MariaDB 10.11+) running locally on Windows

## Install

```powershell
cd C:\Users\CC\Documents\GitHub\Hannibal
npm install
copy .env.example .env
```

Edit `.env` with your MySQL user, password, and database name.

## MySQL on Windows

1. Install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) **or** [MariaDB](https://mariadb.org/download/) (XAMPP/WAMP also work if MySQL is enabled).
2. During setup, note the root password (or create a dedicated user).
3. Start the MySQL service (Services → `MySQL80` / `MariaDB`, or MySQL Installer → Start).
4. Create the app database:

```sql
CREATE DATABASE hannibal_heritage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Optional dedicated user:

```sql
CREATE USER 'hannibal'@'localhost' IDENTIFIED BY 'your-strong-password';
GRANT ALL PRIVILEGES ON hannibal_heritage.* TO 'hannibal'@'localhost';
FLUSH PRIVILEGES;
```

5. Put those values in `.env` (`DATABASE_URL` plus the `DATABASE_*` fields).

Default port is `3306`. Confirm with:

```powershell
mysql -u root -p -e "SHOW DATABASES;"
```

## Prisma

Generate the client (no live DB required):

```powershell
npm run db:generate
```

After MySQL is up and `.env` is filled:

```powershell
npm run db:migrate
```

Useful commands:

| Script | Purpose |
| --- | --- |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Create/apply migrations (`prisma migrate dev`) |
| `npm run db:push` | Push schema without migration files |
| `npm run db:studio` | Open Prisma Studio |

Starter models: `Category`, `Product`, `ProductImage`, with `Catalog` enum (`SAJNEN`, `OLIVE_WOOD`).

## Run the app

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project notes

- Brand: Hannibal HERITAGE
- Planned UI: sticky centered logo, left menu, cart, currency
- Inspiration: artisancollection.com
- This repo is a **scaffold only** — full shop UI/catalog is not built yet

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
