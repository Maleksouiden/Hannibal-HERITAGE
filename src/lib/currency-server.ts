import {
  CURRENCY_CODES,
  type CurrencyCode,
  isCurrencyCode,
} from "@/lib/currency-codes";

const FRANKFURTER_URL = "https://api.frankfurter.dev/v2/rates?base=EUR";
const CACHE_TTL_MS = 60_000;

export type RatesCacheStatus = "fresh" | "cached" | "stale";

export type CurrencyRatesPayload = {
  base: "EUR";
  rates: Record<CurrencyCode, number>;
  publicationDate: string;
  lastSuccessAt: string;
  cacheStatus: RatesCacheStatus;
};

type FrankfurterRow = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

type CacheEntry = {
  fetchedAt: number;
  payload: CurrencyRatesPayload;
};

let cache: CacheEntry | null = null;
let lastGood: CurrencyRatesPayload | null = null;
let inflight: Promise<CurrencyRatesPayload> | null = null;

function buildRates(rows: FrankfurterRow[]): CurrencyRatesPayload {
  const rates = { EUR: 1 } as Record<CurrencyCode, number>;
  let publicationDate = "";

  for (const code of CURRENCY_CODES) {
    if (code === "EUR") continue;
    const row = rows.find((entry) => entry.quote === code);
    if (!row || typeof row.rate !== "number" || !Number.isFinite(row.rate)) {
      throw new Error(`Missing Frankfurter rate for ${code}`);
    }
    rates[code] = row.rate;
    if (!publicationDate || row.date > publicationDate) {
      publicationDate = row.date;
    }
  }

  return {
    base: "EUR",
    rates,
    publicationDate,
    lastSuccessAt: new Date().toISOString(),
    cacheStatus: "fresh",
  };
}

async function fetchFrankfurterRates(): Promise<CurrencyRatesPayload> {
  const response = await fetch(FRANKFURTER_URL, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Frankfurter HTTP ${response.status}`);
  }
  const rows = (await response.json()) as FrankfurterRow[];
  if (!Array.isArray(rows)) {
    throw new Error("Unexpected Frankfurter payload");
  }
  return buildRates(rows);
}

/** Cached EUR-base rates; ≤60s TTL; single-flight refresh; last-good on outage. */
export async function getCurrencyRates(): Promise<CurrencyRatesPayload> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return { ...cache.payload, cacheStatus: "cached" };
  }

  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    try {
      const payload = await fetchFrankfurterRates();
      cache = { fetchedAt: Date.now(), payload };
      lastGood = payload;
      return payload;
    } catch (error) {
      if (lastGood) {
        return { ...lastGood, cacheStatus: "stale" };
      }
      if (cache) {
        return { ...cache.payload, cacheStatus: "stale" };
      }
      throw error;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<CurrencyCode, number>,
): number {
  const sourceRate = rates[from];
  const targetRate = rates[to];
  if (!sourceRate || !targetRate) {
    throw new Error("Rate missing for conversion");
  }
  return amount * (targetRate / sourceRate);
}

export function parseCurrencyParam(
  value: string | null,
): CurrencyCode | null {
  if (!value) return null;
  const upper = value.trim().toUpperCase();
  return isCurrencyCode(upper) ? upper : null;
}
