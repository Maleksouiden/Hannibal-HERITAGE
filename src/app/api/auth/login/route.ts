import { NextResponse } from "next/server";
import {
  createSessionToken,
  publicUser,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Body = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const sessionUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
  const token = await createSessionToken(sessionUser);
  await setSessionCookie(token);

  return NextResponse.json({ user: publicUser(sessionUser) });
}
