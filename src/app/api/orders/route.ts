import { NextResponse } from "next/server";
import type { CatalogId } from "@/data/sajnen-products";
import { isCurrencyCode } from "@/lib/currency-codes";
import { createOrder } from "@/lib/orders";

type Body = {
  email?: string;
  fullName?: string;
  phone?: string;
  shippingLine1?: string;
  shippingLine2?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  displayCurrency?: string;
  items?: Array<{ catalog?: string; slug?: string; quantity?: number }>;
};

function isCatalog(value: string): value is CatalogId {
  return value === "SAJNEN" || value === "OLIVE_WOOD";
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const fullName = body.fullName?.trim() ?? "";
  const shippingLine1 = body.shippingLine1?.trim() ?? "";
  const shippingCity = body.shippingCity?.trim() ?? "";
  const shippingPostalCode = body.shippingPostalCode?.trim() ?? "";
  const displayCurrency = body.displayCurrency?.trim().toUpperCase() ?? "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!fullName) {
    return NextResponse.json({ error: "Full name is required" }, { status: 400 });
  }
  if (!shippingLine1 || !shippingCity || !shippingPostalCode) {
    return NextResponse.json(
      { error: "Shipping address is incomplete" },
      { status: 400 },
    );
  }
  if (!isCurrencyCode(displayCurrency)) {
    return NextResponse.json({ error: "Invalid display currency" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const items = [];
  for (const item of body.items) {
    const catalog = item.catalog ?? "";
    const slug = item.slug?.trim() ?? "";
    const quantity = Number(item.quantity);
    if (!isCatalog(catalog) || !slug) {
      return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
    }
    items.push({ catalog, slug, quantity });
  }

  try {
    const order = await createOrder({
      email,
      fullName,
      phone: body.phone,
      shippingLine1,
      shippingLine2: body.shippingLine2,
      shippingCity,
      shippingPostalCode,
      shippingCountry: body.shippingCountry?.trim() || "Tunisia",
      displayCurrency,
      items,
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order failed";
    const status = message.includes("Unknown product") ? 400 : 503;
    return NextResponse.json({ error: message }, { status });
  }
}
