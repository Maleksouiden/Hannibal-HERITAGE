"use client";

import {
  CURRENCY_CODES,
  DEFAULT_CURRENCY,
  type CurrencyCode,
  isCurrencyCode,
} from "@/lib/currency-codes";

const STORAGE_KEY = "hannibal-currency-v1";

type Listener = () => void;

let selected: CurrencyCode = DEFAULT_CURRENCY;
const listeners = new Set<Listener>();
let hydrated = false;

function emit() {
  for (const listener of listeners) listener();
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && isCurrencyCode(raw)) selected = raw;
  } catch {
    /* ignore */
  }
  hydrated = true;
}

export function getSelectedCurrency(): CurrencyCode {
  ensureHydrated();
  return selected;
}

export function setSelectedCurrency(code: CurrencyCode): void {
  ensureHydrated();
  if (!CURRENCY_CODES.includes(code)) return;
  selected = code;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, code);
  }
  emit();
}

export function subscribeCurrency(listener: Listener): () => void {
  ensureHydrated();
  listeners.add(listener);
  return () => listeners.delete(listener);
}
