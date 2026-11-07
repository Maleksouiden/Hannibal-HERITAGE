import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CatalogId } from "@/data/sajnen-products";
import type { CurrencyCode } from "@/lib/currency-codes";
import {
  convertAmount,
  getCurrencyRates,
} from "@/lib/currency-server";
import { resolveUnitPriceMinorAsync } from "@/lib/catalog-lookup";
import { isSellable } from "@/lib/inventory";

export type OrderStatus = "PENDING_PAYMENT" | "PAID_STUB" | "CANCELLED";

export type OrderItemRecord = {
  id: string;
  catalog: CatalogId;
  slug: string;
  name: string;
  quantity: number;
  unitPriceMinorTnd: number;
  lineTotalMinorTnd: number;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  email: string;
  fullName: string;
  phone: string | null;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  subtotalMinorTnd: number;
  displayCurrency: CurrencyCode;
  subtotalDisplay: number;
  paymentStatus: string;
  items: OrderItemRecord[];
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderInput = {
  email: string;
  fullName: string;
  phone?: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  displayCurrency: CurrencyCode;
  items: Array<{ catalog: CatalogId; slug: string; quantity: number }>;
};

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function cuidLike(): string {
  return `c${randomBytes(12).toString("hex")}`;
}

function orderNumber(): string {
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomBytes(2).toString("hex").toUpperCase();
  return `HH-${day}-${suffix}`;
}

async function readOrders(): Promise<OrderRecord[]> {
  try {
    const raw = await readFile(ORDERS_FILE, "utf8");
    const parsed = JSON.parse(raw) as OrderRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeOrders(orders: OrderRecord[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  const orders = await readOrders();
  return orders.find((order) => order.id === id) ?? null;
}

/**
 * Server-side order create: reprice from catalog seed, convert totals via Frankfurter cache.
 * File-backed today; shape matches Prisma Order/OrderItem for SCRUM-14/66 migration.
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<OrderRecord> {
  if (!input.items.length) {
    throw new Error("Cart is empty");
  }

  const items: OrderItemRecord[] = [];
  let subtotalMinorTnd = 0;

  for (const line of input.items) {
    const qty = Math.floor(line.quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      throw new Error(`Invalid quantity for ${line.slug}`);
    }
    const resolved = await resolveUnitPriceMinorAsync(line.catalog, line.slug);
    if (!resolved) {
      throw new Error(`Unknown product ${line.catalog}/${line.slug}`);
    }
    const inventory = resolved.product as {
      stock?: number;
      vendingEnabled?: boolean;
    };
    const stock = inventory.stock ?? 10;
    const vendingEnabled = inventory.vendingEnabled ?? true;
    if (!isSellable({ stock, vendingEnabled })) {
      throw new Error(
        vendingEnabled
          ? `${resolved.product.name} is out of stock`
          : `${resolved.product.name} is not available for sale`,
      );
    }
    if (qty > stock) {
      throw new Error(
        `Only ${stock} in stock for ${resolved.product.name}`,
      );
    }
    const lineTotal = resolved.priceMinor * qty;
    subtotalMinorTnd += lineTotal;
    items.push({
      id: cuidLike(),
      catalog: line.catalog,
      slug: line.slug,
      name: resolved.product.name,
      quantity: qty,
      unitPriceMinorTnd: resolved.priceMinor,
      lineTotalMinorTnd: lineTotal,
    });
  }

  const rates = await getCurrencyRates();
  const subtotalTndMajor = subtotalMinorTnd / 1000;
  const converted = convertAmount(
    subtotalTndMajor,
    "TND",
    input.displayCurrency,
    rates.rates,
  );
  const decimals = input.displayCurrency === "JPY" ? 0 : input.displayCurrency === "TND" ? 3 : 2;
  const factor = 10 ** decimals;
  const subtotalDisplay = Math.round(converted * factor) / factor;

  const now = new Date().toISOString();
  const order: OrderRecord = {
    id: cuidLike(),
    orderNumber: orderNumber(),
    status: "PAID_STUB",
    email: input.email.trim(),
    fullName: input.fullName.trim(),
    phone: input.phone?.trim() || null,
    shippingLine1: input.shippingLine1.trim(),
    shippingLine2: input.shippingLine2?.trim() || null,
    shippingCity: input.shippingCity.trim(),
    shippingPostalCode: input.shippingPostalCode.trim(),
    shippingCountry: input.shippingCountry.trim() || "Tunisia",
    subtotalMinorTnd,
    displayCurrency: input.displayCurrency,
    subtotalDisplay,
    paymentStatus: "stub_confirmed",
    items,
    createdAt: now,
    updatedAt: now,
  };

  const orders = await readOrders();
  orders.unshift(order);
  await writeOrders(orders);
  return order;
}
