"use client";

import type { CatalogId } from "@/data/sajnen-products";

export type CartLine = {
  slug: string;
  catalog: CatalogId;
  name: string;
  imageSrc: string;
  priceMinor: number;
  currency: "TND";
  quantity: number;
};

const STORAGE_KEY = "hannibal-cart-v1";

type Listener = () => void;

let lines: CartLine[] = [];
const listeners = new Set<Listener>();
let hydrated = false;

function emit() {
  for (const listener of listeners) listener();
}

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(next: CartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  lines = readStorage();
  hydrated = true;
}

export function getCartLines(): CartLine[] {
  ensureHydrated();
  return lines;
}

export function getCartCount(): number {
  return getCartLines().reduce((sum, line) => sum + line.quantity, 0);
}

export function subscribeCart(listener: Listener): () => void {
  ensureHydrated();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addToCart(
  item: Omit<CartLine, "quantity">,
  quantity = 1,
): void {
  ensureHydrated();
  const existing = lines.find(
    (line) => line.slug === item.slug && line.catalog === item.catalog,
  );
  if (existing) {
    lines = lines.map((line) =>
      line.slug === item.slug && line.catalog === item.catalog
        ? { ...line, quantity: line.quantity + quantity }
        : line,
    );
  } else {
    lines = [...lines, { ...item, quantity }];
  }
  writeStorage(lines);
  emit();
}
