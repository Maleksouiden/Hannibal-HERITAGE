"use client";

import type { CurrencyCode } from "@/lib/currency-codes";
import {
  convertMajor,
  formatMoney,
  useCurrencyRates,
  useSelectedCurrency,
} from "@/lib/currency-rates-client";

type DisplayPriceProps = {
  /** Stored catalog price in minor units (never mutated). */
  priceMinor: number;
  /** Catalog currency of priceMinor — currently always TND. */
  sourceCurrency?: CurrencyCode;
  className?: string;
};

/**
 * Display-only conversion. Original priceMinor stays in the product/cart data.
 */
export function DisplayPrice({
  priceMinor,
  sourceCurrency = "TND",
  className,
}: DisplayPriceProps) {
  const selected = useSelectedCurrency();
  const rates = useCurrencyRates();
  const major = priceMinor / 1000;

  let label: string;
  if (!rates || selected === sourceCurrency) {
    label = formatMoney(major, sourceCurrency);
  } else {
    const converted = convertMajor(
      major,
      sourceCurrency,
      selected,
      rates.rates,
    );
    label = formatMoney(converted, selected);
  }

  return <span className={className}>{label}</span>;
}
