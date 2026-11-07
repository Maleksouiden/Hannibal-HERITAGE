/** Supported display currencies (SCRUM-12). Default TND. */
export const CURRENCY_CODES = [
  "EUR",
  "USD",
  "TND",
  "GBP",
  "CAD",
  "CHF",
  "JPY",
  "AED",
  "SAR",
] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export const DEFAULT_CURRENCY: CurrencyCode = "TND";

export function isCurrencyCode(value: string): value is CurrencyCode {
  return (CURRENCY_CODES as readonly string[]).includes(value);
}
