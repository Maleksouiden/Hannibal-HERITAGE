import { NextResponse } from "next/server";
import { publicUser, requireUser } from "@/lib/auth";

/** Protected account endpoint — requires a valid session cookie. */
export async function GET() {
  const result = await requireUser();
  if ("response" in result) return result.response;
  return NextResponse.json({ user: publicUser(result.user) });
}
