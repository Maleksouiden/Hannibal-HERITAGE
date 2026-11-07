import { NextResponse } from "next/server";
import {
  convertAmount,
  getCurrencyRates,
  parseCurrencyParam,
} from "@/lib/currency-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amountRaw = searchParams.get("amount");
  const from = parseCurrencyParam(searchParams.get("from"));
  const to = parseCurrencyParam(searchParams.get("to"));

  if (!from || !to) {
    return NextResponse.json(
      { error: "Invalid or missing from/to currency code" },
      { status: 400 },
    );
  }

  const amount = amountRaw === null ? NaN : Number(amountRaw);
  if (!Number.isFinite(amount) || amount < 0) {
    return NextResponse.json(
      { error: "Invalid amount — must be a non-negative number" },
      { status: 400 },
    );
  }

  try {
    const payload = await getCurrencyRates();
    const convertedAmount = convertAmount(amount, from, to, payload.rates);
    return NextResponse.json({
      amount,
      from,
      to,
      convertedAmount,
      formula: "amount * (targetRate / sourceRate)",
      rates: {
        base: payload.base,
        sourceRate: payload.rates[from],
        targetRate: payload.rates[to],
      },
      publicationDate: payload.publicationDate,
      lastSuccessAt: payload.lastSuccessAt,
      cacheStatus: payload.cacheStatus,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Conversion failed";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
