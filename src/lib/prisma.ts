import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { connection } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.DATABASE_USER ?? "root",
    password: process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME ?? "hannibal_heritage",
    connectionLimit: 5,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Next 16 `cacheComponents`: Prisma/MariaDB I/O can surface as unstable
 * `Date.now()` during prerender. Await `connection()` first so DB work
 * runs at request time (do not use `force-dynamic`).
 */
export async function ensureDbRuntime(): Promise<void> {
  await connection();
}
