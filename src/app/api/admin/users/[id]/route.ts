import { NextResponse } from "next/server";
import type { UserRole } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth";
import { ensureDbRuntime, prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

type PatchBody = {
  role?: string;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const role = body.role;
  if (role !== "ADMIN" && role !== "CUSTOMER") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  await ensureDbRuntime();
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (existing.id === auth.user.id && role !== "ADMIN") {
    return NextResponse.json(
      { error: "You cannot remove your own admin role" },
      { status: 400 },
    );
  }

  if (existing.role === "ADMIN" && role === "CUSTOMER") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot demote the last admin" },
        { status: 400 },
      );
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role: role as UserRole },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user });
}
