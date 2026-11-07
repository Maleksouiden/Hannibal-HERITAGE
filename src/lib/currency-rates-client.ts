"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { CurrencyCode } from "@/lib/currency-codes";
import {
  getSelectedCurrency,
  subscribeCurrency,
} from "@/lib/currency-preference";
import type { CurrencyRatesPayload } from "@/lib/currency-server";

export function useSelectedCurrency(): CurrencyCode {
  return useSyncExternalStore(
    subscribeCurrency,
    getSelectedCurrency,
    () => "TND",
  );
}

export function useCurrencyRates(): CurrencyRatesPayload | null {
  const [rates, setRates] = useState<CurrencyRatesPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/currency/rates");
        if (!response.ok) return;
        const payload = (await response.json()) as CurrencyRatesPayload;
        if (!cancelled) setRates(payload);
      } catch {
        /* keep previous / null */
      }
    }

    void load();
    const id = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return rates;
}

/** Convert major units using EUR-normalized rates (display only). */
export function convertMajor(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<CurrencyCode, number>,
): number {
  const sourceRate = rates[from];
  const targetRate = rates[to];
  return amount * (targetRate / sourceRate);
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const fractionDigits = currency === "JPY" ? 0 : currency === "TND" ? 3 : 2;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}
