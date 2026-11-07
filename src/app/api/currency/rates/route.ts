import { NextResponse } from "next/server";
import { getCurrencyRates } from "@/lib/currency-server";

export async function GET() {
  try {
    const payload = await getCurrencyRates();
    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load rates";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
